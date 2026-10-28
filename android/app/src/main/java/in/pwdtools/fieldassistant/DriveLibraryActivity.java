package in.pwdtools.fieldassistant;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.DocumentsContract;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Locale;

/**
 * Private Android document-tree catalogue for the user's LIBRARY folder.
 *
 * No hardcoded Drive file IDs, OAuth tokens or shared PDF assets. The user explicitly
 * chooses a folder using Android's Storage Access Framework, grants persistable
 * read-only access, and may revoke it at any time. Cloud folder support depends
 * on the installed DocumentsProvider; the imported JSON catalogue remains a fallback.
 */
public final class DriveLibraryActivity extends Activity {
    private static final int PICK_TREE = 941;
    private static final String SETTINGS = "civilbandhu_drive_tree_v1";
    private static final String ROOT_KEY = "tree_uri";
    private static final int MAX_FILES = 3500;
    private static final int MAX_DEPTH = 10;
    private static final String[] COLS = {
        DocumentsContract.Document.COLUMN_DOCUMENT_ID,
        DocumentsContract.Document.COLUMN_DISPLAY_NAME,
        DocumentsContract.Document.COLUMN_MIME_TYPE
    };
    private final ArrayList<Doc> docs = new ArrayList<>();
    private final LinkedHashMap<String, Integer> groups = new LinkedHashMap<>();
    private String selected = "All";
    private Uri tree;
    private boolean scanning;
    private TextView status;
    private TextView summary;
    private TextView listLabel;
    private LinearLayout chips;
    private LinearLayout list;
    private EditText search;

