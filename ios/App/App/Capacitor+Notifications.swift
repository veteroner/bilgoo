//
//  Capacitor+Notifications.swift
//  App
//
//  Extension to add notification support for view lifecycle
//

import Foundation
import Capacitor

extension Notification.Name {
    static let capacitorViewDidLoad = Notification.Name("CapacitorViewDidLoadNotification")
}

// Add this to CAPBridgeViewController if not already handled
extension CAPBridgeViewController {
    open override func viewDidLoad() {
        super.viewDidLoad()
        
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("🔧 [CAPACITOR] viewDidLoad called - Setting up error handlers")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        
        // Ensure JS error/console handlers and Unity bridge are attached as early as possible
        if let webView = self.bridge?.webView {
            print("✅ [CAPACITOR] WebView found, installing handlers...")
            AppDelegate.shared?.setupWebViewErrorHandling(webView: webView)
            AppDelegate.shared?.addUnityAdsJavaScriptInterface(to: self)

            // CRITICAL: Force load login.html regardless of config
            let targetURL = "capacitor://localhost/login.html"
            print("🔍 [DEBUG] Current WebView URL: \(webView.url?.absoluteString ?? "nil")")
            if webView.url?.absoluteString != targetURL {
                print("🔁 [CAPACITOR] Forcing navigation to login.html")
                if let url = URL(string: targetURL) {
                    webView.load(URLRequest(url: url))
                }
            }


        } else {
            print("❌ [CAPACITOR] WebView NOT found!")
        }
        
        // Notify that view is loaded
        NotificationCenter.default.post(name: .capacitorViewDidLoad, object: self)
    }
}
