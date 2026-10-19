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
    private static final int FILE_REQUEST = 904;
    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;

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
            manager.print("PWD Field Assistant — " + webView.getTitle(),
                webView.createPrintDocumentAdapter("PWD Field Assistant"),
                new PrintAttributes.Builder().build());
        }
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
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