    private static final class Doc {
        final String name, category, mime;
        final Uri uri;
        Doc(String name, String category, String mime, Uri uri) {
            this.name=name;this.category=category;this.mime=mime;this.uri=uri;
        }
        boolean isPdf() {
            return "application/pdf".equalsIgnoreCase(mime) || name.toLowerCase(Locale.ROOT).endsWith(".pdf");
        }
    }
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().setStatusBarColor(Color.rgb(7, 17, 31));
        getWindow().setNavigationBarColor(Color.rgb(7, 17, 31));
        String previous = getSharedPreferences(SETTINGS, MODE_PRIVATE).getString(ROOT_KEY, "");
        try { if (!previous.isEmpty()) tree = Uri.parse(previous); } catch (Exception ignored) {}
        buildUI();
        if (tree != null) refresh();
    }
    private int dp(int n) {
        return (int)(n*getResources().getDisplayMetrics().density + 0.5f);
    }
    private TextView txt(String value, int size, boolean bold) {
        TextView v=new TextView(this);
        v.setText(value);
        v.setTextSize(size);
        v.setTextColor(Color.rgb(24, 43, 62));
        if (bold) v.setTypeface(null, 1);
        v.setPadding(dp(5), dp(8), dp(5), dp(8));
        return v;
    }
    private Button btn(String text, View.OnClickListener action) {
        Button b=new Button(this);
        b.setText(text);b.setAllCaps(false);b.setTextSize(12);
        b.setOnClickListener(action);
        return b;
    }
    private void buildUI() {
        ScrollView scroll=new ScrollView(this);
        LinearLayout col=new LinearLayout(this);
        col.setPadding(dp(14),dp(16),dp(14),dp(28));
        col.setOrientation(LinearLayout.VERTICAL);
        col.setBackgroundColor(Color.rgb(247,249,252));
        scroll.addView(col);
        col.addView(txt("Books & References",24,true));
        col.addView(txt("Your private LIBRARY folder · category browsing, search and offline PDF reading",13,false));
        status=txt(tree == null ? "Connect your LIBRARY folder to start." : "Checking connected folder…",13,false);
        col.addView(status);
        LinearLayout actions=new LinearLayout(this);
        actions.setOrientation(LinearLayout.VERTICAL);
        actions.addView(btn("☁  Connect / Change LIBRARY folder",v->chooseFolder()));
        actions.addView(btn("↻  Refresh book list",v->refresh()));
        actions.addView(btn("📖  Downloaded PDFs / Offline shelf",v->openShelf()));
        col.addView(actions);
        summary=txt("No connected folder",12,true);col.addView(summary);
        search=new EditText(this);
        search.setSingleLine(true);
        search.setHint("Search books: IRC 37, IS 456, Bridge…");
        search.setTextSize(15);
        col.addView(search);
        chips=new LinearLayout(this);chips.setOrientation(LinearLayout.HORIZONTAL);
        HorizontalScrollView sideways=new HorizontalScrollView(this);
        sideways.setHorizontalScrollBarEnabled(false);
        sideways.addView(chips);
        col.addView(sideways);
        listLabel=txt("Books",16,true);col.addView(listLabel);
        list=new LinearLayout(this);list.setOrientation(LinearLayout.VERTICAL);col.addView(list);
        search.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s,int start,int count,int after){}
            @Override public void onTextChanged(CharSequence s,int start,int before,int count){renderDocs();}
            @Override public void afterTextChanged(Editable e){}
        });
        col.addView(txt("Files stay in your Google Drive. Only PDFs you choose to save are copied into Civil Bandhu's private offline storage. Folder access can be revoked.",11,false));
        col.addView(btn("Disconnect folder (keeps offline PDFs)",v->disconnect()));
        setContentView(scroll);
        renderCategories();renderDocs();
    }
    private void chooseFolder() {
        Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION |
                   Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION |
                   Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);
        try { startActivityForResult(i,PICK_TREE); }
        catch(ActivityNotFoundException ex) {
            status.setText("This device has no folder picker. Use the private JSON catalogue instead.");
        }
    }
    @Override protected void onActivityResult(int request,int result,Intent data) {
        super.onActivityResult(request,result,data);
        if(request!=PICK_TREE||result!=RESULT_OK||data==null||data.getData()==null)return;
        Uri candidate=data.getData();
        if(!DocumentsContract.isTreeUri(candidate)){
            status.setText("Choose an accessible LIBRARY folder in Android Files.");
            return;
        }
        try{
            getContentResolver().takePersistableUriPermission(
                candidate,Intent.FLAG_GRANT_READ_URI_PERMISSION);
            tree=candidate;
            getSharedPreferences(SETTINGS,MODE_PRIVATE).edit().putString(ROOT_KEY,candidate.toString()).apply();
            selected="All";
            refresh();
        }catch(SecurityException ex){
            status.setText("Read permission denied. Choose the folder again.");
        }
    }
    private void refresh() {
        if(scanning)return;
        if(tree==null){status.setText("Connect your LIBRARY folder first.");return;}
        scanning=true;
        status.setText("Refreshing folders and document list…");
        final Uri chosen=tree;
        new Thread(()->{
            ArrayList<Doc> found=new ArrayList<>();
            LinkedHashMap<String,Integer> categories=new LinkedHashMap<>();
            Exception error=null;
            try{
                String rootId=DocumentsContract.getTreeDocumentId(chosen);
                HashSet<String> visited=new HashSet<>();
                walk(chosen,rootId,"LIBRARY root",0,found,categories,visited);
                found.sort(Comparator.comparing((Doc d)->d.category.toLowerCase(Locale.ROOT))
                    .thenComparing(d->d.name.toLowerCase(Locale.ROOT)));
            }catch(Exception ex){error=ex;}
            final Exception failure=error;
            runOnUiThread(()->{
                scanning=false;
                if(isFinishing()||tree==null||!tree.equals(chosen))return;
                if(failure!=null){
                    status.setText("Folder refresh failed: "+failure.getClass().getSimpleName()+
                        ". Check access, internet and Drive's folder-provider support.");
                    Toast.makeText(this,"Use the JSON catalogue if this Drive provider cannot share a folder.",
                                   Toast.LENGTH_LONG).show();
                    return;
                }
                docs.clear();docs.addAll(found);
                groups.clear();groups.putAll(categories);
                int pdfs=0;for(Doc d:docs)if(d.isPdf())pdfs++;
                summary.setText(docs.size()+" files · "+pdfs+" PDFs · "+groups.size()+" categories");
                status.setText("Library refreshed. Reopen or tap Refresh after adding files in Drive.");
                if(!"All".equals(selected)&&!groups.containsKey(selected))selected="All";
                renderCategories();renderDocs();
            });
        }).start();
    }
    private void walk(Uri root,String docId,String category,int depth,ArrayList<Doc> output,
                      LinkedHashMap<String,Integer> categories,HashSet<String> visited) {
        if(depth>MAX_DEPTH||visited.size()>MAX_FILES)throw new IllegalStateException("Too many folders / nested levels");
        if(!visited.add(docId))return;
        Uri children=DocumentsContract.buildChildDocumentsUriUsingTree(root,docId);
        try(Cursor cursor=getContentResolver().query(children,COLS,null,null,null)){
            if(cursor==null)throw new SecurityException("Folder listing unavailable");
            while(cursor.moveToNext()){
                String id=cursor.getString(0),name=cursor.getString(1),mime=cursor.getString(2);
                if(id==null||name==null||mime==null)continue;
                if(DocumentsContract.Document.MIME_TYPE_DIR.equals(mime)){
                    String childGroup=depth==0?name:category;
                    if(!categories.containsKey(childGroup))categories.put(childGroup,0);
                    walk(root,id,childGroup,depth+1,output,categories,visited);
                }else{
                    if(output.size()>=MAX_FILES)throw new IllegalStateException("Library index limit exceeded");
                    Uri uri=DocumentsContract.buildDocumentUriUsingTree(root,id);
                    output.add(new Doc(name,category,mime,uri));
                    categories.put(category,categories.getOrDefault(category,0)+1);
                }
            }
        }
    }
    private void renderCategories(){
        if(chips==null)return;
        chips.removeAllViews();
        addChip("All",docs.size());
        ArrayList<String> names=new ArrayList<>(groups.keySet());
        Collections.sort(names,String.CASE_INSENSITIVE_ORDER);
        for(String g:names)addChip(g,groups.getOrDefault(g,0));
    }
    private void addChip(String category,int count) {
        Button b=btn(category.replaceAll("^\\d+_","").replace('_',' ')+" ("+count+")",v->{
            selected=category;renderCategories();renderDocs();
        });
        b.setEnabled(!category.equals(selected));
        chips.addView(b);
    }
    private void renderDocs(){
        if(list==null)return;
        list.removeAllViews();
        String q=search==null?"":search.getText().toString().trim().toLowerCase(Locale.ROOT);
        int hits=0,shown=0;
        for(Doc d:docs){
            if(!"All".equals(selected)&&!selected.equals(d.category))continue;
            if(!q.isEmpty()&&!(d.name+" "+d.category).toLowerCase(Locale.ROOT).contains(q))continue;
            hits++;
            if(shown++>=150)continue;
            LinearLayout card=new LinearLayout(this);
            card.setOrientation(LinearLayout.VERTICAL);
            card.setBackgroundColor(Color.WHITE);
            card.setPadding(dp(10),dp(8),dp(10),dp(8));
            LinearLayout.LayoutParams params=new LinearLayout.LayoutParams(-1,-2);
            params.setMargins(0,0,0,dp(9));list.addView(card,params);
            card.addView(txt(d.name,14,true));
            card.addView(txt(d.category+" · "+(d.isPdf()?"PDF":"Document"),11,false));
            if(d.isPdf()) {
                card.addView(btn("↓  Save & Read PDF offline",v->{
                    Intent i=new Intent(this,BooksActivity.class);
                    i.putExtra("category",d.category);
                    i.putExtra("suggested_title",d.name);
                    i.putExtra("source_uri",d.uri.toString());
                    startActivity(i);
                }));
            }else{
                card.addView(btn("Open document",v->{
                    Intent i=new Intent(Intent.ACTION_VIEW);
                    i.setDataAndType(d.uri,d.mime);
                    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    try{startActivity(i);}
                    catch(Exception ex){Toast.makeText(this,"No compatible viewer installed.",Toast.LENGTH_LONG).show();}
                }));
            }
        }
        if(hits==0)list.addView(txt(docs.isEmpty()?
             "Connect your Drive LIBRARY to see books here.":"No matching books.",13,false));
        if(hits>150)list.addView(txt("Showing first 150 of "+hits+" results. Search to narrow the list.",12,false));
        if(listLabel!=null)listLabel.setText(("All".equals(selected)?"Books":selected)+
                                              " · "+hits+" results");
    }
    private void openShelf(){
        startActivity(new Intent(this,BooksActivity.class));
    }
    private void disconnect(){
        if(tree==null)return;
        new AlertDialog.Builder(this).setTitle("Disconnect LIBRARY folder?")
          .setMessage("This removes folder access from Civil Bandhu. Previously saved offline PDFs remain.")
          .setNegativeButton("Cancel",null)
          .setPositiveButton("Disconnect",(dialog,which)->{
              try{getContentResolver().releasePersistableUriPermission(
                  tree,Intent.FLAG_GRANT_READ_URI_PERMISSION);}catch(Exception ignored){}
              tree=null;getSharedPreferences(SETTINGS,MODE_PRIVATE).edit().remove(ROOT_KEY).apply();
              docs.clear();groups.clear();selected="All";summary.setText("No connected folder");
              status.setText("Disconnected. Your offline PDFs are preserved.");
              renderCategories();renderDocs();
          }).show();
    }
}
