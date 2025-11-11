import UIKit
import Capacitor
import GoogleMobileAds
import WebKit
import UnityAds

// MARK: - JavaScript Error Handler
class JSErrorHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if let errorInfo = message.body as? [String: Any] {
            let messageText = errorInfo["message"] as? String ?? "Unknown error"
            let filename = errorInfo["filename"] as? String ?? "Unknown file"
            let lineno = errorInfo["lineno"] as? Int ?? 0
            let stack = errorInfo["stack"] as? String ?? ""
            let type = errorInfo["type"] as? String ?? "unknown"
            
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("🚨 JAVASCRIPT ERROR CAUGHT 🚨")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("[JS Error] ❌ Type: \(type)")
            print("[JS Error] 💬 Message: \(messageText)")
            print("[JS Error] 📄 File: \(filename):\(lineno)")
            if !stack.isEmpty {
                print("[JS Error] 📚 Stack Trace:")
                print(stack)
            }
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            
            // Also use NSLog for crash reports
            NSLog("[CRITICAL] JS Error: %@ at %@:%d", messageText, filename, lineno)
        } else {
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("🚨 JAVASCRIPT ERROR (RAW) 🚨")
            print("[JS Error] ❌ Raw body: \(message.body)")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        }
    }
}

// MARK: - JavaScript Console Log Handler
class JSConsoleLogHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        print("━━━ [JSConsoleLogHandler] Received message ━━━")
        print("Message body type: \(type(of: message.body))")
        print("Message body: \(message.body)")
        
        if let logInfo = message.body as? [String: Any],
           let level = logInfo["level"] as? String,
           let messageText = logInfo["message"] as? String {
            
            switch level {
            case "log":
                print("[JS Log] 📝 \(messageText)")
            case "warn":
                print("[JS Warn] ⚠️ \(messageText)")
            default:
                print("[JS] \(messageText)")
            }
        } else if let messageText = message.body as? String {
            print("[JS Log] 📝 \(messageText)")
        } else {
            print("[JS Log] ❓ Unknown format: \(message.body)")
        }
    }
}

