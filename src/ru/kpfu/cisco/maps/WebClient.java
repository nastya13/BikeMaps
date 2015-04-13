package ru.kpfu.cisco.maps;

import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by Кель on 18.11.2014.
 */
public class WebClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        view.loadUrl(url);
        return true;
    }
}
