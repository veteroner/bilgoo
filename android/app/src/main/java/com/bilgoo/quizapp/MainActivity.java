package com.bilgoo.quizapp;

import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Display;
import android.widget.FrameLayout;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MainActivity extends BridgeActivity {
    private AdView adView;
    private FrameLayout adContainerView;
    
    // Production Banner Ad Unit ID
    private static final String BANNER_AD_UNIT_ID = "ca-app-pub-7610338885240453/6081192537";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Android 12+ Splash Screen API
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        
        // Splash screen'i özelleştir
        splashScreen.setKeepOnScreenCondition(() -> false);
        
        super.onCreate(savedInstanceState);
        
        // Google AdMob'u başlat
        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                // AdMob başlatıldı, banner reklamı yükle
                loadBannerAd();
            }
        });
        
        // Ad container'ı bul
        adContainerView = findViewById(R.id.ad_view_container);
    }
    
    private void loadBannerAd() {
        // AdView oluştur
        adView = new AdView(this);
        adView.setAdUnitId(BANNER_AD_UNIT_ID);
        
        // Adaptive banner boyutu ayarla
        adView.setAdSize(getAdSize());
        
        // Container'a ekle
        if (adContainerView != null) {
            adContainerView.removeAllViews();
            adContainerView.addView(adView);
        }
        
        // Reklam isteği oluştur ve yükle
        AdRequest adRequest = new AdRequest.Builder().build();
        adView.loadAd(adRequest);
    }
    
    private AdSize getAdSize() {
        // Screen genişliğini al
        Display display = getWindowManager().getDefaultDisplay();
        DisplayMetrics outMetrics = new DisplayMetrics();
        display.getMetrics(outMetrics);
        
        float widthPixels = outMetrics.widthPixels;
        float density = outMetrics.density;
        
        int adWidth = (int) (widthPixels / density);
        
        // Anchored adaptive banner döndür
        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(this, adWidth);
    }
    
    @Override
    public void onDestroy() {
        if (adView != null) {
            adView.destroy();
        }
        super.onDestroy();
    }
}
