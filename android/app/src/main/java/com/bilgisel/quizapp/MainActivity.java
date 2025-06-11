package com.bilgisel.quizapp;

import android.os.Bundle;
import android.view.WindowManager;
import android.view.Window;
import android.view.View;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            super.onCreate(savedInstanceState);
            
            // Tam ekran ayarları
            setFullScreen();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private void setFullScreen() {
        Window window = getWindow();
        
        // Status bar ve navigation bar'ı gizle
        window.getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
        
        // Windowu fullscreen yap
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        window.clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Resume'da da tam ekran ayarlarını uygula
        setFullScreen();
    }
}
