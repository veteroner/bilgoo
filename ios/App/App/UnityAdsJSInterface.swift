//
//  UnityAdsJSInterface.swift
//  App
//
//  JavaScript bridge for Unity Ads on iOS
//  Handles communication between web layer and native Unity Ads
//

import Foundation
import WebKit

class UnityAdsJSInterface: NSObject, WKScriptMessageHandler {
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let action = body["action"] as? String else {
            return
        }
        
        print("[Unity Ads JS] Received action: \(action)")
        
        switch action {
        case "showInterstitial":
            showInterstitial()
            
        case "showRewarded":
            showRewarded(webView: message.webView)
            
        case "isInterstitialReady":
            checkInterstitialReady(webView: message.webView)
            
        case "isRewardedReady":
            checkRewardedReady(webView: message.webView)
            
        default:
            print("[Unity Ads JS] Unknown action: \(action)")
        }
    }
    
    private func showInterstitial() {
        DispatchQueue.main.async {
            UnityAdsManager.shared.showInterstitial()
        }
    }
    
    private func showRewarded(webView: WKWebView?) {
        DispatchQueue.main.async {
            UnityAdsManager.shared.showRewarded { rewarded in
                // Call JavaScript callback
                let js = "if(window.UnityAdsRewardCallback) window.UnityAdsRewardCallback(\(rewarded));"
                webView?.evaluateJavaScript(js) { _, error in
                    if let error = error {
                        print("[Unity Ads JS] Callback error: \(error)")
                    }
                }
            }
        }
    }
    
    private func checkInterstitialReady(webView: WKWebView?) {
        let isReady = UnityAdsManager.shared.isInterstitialAdReady()
        let js = "if(window.UnityAdsInterstitialReadyCallback) window.UnityAdsInterstitialReadyCallback(\(isReady));"
        webView?.evaluateJavaScript(js) { result, error in
            if let error = error {
                // Log but don't treat as critical - callback might not be registered
                print("[Unity Ads JS] Interstitial ready callback warning: \(error.localizedDescription)")
            }
        }
    }
    
    private func checkRewardedReady(webView: WKWebView?) {
        let isReady = UnityAdsManager.shared.isRewardedAdReady()
        let js = "if(window.UnityAdsRewardedReadyCallback) window.UnityAdsRewardedReadyCallback(\(isReady));"
        webView?.evaluateJavaScript(js) { result, error in
            if let error = error {
                // Log but don't treat as critical - callback might not be registered
                print("[Unity Ads JS] Rewarded ready callback warning: \(error.localizedDescription)")
            }
        }
    }
}
