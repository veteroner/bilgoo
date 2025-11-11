//
//  UnityAdsManager.swift
//  App
//
//  Unity Ads SDK Manager for iOS
//  Handles initialization, loading, and showing ads
//

import Foundation
import UnityAds

class UnityAdsManager: NSObject, UnityAdsInitializationDelegate, UnityAdsLoadDelegate, UnityAdsShowDelegate {
    
    static let shared = UnityAdsManager()
    
    // Unity Game ID for iOS
    private let gameID = "5968312"
    private let testMode = false // Production mode
    
    // Placement IDs
    private let interstitialPlacement = "Interstitial_iOS"
    private let rewardedPlacement = "Rewarded_iOS"
    
    // Ad ready status
    private var isInterstitialReady = false
    private var isRewardedReady = false
    
    // Reward callback
    var rewardCallback: ((Bool) -> Void)?
    
    // Current view controller (needed for showing ads)
    weak var viewController: UIViewController?
    
    private override init() {
        super.init()
    }
    
    // MARK: - Initialization
    
    func initialize(viewController: UIViewController) {
        self.viewController = viewController
        
        print("[Unity Ads] Initializing with Game ID: \(gameID)")
        UnityAds.initialize(gameID, testMode: testMode, initializationDelegate: self)
    }
    
    // MARK: - UnityAdsInitializationDelegate
    
    func initializationComplete() {
        print("[Unity Ads] ✅ Initialization complete")
        loadInterstitial()
        loadRewarded()
    }
    
    func initializationFailed(_ error: UnityAdsInitializationError, withMessage message: String) {
        print("[Unity Ads] ❌ Initialization failed: \(error) - \(message)")
    }
    
    // MARK: - Load Ads
    
    func loadInterstitial() {
        print("[Unity Ads] Loading interstitial...")
        UnityAds.load(interstitialPlacement, loadDelegate: self)
    }
    
    func loadRewarded() {
        print("[Unity Ads] Loading rewarded...")
        UnityAds.load(rewardedPlacement, loadDelegate: self)
    }
    
    // MARK: - Show Ads
    
    func showInterstitial() {
        guard isInterstitialReady, let vc = viewController else {
            print("[Unity Ads] ⚠️ Interstitial not ready or no view controller")
            return
        }
        
        print("[Unity Ads] Showing interstitial...")
        UnityAds.show(vc, placementId: interstitialPlacement, showDelegate: self)
    }
    
    func showRewarded(completion: @escaping (Bool) -> Void) {
        guard isRewardedReady, let vc = viewController else {
            print("[Unity Ads] ⚠️ Rewarded not ready or no view controller")
            completion(false)
            return
        }
        
        self.rewardCallback = completion
        print("[Unity Ads] Showing rewarded...")
        UnityAds.show(vc, placementId: rewardedPlacement, showDelegate: self)
    }
    
    // MARK: - UnityAdsLoadDelegate
    
    func unityAdsAdLoaded(_ placementId: String) {
        print("[Unity Ads] ✅ Ad loaded: \(placementId)")
        
        if placementId == interstitialPlacement {
            isInterstitialReady = true
        } else if placementId == rewardedPlacement {
            isRewardedReady = true
        }
    }
    
    func unityAdsAdFailed(toLoad placementId: String, withError error: UnityAdsLoadError, withMessage message: String) {
        print("[Unity Ads] ❌ Ad failed to load: \(placementId) - \(error) - \(message)")
        
        if placementId == interstitialPlacement {
            isInterstitialReady = false
        } else if placementId == rewardedPlacement {
            isRewardedReady = false
        }
    }
    
    // MARK: - UnityAdsShowDelegate
    
    func unityAdsShowComplete(_ placementId: String, withFinish state: UnityAdsShowCompletionState) {
        print("[Unity Ads] ✅ Ad show complete: \(placementId) - \(state.rawValue)")
        
        if placementId == interstitialPlacement {
            isInterstitialReady = false
            // Reload after 3 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                self.loadInterstitial()
            }
        } else if placementId == rewardedPlacement {
            isRewardedReady = false
            
            // Check if user completed the ad
            if state == .showCompletionStateCompleted {
                rewardCallback?(true)
            } else {
                rewardCallback?(false)
            }
            rewardCallback = nil
            
            // Reload after 3 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                self.loadRewarded()
            }
        }
    }
    
    func unityAdsShowFailed(_ placementId: String, withError error: UnityAdsShowError, withMessage message: String) {
        print("[Unity Ads] ❌ Ad show failed: \(placementId) - \(error) - \(message)")
        
        if placementId == interstitialPlacement {
            isInterstitialReady = false
            loadInterstitial()
        } else if placementId == rewardedPlacement {
            isRewardedReady = false
            rewardCallback?(false)
            rewardCallback = nil
            loadRewarded()
        }
    }
    
    func unityAdsShowStart(_ placementId: String) {
        print("[Unity Ads] 📺 Ad show start: \(placementId)")
    }
    
    func unityAdsShowClick(_ placementId: String) {
        print("[Unity Ads] 👆 Ad clicked: \(placementId)")
    }
    
    // MARK: - Status Check
    
    func isInterstitialAdReady() -> Bool {
        return isInterstitialReady
    }
    
    func isRewardedAdReady() -> Bool {
        return isRewardedReady
    }
}
