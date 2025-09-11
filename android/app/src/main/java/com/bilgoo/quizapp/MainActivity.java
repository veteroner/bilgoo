package com.bilgoo.quizapp;

import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "QuizApp_AdMob";
    private AdView adView;
    private FrameLayout adContainerView;
    
    // Production Banner Ad Unit ID
    private static final String BANNER_AD_UNIT_ID = "ca-app-pub-7610338885240453/6081192537";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            // Android 12+ Splash Screen API
            SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
            
            // Splash screen'i özelleştir
            splashScreen.setKeepOnScreenCondition(() -> false);
            
            super.onCreate(savedInstanceState);
            
            // 2 saniye bekle sonra AdMob'u başlat
            new android.os.Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    initializeAdMob();
                }
            }, 2000);
            
        } catch (Exception e) {
            Log.e(TAG, "onCreate hatası: " + e.getMessage());
        }
    }
    
    private void initializeAdMob() {
        try {
            Log.d(TAG, "AdMob başlatılıyor...");
            
            MobileAds.initialize(this, new OnInitializationCompleteListener() {
                @Override
                public void onInitializationComplete(InitializationStatus initializationStatus) {
                    Log.d(TAG, "AdMob başlatıldı!");
                    setupAdContainer();
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "AdMob başlatma hatası: " + e.getMessage());
        }
    }
    
    private void setupAdContainer() {
        try {
            Log.d(TAG, "Ad container devre dışı bırakıldı - iOS ile tutarlılık için");
            // iOS ile tutarlılık için Android'de banner reklamı devre dışı bırak
            // Bu şekilde her iki platformda da aynı görünüm elde edilir
            
            /*
            // Basit container oluştur
            adContainerView = new FrameLayout(this);
            adContainerView.setId(android.view.View.generateViewId());
            
            // Ana layout'u bul
            ViewGroup mainLayout = findViewById(android.R.id.content);
            if (mainLayout != null) {
                FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                );
                params.gravity = android.view.Gravity.TOP;
                
                mainLayout.addView(adContainerView, params);
                
                Log.d(TAG, "Container oluşturuldu");
                
                loadBannerAd();
            } else {
                Log.e(TAG, "Ana layout bulunamadı");
            }
            */
        } catch (Exception e) {
            Log.e(TAG, "Container hatası: " + e.getMessage());
        }
    }
    
    private void loadBannerAd() {
        try {
            Log.d(TAG, "Banner reklam yükleme devre dışı - iOS ile tutarlılık için");
            // iOS ile tutarlılık için Android'de banner reklamı devre dışı bırak
            
            /*
            Log.d(TAG, "Banner yükleniyor...");
            
            if (adContainerView == null) {
                return;
            }
            
            // AdView oluştur
            adView = new AdView(this);
            adView.setAdUnitId(BANNER_AD_UNIT_ID);
            adView.setAdSize(AdSize.BANNER);
            
            // Ad listener ekle
            adView.setAdListener(new AdListener() {
                @Override
                public void onAdFailedToLoad(LoadAdError adError) {
                    Log.e(TAG, "Ad hatası: " + adError.getCode() + " - " + adError.getMessage());
                }

                @Override
                public void onAdLoaded() {
                    Log.d(TAG, "Ad yüklendi!");
                }
            });
            
            // Container'a ekle
            adContainerView.removeAllViews();
            adContainerView.addView(adView);
            
            // Ad request
            AdRequest adRequest = new AdRequest.Builder().build();
            adView.loadAd(adRequest);
            */
            
        } catch (Exception e) {
            Log.e(TAG, "Banner hatası: " + e.getMessage());
        }
    }
    
    @Override
    public void onDestroy() {
        try {
            if (adView != null) {
                adView.destroy();
            }
        } catch (Exception e) {
            Log.e(TAG, "Destroy hatası: " + e.getMessage());
        }
        super.onDestroy();
    }
}