// MARK: - WebView Navigation Delegate
class WebViewNavigationDelegate: NSObject, WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("[WebView] ❌ Navigation failed: \(error.localizedDescription)")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("[WebView] ❌ Navigation error: \(error.localizedDescription)")
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("[WebView] ✅ Navigation finished")
    }
}

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    static weak var shared: AppDelegate?
    private var hasAddedJavaScriptHandlers = false // Track if handlers are already added
    private var hasInitializedUnityAds = false // Track if Unity Ads is already initialized
    private let jsErrorHandler = JSErrorHandler()
    private let jsConsoleLogHandler = JSConsoleLogHandler()
    private let webViewNavigationDelegate = WebViewNavigationDelegate()
    private let unityAdsJSInterface = UnityAdsJSInterface()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        AppDelegate.shared = self
        
        // AdMob initialization (currently restricted - fallback only)
        GADMobileAds.sharedInstance().start(completionHandler: nil)
        
        // Unity Ads initialization
        // Will be initialized when view controller is ready
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(capacitorViewDidLoad),
            name: .capacitorViewDidLoad,
            object: nil
        )
        
        return true
    }
    
    // MARK: - UISceneSession Lifecycle
    
    @available(iOS 13.0, *)
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        let sceneConfig = UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
        sceneConfig.delegateClass = SceneDelegate.self
        return sceneConfig
    }
    
    @available(iOS 13.0, *)
    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
    }
    
    @objc func capacitorViewDidLoad(_ notification: Notification) {
        guard let bridgeViewController = notification.object as? CAPBridgeViewController else {
            return
        }
        
        // Only add handlers once to prevent "handler already exists" crash
        if !hasAddedJavaScriptHandlers {
            hasAddedJavaScriptHandlers = true
            
            // Add JavaScript error handler to catch JS exceptions
            self.addJavaScriptErrorHandler(to: bridgeViewController)
            
            // Add JavaScript interface immediately (non-blocking)
            DispatchQueue.main.async {
                self.addUnityAdsJavaScriptInterface(to: bridgeViewController)
            }
        }
        
        // Only initialize Unity Ads once
        if !hasInitializedUnityAds {
            hasInitializedUnityAds = true
            
            print("[Unity Ads] Initialization ENABLED - starting after 3s delay")
            
            // Initialize Unity Ads after a short delay to let app load smoothly
            // App will be responsive immediately; ads load in background
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                UnityAdsManager.shared.initialize(viewController: bridgeViewController)
            }
        }
    }
    
    
    func setupWebViewErrorHandling(webView: WKWebView) {
        // Check if handler already exists and remove it first to prevent crash
        let userContentController = webView.configuration.userContentController
        
        // Remove existing handlers if they exist
        userContentController.removeScriptMessageHandler(forName: "JSErrorHandler")
        userContentController.removeScriptMessageHandler(forName: "JSConsoleLog")
        
        // Add JavaScript error handler script - inject at document end (avoid interfering with early init)
        let errorHandlerScript = """
        (function() {
            // Override console methods to catch all logs
            const originalLog = console.log;
            const originalWarn = console.warn;
            const originalError = console.error;
            
            console.log = function(...args) {
                originalLog.apply(console, args);
                try {
                    if (window.webkit?.messageHandlers?.JSConsoleLog) {
                        window.webkit.messageHandlers.JSConsoleLog.postMessage({
                            level: 'log',
                            message: args.map(a => String(a)).join(' ')
                        });
                    }
                } catch (e) {
                    originalError.call(console, 'Failed to send log to native:', e);
                }
            };
            
            console.warn = function(...args) {
                originalWarn.apply(console, args);
                try {
                    if (window.webkit?.messageHandlers?.JSConsoleLog) {
                        window.webkit.messageHandlers.JSConsoleLog.postMessage({
                            level: 'warn',
                            message: args.map(a => String(a)).join(' ')
                        });
                    }
                } catch (e) {
                    originalError.call(console, 'Failed to send warn to native:', e);
                }
            };
            
            console.error = function(...args) {
                originalError.apply(console, args);
                try {
                    if (window.webkit?.messageHandlers?.JSErrorHandler) {
                        window.webkit.messageHandlers.JSErrorHandler.postMessage({
                            message: args.map(a => String(a)).join(' '),
                            type: 'console_error'
                        });
                    }
                } catch (e) {
                    originalError.call(console, 'Failed to send error to native:', e);
                }
            };
            
            // Global error handler - MOST IMPORTANT
            window.addEventListener('error', function(e) {
                const errorMsg = e.message || (e.error && e.error.message) || String(e);
                const errorFile = e.filename || (e.error && e.error.fileName) || 'unknown';
                const errorLine = e.lineno || (e.error && e.error.lineNumber) || 0;
                const errorCol = e.colno || (e.error && e.error.columnNumber) || 0;
                const errorStack = (e.error && e.error.stack) || new Error().stack || 'No stack';
                
                console.error('🔴 JavaScript Error Caught:', errorMsg, 'at', errorFile + ':' + errorLine);
                
                try {
                    if (window.webkit?.messageHandlers?.JSErrorHandler) {
                        window.webkit.messageHandlers.JSErrorHandler.postMessage({
                            message: errorMsg,
                            filename: errorFile,
                            lineno: errorLine,
                            colno: errorCol,
                            stack: errorStack,
                            type: 'error',
                            errorObject: e.error ? String(e.error) : 'none'
                        });
                    }
                } catch (err) {
                    console.error('Failed to send error to native:', err);
                }
                
                // Don't suppress the error - let it bubble
                return false;
            }, true); // Use capture phase to catch ASAP
            
            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', function(e) {
                const reason = e.reason || 'Unknown reason';
                const reasonStr = (reason && reason.message) ? reason.message : String(reason);
                const stack = (reason && reason.stack) ? reason.stack : new Error().stack;
                
                console.error('🔴 Unhandled Promise Rejection:', reasonStr);
                
                try {
                    if (window.webkit?.messageHandlers?.JSErrorHandler) {
                        window.webkit.messageHandlers.JSErrorHandler.postMessage({
                            message: 'Promise Rejection: ' + reasonStr,
                            filename: 'promise',
                            lineno: 0,
                            stack: stack,
                            type: 'promise_rejection'
                        });
                    }
                } catch (err) {
                    console.error('Failed to send rejection to native:', err);
                }
            });
            
            console.log('[WebView] Error handlers initialized successfully');
        })();
        """
        
    let script = WKUserScript(source: errorHandlerScript, injectionTime: .atDocumentEnd, forMainFrameOnly: false)
        webView.configuration.userContentController.addUserScript(script)
        
        // Add message handler for JavaScript errors
        webView.configuration.userContentController.add(jsErrorHandler, name: "JSErrorHandler")
        
        // Add console log handler
        webView.configuration.userContentController.add(jsConsoleLogHandler, name: "JSConsoleLog")
        
        // Set navigation delegate to catch navigation errors (retain handler to avoid deallocation)
        webView.navigationDelegate = webViewNavigationDelegate
        
        print("[App] JavaScript error handler added to webView")
    }
    
    private func addJavaScriptErrorHandler(to bridgeViewController: CAPBridgeViewController) {
        guard let webView = bridgeViewController.bridge?.webView else {
            return
        }
        setupWebViewErrorHandling(webView: webView)
    }
    
    func addUnityAdsJavaScriptInterface(to bridgeViewController: CAPBridgeViewController) {
        guard let webView = bridgeViewController.bridge?.webView else {
            return
        }
        
        // Remove existing handler if it exists to prevent crash
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "UnityAdsIOS")
        
        // Reuse a single JS interface instance to keep strong reference alive
        webView.configuration.userContentController.add(unityAdsJSInterface, name: "UnityAdsIOS")
        
        print("[Unity Ads] JavaScript interface added: window.webkit.messageHandlers.UnityAdsIOS")
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
        
        // Web view'daki tüm medya oynatımını duraklat
        if let window = self.window,
           let rootViewController = window.rootViewController as? CAPBridgeViewController {
            
            // iOS 14.0+ için medya oynatımını duraklat
            if #available(iOS 14.0, *) {
                if #available(iOS 15.0, *) {
                    rootViewController.bridge?.webView?.setAllMediaPlaybackSuspended(true, completionHandler: {
                        print("Media playback suspended")
                    })
                } else {
                    // Fallback on earlier versions
                }
            } else {
                // iOS 13.0 ve öncesi için JavaScript ile kontrol
                rootViewController.bridge?.webView?.evaluateJavaScript("""
                    if (window.quizApp && typeof window.quizApp.pauseAllAudio === 'function') {
                        window.quizApp.pauseAllAudio();
                    }
                """, completionHandler: { result, error in
                    if let error = error {
                        // Log but don't treat as critical - this is a background operation
                        print("[App] Media pause JS eval warning: \(error.localizedDescription)")
                    }
                })
                print("Media pause handled via JavaScript")
            }
        }
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
