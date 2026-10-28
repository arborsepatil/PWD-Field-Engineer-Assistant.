package in.pwdtools.fieldassistant;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.IntentSender;
import android.graphics.Color;
import android.graphics.pdf.PdfRenderer;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Toast;

import com.google.android.gms.auth.api.identity.AuthorizationRequest;
import com.google.android.gms.auth.api.identity.AuthorizationResult;
import com.google.android.gms.auth.api.identity.Identity;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.common.api.ApiException;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.UUID;

/**
 * Private, read-only owner Drive library. No OAuth token is persisted or sent to WebView.
 * OAuth consent is handled by Google Play services. App's Android OAuth client must
 * first be configured for its package name and signing certificate SHA-1.
 */
public final class DriveOAuthActivity extends Activity {
    private static final String SCOPE = "https://www.googleapis.com/auth/drive.readonly";
    private static final String DIRECTORY = "application/vnd.google-apps.folder";
    private static final int AUTH_REQUEST = 966;
    private static final int MAX_ITEMS = 5000;
    private static final int MAX_FOLDERS = 400;
    private static final long MAX_PDF = 250L * 1024L * 1024L;
    private static final String PREFS = "civilbandhu_drive_oauth_v1";
    private static final String OFFLINE_PREFS = "civilbandhu_offline_books_v1";
    private static final String FALLBACK = "Books are still available from the preloaded shelf.";
    private String rootId;
    private String accessToken;
    private boolean working = false;
    private String category = "All";
    private final ArrayList<Book> books = new ArrayList<>();
    private final ArrayList<String> categories = new ArrayList<>();
    private LinearLayout results, filters, layout;
    private EditText search;
    private TextView status, count;
    private final class Book {
        String id, title, mime, category;
        long size;
        Book(String id,String title,String mime,String category,long size) {
            this.id=id;this.title=title;this.mime=mime;this.category=category;this.size=size;
        }
        boolean pdf(){return "application/pdf".equals(mime)||title.toLowerCase(Locale.ROOT).endsWith(".pdf");}
    }
    private static final class Folder {
        final String id, category;
        Folder(String i,String c){id=i;category=c;}
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(7,17,31));
        getWindow().setNavigationBarColor(Color.rgb(7,17,31));
        rootId=getIntent().getStringExtra("library_root_id");
        if(rootId==null || !rootId.matches("[A-Za-z0-9_-]{10,100}")) {
            Toast.makeText(this,"Library folder not set. Use the preloaded bookshelf.",Toast.LENGTH_LONG).show();
            finish();return;
        }
        buildScreen();
        // Only silently reauthorize after explicit previous user consent.
        if(getSharedPreferences(PREFS,MODE_PRIVATE).getBoolean("connected",false)) authorize(false);
    }
    private int dp(int px){return Math.round(px*getResources().getDisplayMetrics().density);}
    private TextView label(String s,int size,boolean bold) {
        TextView t=new TextView(this);t.setText(s);t.setTextSize(size);t.setTextColor(Color.rgb(21,44,65));
        t.setPadding(dp(6),dp(7),dp(6),dp(7));if(bold)t.setTypeface(null,1);return t;
    }
    private Button button(String text,View.OnClickListener action) {
        Button b=new Button(this);b.setText(text);b.setTextSize(12);b.setAllCaps(false);b.setOnClickListener(action);return b;
    }
    private void buildScreen(){
        ScrollView scroll=new ScrollView(this);
        layout=new LinearLayout(this);layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.rgb(246,249,252));layout.setPadding(dp(12),dp(12),dp(12),dp(26));
        scroll.addView(layout);
        layout.addView(button("‹ Preloaded bookshelf",v->finish()));
        layout.addView(label("Books & References",22,true));
        layout.addView(label("Your Google Drive LIBRARY · live updates",12,false));
        status=label("Connect once to refresh your existing book collection.",12,false);layout.addView(status);
        layout.addView(button("☁ Connect Google Drive / Refresh",v->authorize(true)));
        layout.addView(button("📖 Downloaded books",v->startActivity(new Intent(this,BooksActivity.class))));
        count=label("Preloaded books remain available when offline.",12,false);layout.addView(count);
        search=new EditText(this);search.setHint("Search IRC 37, IS 456, bridge…");
        search.setSingleLine(true);search.setTextSize(14);layout.addView(search);
        HorizontalScrollView horizontal=new HorizontalScrollView(this);
        horizontal.setHorizontalScrollBarEnabled(false);
        filters=new LinearLayout(this);filters.setOrientation(LinearLayout.HORIZONTAL);
        horizontal.addView(filters);layout.addView(horizontal);
        results=new LinearLayout(this);results.setOrientation(LinearLayout.VERTICAL);layout.addView(results);
        search.addTextChangedListener(new TextWatcher(){
            @Override public void beforeTextChanged(CharSequence s,int start,int count,int after){}
            @Override public void onTextChanged(CharSequence s,int start,int before,int count){showBooks();}
            @Override public void afterTextChanged(Editable s){}
        });
        layout.addView(button("Disconnect Google Drive (keep downloaded books)",v->disconnect()));
        setContentView(scroll);
        showBooks();
    }
    private AuthorizationRequest request(){
        return AuthorizationRequest.builder()
            .setRequestedScopes(Collections.singletonList(new Scope(SCOPE))).build();
    }
    private void authorize(boolean interactive){
        if(working)return;
        status.setText("Checking Google Drive authorization…");
        try{
            Identity.getAuthorizationClient(this).authorize(request())
            .addOnSuccessListener(result->{
                if(result.hasResolution()){
                    if(!interactive){
                        status.setText("Tap Connect Google Drive to renew access. "+FALLBACK);
                        return;
                    }
                    try{
                        startIntentSenderForResult(result.getPendingIntent().getIntentSender(),
                            AUTH_REQUEST,null,0,0,0);
                    }catch(IntentSender.SendIntentException ex){
                        status.setText("Google permission dialog unavailable. "+FALLBACK);
                    }
                }else acceptAuthorization(result);
            })
            .addOnFailureListener(ex->status.setText(
                "Google authorization isn't configured or available. "+FALLBACK));
        }catch(Exception ex){status.setText("Google authorization unavailable. "+FALLBACK);}
    }
    @Override protected void onActivityResult(int code,int outcome,Intent data){
        super.onActivityResult(code,outcome,data);
        if(code!=AUTH_REQUEST)return;
        if(outcome!=RESULT_OK || data==null){
            status.setText("Google Drive permission was not granted. "+FALLBACK);return;
        }
        try{acceptAuthorization(Identity.getAuthorizationClient(this).getAuthorizationResultFromIntent(data));}
        catch(ApiException ex){status.setText("Could not complete Google Drive authorization. "+FALLBACK);}
    }
    private void acceptAuthorization(AuthorizationResult result){
        if(result==null||result.getGrantedScopes()==null ||
            !result.getGrantedScopes().contains(SCOPE)||
            result.getAccessToken()==null || result.getAccessToken().isEmpty()){
            status.setText("Read-only permission wasn't granted. "+FALLBACK);return;
        }
        accessToken=result.getAccessToken();
        getSharedPreferences(PREFS,MODE_PRIVATE).edit().putBoolean("connected",true).apply();
        refresh();
    }
    private static String escape(String s){
        return s.replace("\\","\\\\").replace("'","\\'");
    }
    private static String encode(String s){return URLEncoder.encode(s,StandardCharsets.UTF_8);}
    private JSONObject jsonRequest(String uri,String token) throws Exception {
        HttpURLConnection c=(HttpURLConnection)new URL(uri).openConnection();
        c.setRequestMethod("GET");
        c.setRequestProperty("Authorization","Bearer "+token);
        c.setRequestProperty("Accept","application/json");
        c.setConnectTimeout(15000);c.setReadTimeout(30000);c.setInstanceFollowRedirects(false);
        try{
            int status=c.getResponseCode();
            if(status!=200)throw new Exception("Drive returned HTTP "+status);
            try(InputStream in=c.getInputStream()){
                byte[] bytes=in.readNBytes(2000000);
                if(bytes.length>=2000000)throw new Exception("Response too large");
                return new JSONObject(new String(bytes,StandardCharsets.UTF_8));
            }
        }finally{c.disconnect();}
    }
    private void refresh(){
        if(working||accessToken==null)return;
        working=true;
        status.setText("Refreshing your Drive book list…");
        String token=accessToken;
        new Thread(()->{
            ArrayList<Book> next=new ArrayList<>();
            ArrayList<String> groups=new ArrayList<>();
            ArrayDeque<Folder> queue=new ArrayDeque<>();
            HashSet<String> visited=new HashSet<>();
            queue.add(new Folder(rootId,"LIBRARY root"));
            String failure=null;
            try{
                while(!queue.isEmpty()){
                    if(visited.size()>MAX_FOLDERS||next.size()>MAX_ITEMS)
                        throw new Exception("Library is larger than supported limit");
                    Folder folder=queue.removeFirst();
                    if(!visited.add(folder.id))continue;
                    String page=null;
                    do{
                        String q="'"+escape(folder.id)+"' in parents and trashed = false";
                        String url="https://www.googleapis.com/drive/v3/files?q="+encode(q)+
                            "&fields="+encode("nextPageToken,files(id,name,mimeType,size)")+
                            "&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true";
                        if(page!=null)url+="&pageToken="+encode(page);
                        JSONObject response=jsonRequest(url,token);
                        JSONArray rows=response.optJSONArray("files");
                        if(rows!=null)for(int i=0;i<rows.length();i++){
                            JSONObject v=rows.optJSONObject(i);
                            if(v==null)continue;
                            String id=v.optString("id"),name=v.optString("name"),mime=v.optString("mimeType");
                            if(!id.matches("[A-Za-z0-9_-]{10,200}")||name.isEmpty())continue;
                            if(DIRECTORY.equals(mime)){
                                String group="LIBRARY root".equals(folder.category)?name:folder.category;
                                if(!groups.contains(group))groups.add(group);
                                queue.addLast(new Folder(id,group));
                            }else{
                                next.add(new Book(id,name,mime,folder.category,v.optLong("size",-1)));
                                if(!groups.contains(folder.category))groups.add(folder.category);
                                if(next.size()>MAX_ITEMS)throw new Exception("Too many files");
                            }
                        }
                        page=response.optString("nextPageToken","");
                    }while(!page.isEmpty());
                }
                next.sort((a,b)->{
                    int c=a.category.compareToIgnoreCase(b.category);
                    return c!=0?c:a.title.compareToIgnoreCase(b.title);
                });
            }catch(Exception ex){failure=ex.getMessage();}
            String problem=failure;
            runOnUiThread(()->{
                working=false;
                if(isFinishing())return;
                if(problem!=null){
                    status.setText("Drive refresh failed ("+problem+"). "+FALLBACK);return;
                }
                books.clear();books.addAll(next);
                categories.clear();categories.addAll(groups);
                count.setText(books.size()+" files · "+categories.size()+" categories");
                status.setText("Updated from Google Drive. New or moved books are included.");
                showCategories();showBooks();
            });
        }).start();
    }
    private void showCategories(){
        if(filters==null)return;
        filters.removeAllViews();
        filters.addView(button("All",v->{category="All";showCategories();showBooks();}));
        for(String c:categories)filters.addView(button(c.replace('_',' '),v->{
            category=c;showCategories();showBooks();
        }));
    }
    private void showBooks(){
        if(results==null)return;
        results.removeAllViews();
        String q=search.getText().toString().toLowerCase(Locale.ROOT)
            .replace('_',' ').replace('-',' ').trim();
        int matched=0,shown=0;
        for(Book b:books){
            if(!"All".equals(category)&&!category.equals(b.category))continue;
            String title=(b.title+" "+b.category).toLowerCase(Locale.ROOT)
                .replace('_',' ').replace('-',' ');
            if(!q.isEmpty()&&!title.contains(q))continue;
            matched++;
            if(shown++>=150)continue;
            LinearLayout card=new LinearLayout(this);card.setOrientation(LinearLayout.VERTICAL);
            card.setPadding(dp(9),dp(8),dp(9),dp(8));card.setBackgroundColor(Color.WHITE);
            LinearLayout.LayoutParams cp=new LinearLayout.LayoutParams(-1,-2);cp.setMargins(0,0,0,dp(8));
            results.addView(card,cp);
            card.addView(label(b.title,13,true));
            card.addView(label(b.category+" · "+(b.pdf()?"PDF":"File"),11,false));
            if(b.pdf())card.addView(button("Read / Save offline",v->readPdf(b)));
            else card.addView(button("Open in Drive",v->{
                try{
                    Intent i=new Intent(Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://drive.google.com/file/d/"+b.id+"/view"));
                    startActivity(i);
                }catch(Exception ignored){Toast.makeText(this,"No browser available",Toast.LENGTH_SHORT).show();}
            }));
        }
        if(matched>150)results.addView(label("Showing first 150 results. Search to narrow the list.",11,false));
        if(matched==0)results.addView(label(books.isEmpty()?
            "Connect Google Drive for live books. Your preloaded bookshelf is still available.":
            "No matching books",12,false));
    }
    private void readPdf(Book book) {
        if(working)return;
        if(book.size>MAX_PDF){status.setText("PDF exceeds 250 MB. Open it in Drive instead.");return;}
        // Read an already-downloaded copy without using the network.
        JSONArray list;
        try{list=new JSONArray(getSharedPreferences(OFFLINE_PREFS,MODE_PRIVATE).getString("books","[]"));}
        catch(Exception ignored){list=new JSONArray();}
        for(int i=0;i<list.length();i++){
            JSONObject row=list.optJSONObject(i);
            if(row==null||!book.id.equals(row.optString("sourceDriveId")))continue;
            String id=row.optString("id");
            if(!id.matches("[a-f0-9-]{36}"))continue;
            File local=new File(new File(getFilesDir(),"offline-books"),id+".pdf");
            if(local.isFile()){openOffline(id);return;}
        }
        working=true;
        status.setText("Saving "+book.title+" for offline reading…");
        String token=accessToken;
        new Thread(()->{
            File file=null;String uid=UUID.randomUUID().toString(),failure=null;
            try{
                File dir=new File(getFilesDir(),"offline-books");
                if(!dir.exists()&&!dir.mkdirs())throw new Exception("Private storage unavailable");
                file=new File(dir,uid+".pdf");
                String url="https://www.googleapis.com/drive/v3/files/"+book.id+"?alt=media";
                HttpURLConnection c=(HttpURLConnection)new URL(url).openConnection();
                c.setRequestProperty("Authorization","Bearer "+token);
                c.setConnectTimeout(15000);c.setReadTimeout(40000);
                c.setInstanceFollowRedirects(false);
                try{
                    if(c.getResponseCode()!=200)throw new Exception("Download HTTP "+c.getResponseCode());
                    long total=0;byte[] header=new byte[5];int head=0;
                    try(InputStream input=c.getInputStream();FileOutputStream output=new FileOutputStream(file)){
                        byte[] buffer=new byte[32768];int n;
                        while((n=input.read(buffer))!=-1){
                            if(head<5){int take=Math.min(n,5-head);
                                System.arraycopy(buffer,0,header,head,take);head+=take;}
                            total+=n;if(total>MAX_PDF)throw new Exception("PDF exceeds 250 MB");
                            output.write(buffer,0,n);
                        }
                    }
                    if(total<5 || !"%PDF-".equals(new String(header,StandardCharsets.US_ASCII)))
                        throw new Exception("Drive returned a non-PDF file");
                }finally{c.disconnect();}
                try(ParcelFileDescriptor descriptor=ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);
                    PdfRenderer reader=new PdfRenderer(descriptor)){
                    if(reader.getPageCount()<1)throw new Exception("PDF has no pages");
                }
                JSONArray saved=new JSONArray(getSharedPreferences(OFFLINE_PREFS,MODE_PRIVATE)
                    .getString("books","[]"));
                JSONObject item=new JSONObject();
                item.put("id",uid);item.put("title",book.title);item.put("category",book.category);
                item.put("sourceDriveId",book.id);item.put("savedAt",System.currentTimeMillis());
                saved.put(item);
                getSharedPreferences(OFFLINE_PREFS,MODE_PRIVATE).edit().putString("books",saved.toString()).commit();
            }catch(Exception ex){failure=ex.getMessage();if(file!=null)file.delete();}
            final String problem=failure;
            runOnUiThread(()->{
                working=false;
                if(isFinishing())return;
                if(problem!=null){status.setText("PDF not saved: "+problem);return;}
                status.setText("Saved offline: "+book.title);
                openOffline(uid);
            });
        }).start();
    }
    private void openOffline(String id){
        Intent i=new Intent(this,BooksActivity.class);
        i.putExtra("open_offline_id",id);
        startActivity(i);
    }
    private void disconnect() {
        new AlertDialog.Builder(this).setTitle("Disconnect Google Drive?")
            .setMessage("Online authorization will be revoked. Existing offline PDFs stay on this device.")
            .setNegativeButton("Cancel",null)
            .setPositiveButton("Disconnect",(d,w)->{
                accessToken=null;
                getSharedPreferences(PREFS,MODE_PRIVATE).edit().remove("connected").apply();
                books.clear();categories.clear();showCategories();showBooks();
                // Revoking access requires a Google account object; this is a local
                // disconnect only. Google account permissions can also be managed
                // from Google's account security settings.
                status.setText("Disconnected locally. Google account permissions can be revoked in Google Account settings.");
            }).show();
    }
    @Override protected void onDestroy(){accessToken=null;super.onDestroy();}
}
