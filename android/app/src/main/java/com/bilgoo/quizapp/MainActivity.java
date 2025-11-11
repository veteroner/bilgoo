package com.bilgoo.quizapp;

import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "QuizApp_UnityAds";
    private UnityAdsManager unityAdsManager;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
            splashScreen.setKeepOnScreenCondition(() -> false);
            super.onCreate(savedInstanceState);
            initializeUnityAds();
            addJavaScriptInterface();
        } catch (Exception e) {
            Log.e(TAG, "onCreate hatası: " + e.getMessage());
        }
    }
    
    private void initializeUnityAds() {
        unityAdsManager = new UnityAdsManager(this);
        Log.d(TAG, "Unity Ads Manager oluşturuldu");
    }
    
    private void addJavaScriptInterface() {
        try {
            getBridge().getWebView().addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void showInterstitial() {
                    runOnUiThread(() -> {
                        if (unityAdsManager != null) unityAdsManager.showInterstitial();
                    });
                }
                
                @JavascriptInterface
                public void showRewarded() {
                    runOnUiThread(() -> {
                        if (unityAdsManager != null) {
                            unityAdsManager.showRewarded(new UnityAdsManager.RewardCallback() {
                                @Override
                                public void onRewarded() {
                                    getBridge().getWebView().evaluateJavascript(
                                        "if(window.UnityAdsRewardCallback) window.UnityAdsRewardCallback(true);", null);
                                }
                                
                                @Override
                                public void onRewardFailed() {
                                    getBridge().getWebView().evaluateJavascript(
                                        "if(window.UnityAdsRewardCallback) window.UnityAdsRewardCallback(false);", null);
                                }
                            });
                        }
                    });
                }
                
                @JavascriptInterface
                public boolean isInterstitialReady() {
                    return unityAdsManager != null && unityAdsManager.isInterstitialReady();
                }
                
                @JavascriptInterface
                public boolean isRewardedReady() {
                    return unityAdsManager != null && unityAdsManager.isRewardedReady();
                }
            }, "UnityAdsAndroid");
            
            Log.d(TAG, "JavaScript interface eklendi: window.UnityAdsAndroid");
        } catch (Exception e) {
            Log.e(TAG, "JavaScript interface hatası: " + e.getMessage());
        }
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        unityAdsManager = null;
    }
}
