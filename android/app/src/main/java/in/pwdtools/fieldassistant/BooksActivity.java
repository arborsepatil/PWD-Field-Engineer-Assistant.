package in.pwdtools.fieldassistant;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.pdf.PdfRenderer;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.UUID;

/**
 * Civil Bandhu private offline PDF shelf.
 * Uses Android Storage Access Framework and PdfRenderer. No network permissions,
 * no Drive credentials, no embedded licensed PDFs and no external file sharing.
 * The user selects a PDF they are permitted to save; it is copied locally.
 */
public final class BooksActivity extends Activity {
    private static final int PICK_PDF = 417;
    private static final long LIMIT_BYTES = 250L * 1024 * 1024;
    private static final String PREF = "civilbandhu_offline_books_v1";
    private static final String INDEX = "books";
    private String category = "Uncategorised";
    private String suggestedTitle = "";
    private PdfRenderer renderer;
    private ParcelFileDescriptor descriptor;
    private Bitmap bitmap;
    private String openedId;
    private int pageIndex;
    private float zoom = 1f;
    private ImageView pageImage;
    private TextView pageCounter;
    private ScrollView pageScroll;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(7,17,31));
        getWindow().setNavigationBarColor(Color.rgb(7,17,31));
        String input = getIntent().getStringExtra("category");
        if (input != null && input.length() <= 90 && input.matches("[A-Za-z0-9 _./()&-]+")) {
            category = input.trim();
        }
        String requested = getIntent().getStringExtra("suggested_title");
        if (requested != null && requested.length() <= 170) suggestedTitle = requested;
        showShelf("");
        if (!suggestedTitle.isEmpty()) selectPdf();
    }

    private int dp(int n) { return Math.round(n * getResources().getDisplayMetrics().density); }
    private TextView label(String value, int size) {
        TextView text = new TextView(this);
        text.setText(value);
        text.setTextSize(size);
        text.setTextColor(Color.rgb(17,34,52));
        text.setPadding(dp(8),dp(8),dp(8),dp(8));
        return text;
    }
    private Button button(String title, View.OnClickListener listener) {
        Button b = new Button(this);
        b.setAllCaps(false);
        b.setText(title);
        b.setOnClickListener(listener);
        return b;
    }
    private LinearLayout column() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(dp(12),dp(12),dp(12),dp(20));
        layout.setBackgroundColor(Color.WHITE);
        return layout;
    }
    private JSONArray allBooks() {
        try {
            return new JSONArray(getSharedPreferences(PREF, MODE_PRIVATE).getString(INDEX, "[]"));
        } catch (Exception e) {
            return new JSONArray();
        }
    }
    private void saveBooks(JSONArray books) {
        getSharedPreferences(PREF, MODE_PRIVATE).edit().putString(INDEX, books.toString()).apply();
    }
    private File bookFile(String id) {
        if (id == null || !id.matches("[a-f0-9-]{36}")) return null;
        File dir = new File(getFilesDir(), "offline-books");
        if (!dir.exists() && !dir.mkdirs()) return null;
        return new File(dir, id + ".pdf");
    }

    private void showShelf(String filter) {
        closeDocument();
        ScrollView scroll = new ScrollView(this);
        LinearLayout list = column();
        scroll.addView(list);
        list.addView(label("Books & References · Offline Shelf", 22));
        list.addView(label("Books downloaded from Drive can be imported here. Your private PDFs stay inside this app; they are not uploaded or distributed.", 14));
        list.addView(button("＋ Add PDF from Files / Google Drive", v -> selectPdf()));
        list.addView(label("Import category: " + category, 12));
        if (!suggestedTitle.isEmpty()) list.addView(label("Select from Files / Drive: " + suggestedTitle, 12));
        EditText search = new EditText(this);
        search.setSingleLine(true);
        search.setHint("Search saved books");
        search.setText(filter);
        list.addView(search);
        JSONArray books = allBooks();
        int listed = 0;
        for (int i = books.length()-1; i >= 0; i--) {
            JSONObject book = books.optJSONObject(i);
            if (book == null) continue;
            String id = book.optString("id", "");
            String title = book.optString("title", "Document");
            String group = book.optString("category", "Uncategorised");
            if (!filter.isEmpty() && !(title + " " + group).toLowerCase().contains(filter.toLowerCase())) continue;
            if (bookFile(id) == null || !bookFile(id).isFile()) continue;
            listed++;
            list.addView(label(title + "\n" + group + " · Saved offline", 14));
            LinearLayout row = new LinearLayout(this);
            row.setOrientation(LinearLayout.HORIZONTAL);
            row.addView(button("Read", v -> openPdf(id, title)), new LinearLayout.LayoutParams(0,dp(50),1));
            row.addView(button("Delete", v -> confirmDelete(id, title)), new LinearLayout.LayoutParams(0,dp(50),1));
            list.addView(row);
        }
        if (listed == 0) list.addView(label("No saved PDFs found. Use Add PDF to import a document.", 13));
        list.addView(button("Search saved PDFs", v -> {
            showShelf(search.getText().toString().trim());
        }));
        if (!filter.isEmpty()) list.addView(button("Show all saved PDFs", v -> showShelf("")));
        setContentView(scroll);
    }

    private void selectPdf() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/pdf");
        try { startActivityForResult(intent, PICK_PDF); }
        catch (Exception e) { Toast.makeText(this, "No Android file picker available.", Toast.LENGTH_LONG).show(); }
    }
    private String displayName(Uri uri) {
        String name = "Imported document.pdf";
        try (Cursor cursor = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                String v = cursor.getString(0);
                if (v != null && !v.isEmpty()) name = v;
            }
        } catch (Exception ignored) {}
        if (name.length() > 140) name = name.substring(0,140);
        return name;
    }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != PICK_PDF || resultCode != RESULT_OK || data == null || data.getData() == null) return;
        Uri uri = data.getData();
        String filename = displayName(uri);
        String selectedCategory = category;
        new Thread(() -> {
            String id = UUID.randomUUID().toString();
            File target = bookFile(id);
            boolean success = false;
            String error = "Import failed.";
            try {
                if (target == null) throw new Exception("Private storage unavailable");
                try (InputStream in = getContentResolver().openInputStream(uri);
                     FileOutputStream out = new FileOutputStream(target)) {
                    if (in == null) throw new Exception("Unable to read selected PDF");
                    byte[] buffer = new byte[32768];
                    int n;
                    long total = 0;
                    int header = 0;
                    byte[] magic = new byte[5];
                    while ((n = in.read(buffer)) != -1) {
                        if (header < 5) {
                            int take = Math.min(n, 5 - header);
                            System.arraycopy(buffer, 0, magic, header, take);
                            header += take;
                        }
                        total += n;
                        if (total > LIMIT_BYTES) throw new Exception("PDF exceeds 250 MB limit");
                        out.write(buffer,0,n);
                    }
                    if (header < 5 || !"%PDF-".equals(new String(magic, java.nio.charset.StandardCharsets.US_ASCII))) {
                        throw new Exception("Selected file is not a valid PDF");
                    }
                    if (total == 0) throw new Exception("PDF is empty");
                }
                // Check the PDF is parsable before keeping it in the shelf.
                try (ParcelFileDescriptor fd = ParcelFileDescriptor.open(target, ParcelFileDescriptor.MODE_READ_ONLY);
                     PdfRenderer check = new PdfRenderer(fd)) {
                    if (check.getPageCount() < 1) throw new Exception("PDF contains no pages");
                }
                JSONArray books = allBooks();
                JSONObject item = new JSONObject();
                item.put("id", id);
                item.put("title", filename);
                item.put("category", selectedCategory);
                item.put("savedAt", System.currentTimeMillis());
                books.put(item);
                saveBooks(books);
                success = true;
            } catch (Exception e) { error = e.getMessage() != null ? e.getMessage() : error; }
            if (!success && target != null) target.delete();
            final boolean ok = success;
            final String message = error;
            runOnUiThread(() -> {
                if (isFinishing()) return;
                Toast.makeText(this, ok ? "PDF saved for offline reading." : message, Toast.LENGTH_LONG).show();
                if (ok) openPdf(id, filename);
                else showShelf("");
            });
        }).start();
    }

    private void confirmDelete(String id, String title) {
        new AlertDialog.Builder(this).setTitle("Remove offline copy?")
            .setMessage(title + "\nThis only deletes the local copy, not your Google Drive file.")
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Remove", (dialog, which) -> {
                File f = bookFile(id);
                if (f != null) f.delete();
                JSONArray source = allBooks();
                JSONArray remaining = new JSONArray();
                for (int i=0; i<source.length(); i++) {
                    JSONObject book = source.optJSONObject(i);
                    if (book != null && !id.equals(book.optString("id"))) remaining.put(book);
                }
                saveBooks(remaining);
                getSharedPreferences(PREF, MODE_PRIVATE).edit().remove("last-page-" + id).apply();
                showShelf("");
            }).show();
    }

    private void openPdf(String id, String title) {
        closeDocument();
        File file = bookFile(id);
        if (file == null || !file.isFile()) {
            Toast.makeText(this, "Offline PDF unavailable.", Toast.LENGTH_SHORT).show();
            showShelf("");
            return;
        }
        try {
            descriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
            renderer = new PdfRenderer(descriptor);
            openedId = id;
            pageIndex = Math.max(0, Math.min(renderer.getPageCount() - 1,
                getSharedPreferences(PREF, MODE_PRIVATE).getInt("last-page-" + id, 0)));
            zoom = 1;
            LinearLayout parent = column();
            parent.addView(button("‹ Books & References", v -> showShelf("")));
            parent.addView(label(title, 18));
            LinearLayout controls = new LinearLayout(this);
            controls.setOrientation(LinearLayout.HORIZONTAL);
            pageCounter = label("", 14);
            controls.addView(button("‹", v -> { if(pageIndex>0){pageIndex--;renderPage();} }),new LinearLayout.LayoutParams(0,dp(48),1));
            controls.addView(pageCounter,new LinearLayout.LayoutParams(0,dp(48),3));
            controls.addView(button("›", v -> { if(renderer != null && pageIndex+1<renderer.getPageCount()){pageIndex++;renderPage();} }),new LinearLayout.LayoutParams(0,dp(48),1));
            parent.addView(controls);
            LinearLayout zoomControls = new LinearLayout(this);
            zoomControls.addView(button("− Zoom", v -> {zoom=Math.max(1,zoom-0.25f);renderPage();}),new LinearLayout.LayoutParams(0,dp(44),1));
            zoomControls.addView(button("＋ Zoom", v -> {zoom=Math.min(2,zoom+0.25f);renderPage();}),new LinearLayout.LayoutParams(0,dp(44),1));
            parent.addView(zoomControls);
            pageScroll = new ScrollView(this);
            HorizontalScrollView horizontal = new HorizontalScrollView(this);
            pageImage = new ImageView(this);
            pageImage.setScaleType(ImageView.ScaleType.FIT_XY);
            horizontal.addView(pageImage);
            pageScroll.addView(horizontal);
            parent.addView(pageScroll,new LinearLayout.LayoutParams(-1,0,1));
            setContentView(parent);
            renderPage();
        } catch (Exception e) {
            Toast.makeText(this, "Cannot read this PDF: " + e.getMessage(), Toast.LENGTH_LONG).show();
            showShelf("");
        }
    }

    private void renderPage() {
        if (renderer == null) return;
        try (PdfRenderer.Page page = renderer.openPage(pageIndex)) {
            float screen = getResources().getDisplayMetrics().widthPixels - dp(35);
            float scale = (screen / Math.max(1,page.getWidth())) * zoom;
            int width = Math.max(1, Math.round(page.getWidth() * scale));
            int height = Math.max(1, Math.round(page.getHeight() * scale));
            if ((long) width * height > 14000000L) {
                double shrink = Math.sqrt(14000000.0 / ((double)width * height));
                width = Math.max(1, (int)(width*shrink));
                height = Math.max(1, (int)(height*shrink));
            }
            Bitmap newBitmap = Bitmap.createBitmap(width,height,Bitmap.Config.ARGB_8888);
            newBitmap.eraseColor(Color.WHITE);
            Matrix matrix = new Matrix();
            matrix.setScale(width / (float) page.getWidth(), height / (float) page.getHeight());
            page.render(newBitmap, null, matrix, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
            pageImage.setImageBitmap(newBitmap);
            pageImage.setLayoutParams(new HorizontalScrollView.LayoutParams(width,height));
            if (bitmap != null) bitmap.recycle();
            bitmap = newBitmap;
            pageCounter.setText("Page " + (pageIndex+1) + " / " + renderer.getPageCount());
            if (openedId != null) getSharedPreferences(PREF, MODE_PRIVATE)
                .edit().putInt("last-page-" + openedId, pageIndex).apply();
            pageScroll.scrollTo(0,0);
        } catch (Exception e) {
            Toast.makeText(this, "Page could not be rendered.", Toast.LENGTH_SHORT).show();
        }
    }

    private void closeDocument() {
        if (pageImage != null) pageImage.setImageDrawable(null);
        pageImage = null;
        if (bitmap != null) { bitmap.recycle(); bitmap = null; }
        try { if (renderer != null) renderer.close(); } catch (Exception ignored) {}
        renderer = null;
        try { if (descriptor != null) descriptor.close(); } catch (Exception ignored) {}
        descriptor = null;
        openedId = null;
    }
    @Override public void onBackPressed() {
        if (openedId != null) showShelf("");
        else super.onBackPressed();
    }
    @Override protected void onDestroy() {
        closeDocument();
        super.onDestroy();
    }
}
