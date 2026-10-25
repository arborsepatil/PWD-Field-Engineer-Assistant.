package in.pwdtools.fieldassistant;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.content.Context;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JsPromptResult;
import android.widget.Toast;

import androidx.webkit.WebViewAssetLoader;

/**
 * Installable Android application. Its engineering screens are packaged in the APK.
 * This is not a Chrome PWA installation or a Trusted Web Activity.
 * External network pages open in the chosen browser; no JavaScript interface is exposed.
 */
public final class MainActivity extends Activity {
    private static final String BASE_URL = "https://appassets.androidplatform.net/assets/www/";
    private static final String PRINT_PROMPT = "__PWD_ANDROID_PRINT_V1__";
    private static final String CSV_PROMPT = "__PWD_ANDROID_CSV_EXPORT_V1__";
    private static final int CSV_REQUEST = 905;
    private static final int FILE_REQUEST = 904;
    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;
    private String pendingCsvContent;

    @Override
    public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(7, 17, 31));
        getWindow().setNavigationBarColor(Color.rgb(7, 17, 31));
        webView = new WebView(this);
        webView.setBackgroundColor(Color.WHITE);
        webView.setFitsSystemWindows(true);
        setContentView(webView);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true); // The existing calculations require JavaScript.
        settings.setDomStorageEnabled(true); // Device-private PDF index / settings.
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportMultipleWindows(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri.toString().startsWith(BASE_URL)) return false;
                if ("http".equals(uri.getScheme()) || "https".equals(uri.getScheme())) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    } catch (ActivityNotFoundException e) {
                        Toast.makeText(MainActivity.this, "No browser found for this link.", Toast.LENGTH_LONG).show();
                    }
                }
                return true;
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                if (url.startsWith(BASE_URL)) {
                    // WebView has no built-in window.print implementation. Use an origin-
                    // restricted JS prompt rather than an unsafe globally exposed JS bridge.
                    view.evaluateJavascript(
                        "window.print=function(){window.prompt('" + PRINT_PROMPT + "')};", null);
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(
                    WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                try {
                    Intent picker = params.createIntent();
                    picker.addCategory(Intent.CATEGORY_OPENABLE);
                    startActivityForResult(picker, FILE_REQUEST);
                    return true;
                } catch (Exception e) {
                    fileCallback = null;
                    callback.onReceiveValue(null);
                    Toast.makeText(MainActivity.this, "Cannot open Android file picker.", Toast.LENGTH_LONG).show();
                    return true;
                }
            }
            @Override
            public boolean onJsPrompt(WebView view, String url, String message,
                                      String defaultValue, JsPromptResult result) {
                if (url != null && url.startsWith(BASE_URL) && PRINT_PROMPT.equals(message)) {
                    result.confirm("");
                    runOnUiThread(() -> printCurrentPage());
                    return true;
                }

                if (url != null && url.startsWith(BASE_URL)
                        && message != null && message.startsWith(CSV_PROMPT)) {
                    result.confirm("");
                    try {
                        String json = message.substring(CSV_PROMPT.length());
                        if (json.length() > 120000) throw new IllegalArgumentException("Export too large.");
                        JSONObject payload = new JSONObject(json);
                        String content = payload.getString("content");
                        String name = payload.optString("filename", "PWD_RCC_BBS_Draft.csv")
                            .replaceAll("[^A-Za-z0-9._-]", "_");
                        if (name.length() > 100) name = name.substring(0, 96) + ".csv";
                        if (!name.endsWith(".csv")) name += ".csv";
                        if (content.length() > 100000) throw new IllegalArgumentException("CSV too large.");
                        pendingCsvContent = content;
                        Intent save = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                        save.addCategory(Intent.CATEGORY_OPENABLE);
                        save.setType("text/csv");
                        save.putExtra(Intent.EXTRA_TITLE, name);
                        startActivityForResult(save, CSV_REQUEST);
                    } catch (Exception e) {
                        pendingCsvContent = null;
                        Toast.makeText(MainActivity.this, "Could not open CSV save dialog.", Toast.LENGTH_LONG).show();
                    }
                    return true;
                }
                return super.onJsPrompt(view, url, message, defaultValue, result);
            }
        });

        if (state == null) webView.loadUrl(BASE_URL + "index.html");
        else webView.restoreState(state);
    }

    private void printCurrentPage() {
        if (webView == null) return;
        PrintManager manager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
        if (manager != null) {
            manager.print("CivilBandhu — " + webView.getTitle(),
                webView.createPrintDocumentAdapter("CivilBandhu"),
                new PrintAttributes.Builder().build());
        }
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);

        if (code == CSV_REQUEST) {
            try {
                if (result == RESULT_OK && data != null && data.getData() != null && pendingCsvContent != null) {
                    try (OutputStream stream = getContentResolver().openOutputStream(data.getData())) {
                        if (stream == null) throw new IllegalStateException("No writable file.");
                        stream.write(pendingCsvContent.getBytes(StandardCharsets.UTF_8));
                    }
                    Toast.makeText(this, "Draft BBS CSV saved.", Toast.LENGTH_SHORT).show();
                }
            } catch (Exception e) {
                Toast.makeText(this, "CSV save failed. Try Print / Save PDF.", Toast.LENGTH_LONG).show();
            } finally {
                pendingCsvContent = null;
            }
            return;
        }
        if (code == FILE_REQUEST && fileCallback != null) {
            Uri[] uris = WebChromeClient.FileChooserParams.parseResult(result, data);
            fileCallback.onReceiveValue(uris);
            fileCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    public void onSaveInstanceState(Bundle state) {
        if (webView != null) webView.saveState(state);
        super.onSaveInstanceState(state);
    }

    @Override
    protected void onDestroy() {
        if (fileCallback != null) {
            fileCallback.onReceiveValue(null);
            fileCallback = null;
        }
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
