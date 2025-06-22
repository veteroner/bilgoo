package com.bilgoo.quizapp;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Android 12+ Splash Screen API
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        
        // Splash screen'i özelleştir
        splashScreen.setKeepOnScreenCondition(() -> false);
        
        super.onCreate(savedInstanceState);
    }
}
