package com.bilgoo.quizapp;

import android.app.Activity;
import android.util.Log;
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.UnityAdsShowOptions;

public class UnityAdsManager {
    private static final String TAG = "UnityAdsManager";
    private static final String GAME_ID = "5968313"; // Android Game ID
    private static final boolean TEST_MODE = false; // Production mode
    
    private static final String INTERSTITIAL_PLACEMENT = "Interstitial_Android"; // Unity default placement
    private static final String REWARDED_PLACEMENT = "Rewarded_Android"; // Unity default placement
    
    private Activity activity;
    private boolean isInitialized = false;
    private boolean isInterstitialReady = false;
    private boolean isRewardedReady = false;
    
    public interface RewardCallback {
        void onRewarded();
        void onRewardFailed();
    }
    
    public UnityAdsManager(Activity activity) {
        this.activity = activity;
        initializeAds();
    }
    
    private void initializeAds() {
        Log.d(TAG, "Initializing Unity Ads with Game ID: " + GAME_ID);
        
        UnityAds.initialize(activity.getApplicationContext(), GAME_ID, TEST_MODE, new IUnityAdsInitializationListener() {
            @Override
            public void onInitializationComplete() {
                Log.d(TAG, "Unity Ads initialization complete");
                isInitialized = true;
                loadInterstitial();
                loadRewarded();
            }
            
            @Override
            public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {
                Log.e(TAG, "Unity Ads initialization failed: " + error + " - " + message);
                isInitialized = false;
            }
        });
    }
    
    public void loadInterstitial() {
        if (!isInitialized) return;
        
        UnityAds.load(INTERSTITIAL_PLACEMENT, new IUnityAdsLoadListener() {
            @Override
            public void onUnityAdsAdLoaded(String placementId) {
                Log.d(TAG, "Interstitial ad loaded: " + placementId);
                isInterstitialReady = true;
            }
            
            @Override
            public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {
                Log.e(TAG, "Interstitial failed to load: " + error + " - " + message);
                isInterstitialReady = false;
            }
        });
    }
    
    public void showInterstitial() {
        if (!isInitialized || !isInterstitialReady) {
            Log.w(TAG, "Interstitial not ready");
            return;
        }
        
        UnityAds.show(activity, INTERSTITIAL_PLACEMENT, new UnityAdsShowOptions(), new IUnityAdsShowListener() {
            @Override
            public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError error, String message) {
                Log.e(TAG, "Interstitial show failed: " + error + " - " + message);
                isInterstitialReady = false;
                loadInterstitial();
            }
            
            @Override
            public void onUnityAdsShowStart(String placementId) {
                Log.d(TAG, "Interstitial show start: " + placementId);
            }
            
            @Override
            public void onUnityAdsShowClick(String placementId) {
                Log.d(TAG, "Interstitial clicked: " + placementId);
            }
            
            @Override
            public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                Log.d(TAG, "Interstitial show complete: " + state);
                isInterstitialReady = false;
                loadInterstitial();
            }
        });
    }
    
    public void loadRewarded() {
        if (!isInitialized) return;
        
        UnityAds.load(REWARDED_PLACEMENT, new IUnityAdsLoadListener() {
            @Override
            public void onUnityAdsAdLoaded(String placementId) {
                Log.d(TAG, "Rewarded ad loaded: " + placementId);
                isRewardedReady = true;
            }
            
            @Override
            public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {
                Log.e(TAG, "Rewarded failed to load: " + error + " - " + message);
                isRewardedReady = false;
            }
        });
    }
    
    public void showRewarded(final RewardCallback callback) {
        if (!isInitialized || !isRewardedReady) {
            Log.w(TAG, "Rewarded ad not ready");
            if (callback != null) callback.onRewardFailed();
            return;
        }
        
        UnityAds.show(activity, REWARDED_PLACEMENT, new UnityAdsShowOptions(), new IUnityAdsShowListener() {
            @Override
            public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError error, String message) {
                Log.e(TAG, "Rewarded show failed: " + error + " - " + message);
                isRewardedReady = false;
                loadRewarded();
                if (callback != null) callback.onRewardFailed();
            }
            
            @Override
            public void onUnityAdsShowStart(String placementId) {
                Log.d(TAG, "Rewarded show start: " + placementId);
            }
            
            @Override
            public void onUnityAdsShowClick(String placementId) {
                Log.d(TAG, "Rewarded clicked: " + placementId);
            }
            
            @Override
            public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                Log.d(TAG, "Rewarded show complete: " + state);
                isRewardedReady = false;
                loadRewarded();
                
                if (state == UnityAds.UnityAdsShowCompletionState.COMPLETED) {
                    if (callback != null) callback.onRewarded();
                } else {
                    if (callback != null) callback.onRewardFailed();
                }
            }
        });
    }
    
    public boolean isInterstitialReady() {
        return isInterstitialReady;
    }
    
    public boolean isRewardedReady() {
        return isRewardedReady;
    }
}
