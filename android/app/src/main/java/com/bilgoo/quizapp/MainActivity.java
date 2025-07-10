package com.bilgoo.quizapp;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MainActivity extends BridgeActivity {
    
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
                // AdMob başlatıldı
            }
        });
    }
}
