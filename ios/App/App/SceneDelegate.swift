import UIKit
import Capacitor

@available(iOS 13.0, *)
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        window = UIWindow(windowScene: windowScene)
        
        // Load CAPBridgeViewController from storyboard or create directly
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        if let viewController = storyboard.instantiateInitialViewController() as? CAPBridgeViewController {
            
            // CRITICAL FIX: Override Capacitor config to force login.html as start page
            print("🔧 [SceneDelegate] Forcing serverURL to login.html")
            if let bridge = viewController.bridge {
                // Force load login.html after bridge is ready
                DispatchQueue.main.async {
                    let loginURL = URL(string: "capacitor://localhost/login.html")!
                    let request = URLRequest(url: loginURL)
                    viewController.bridge?.webView?.load(request)
                    print("✅ [SceneDelegate] Loaded login.html explicitly")
                }
            }
            
            window?.rootViewController = viewController
            window?.makeKeyAndVisible()
        } else {
            // Fallback: create CAPBridgeViewController directly
            let viewController = CAPBridgeViewController()
            window?.rootViewController = viewController
            window?.makeKeyAndVisible()
        }
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Called as the scene is being released by the system.
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Called when the scene has moved from an inactive state to an active state.
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Called when the scene will move from an active state to an inactive state.
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Called as the scene transitions from the background to the foreground.
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Called as the scene transitions from the foreground to the background.
        // Pause media playback
        if let window = self.window,
           let rootViewController = window.rootViewController as? CAPBridgeViewController {
            
            if #available(iOS 14.0, *) {
                if #available(iOS 15.0, *) {
                    rootViewController.bridge?.webView?.setAllMediaPlaybackSuspended(true, completionHandler: {
                        print("Media playback suspended")
                    })
                }
            } else {
                rootViewController.bridge?.webView?.evaluateJavaScript("""
                    if (window.quizApp && typeof window.quizApp.pauseAllAudio === 'function') {
                        window.quizApp.pauseAllAudio();
                    }
                """, completionHandler: { result, error in
                    if let error = error {
                        // Log but don't treat as critical - this is a background operation
                        print("[SceneDelegate] Media pause JS eval warning: \(error.localizedDescription)")
                    }
                })
            }
        }
    }
}
