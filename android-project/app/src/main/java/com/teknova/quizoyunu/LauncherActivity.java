package com.teknova.quizoyunu;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.TrustedWebActivity;

public class LauncherActivity extends AppCompatActivity {
    
    private static final String TWA_URL = "https://your-domain.com";
    private static final int SPLASH_DELAY = 2000; // 2 saniye splash screen

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_launcher);

        // Splash screen süresi sonunda TWA'yı başlat
        new Handler().postDelayed(() -> {
            launchTrustedWebActivity();
        }, SPLASH_DELAY);
    }

    private void launchTrustedWebActivity() {
        Intent intent = new Intent(this, TrustedWebActivity.class);
        intent.setData(Uri.parse(TWA_URL));
        
        // Intent handling
        Intent originalIntent = getIntent();
        if (originalIntent != null && originalIntent.getData() != null) {
            intent.setData(originalIntent.getData());
        }
        
        startActivity(intent);
        finish(); // LauncherActivity'yi kapat
    }

    @Override
    public void onBackPressed() {
        // Splash screen sırasında geri tuşunu devre dışı bırak
        // super.onBackPressed();
    }
} 