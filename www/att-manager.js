/**
 * App Tracking Transparency (ATT) Manager
 * Handles iOS 14.5+ App Tracking Transparency permission requests
 * Compatible with capacitor-plugin-app-tracking-transparency
 */

const ATTManager = {
    // ATT Status constants
    STATUS: {
        NOT_DETERMINED: 'notDetermined',
        RESTRICTED: 'restricted', 
        DENIED: 'denied',
        AUTHORIZED: 'authorized'
    },

    // Current status
    currentStatus: null,
    isInitialized: false,

    /**
     * Initialize ATT Manager
     */
    init: function() {
        return new Promise((resolve, reject) => {
            if (this.isInitialized) {
                console.log('[ATT Debug] Already initialized, current status:', this.currentStatus);
                resolve(this.currentStatus);
                return;
            }

            if (!this.isIOSPlatform()) {
                console.log('[ATT Debug] Not iOS platform, skipping ATT');
                this.isInitialized = true;
                resolve('notAvailable');
                return;
            }

            if (!this.isATTPluginAvailable()) {
                console.error('[ATT Debug] ATT plugin not available');
                this.isInitialized = true;
                resolve('notAvailable');
                return;
            }

            console.log('[ATT Debug] Initializing ATT Manager...');
            this.isInitialized = true;

            // Get current status first
            this.getTrackingStatus().then((status) => {
                this.currentStatus = status;
                console.log('[ATT Debug] Current status:', status);
                
                if (status === this.STATUS.NOT_DETERMINED) {
                    console.log('[ATT Debug] Status is notDetermined, requesting permission...');
                    this.requestTrackingAuthorization().then((newStatus) => {
                        this.currentStatus = newStatus;
                        console.log('[ATT Debug] Permission request completed with status:', newStatus);
                        resolve(newStatus);
                    }).catch(reject);
                } else {
                    console.log('[ATT Debug] Permission already determined, status:', status);
                    resolve(status);
                }
            }).catch(reject);
        });
    },

    /**
     * Request permission if needed and not already asked
     */
    requestPermissionIfNeeded: function() {
        return new Promise((resolve, reject) => {
            if (!this.isIOSPlatform()) {
                resolve('notAvailable');
                return;
            }

            // Check if we already asked once (for this app session)
            const alreadyAsked = localStorage.getItem('attAskedOnce');
            if (alreadyAsked) {
                console.log('[ATT Debug] Already asked once this session, skipping');
                resolve(this.currentStatus || 'unknown');
                return;
            }

            this.init().then((status) => {
                localStorage.setItem('attAskedOnce', 'true');
                resolve(status);
            }).catch(reject);
        });
    },

    /**
     * Get current tracking authorization status
     */
    getTrackingStatus: function() {
        return new Promise((resolve, reject) => {
            if (!this.isATTPluginAvailable()) {
                console.log('[ATT Debug] Plugin not available for getTrackingStatus');
                resolve('notAvailable');
                return;
            }

            const { AppTrackingTransparency } = window.Capacitor.Plugins;
            
            console.log('[ATT Debug] Getting tracking authorization status...');
            console.log('[ATT Debug] Plugin object:', AppTrackingTransparency);
            console.log('[ATT Debug] Plugin methods:', Object.keys(AppTrackingTransparency));
            
            // Use correct method name: getStatus instead of getTrackingAuthorizationStatus
            AppTrackingTransparency.getStatus().then((result) => {
                console.log('[ATT Debug] Current tracking status result:', result);
                console.log('[ATT Debug] Status details:', JSON.stringify(result));
                resolve(result.status);
            }).catch((error) => {
                console.error('[ATT Debug] Failed to get tracking status:', error);
                console.error('[ATT Debug] Error type:', typeof error);
                console.error('[ATT Debug] Error stringified:', JSON.stringify(error));
                reject(error);
            });
        });
    },

    /**
     * Request tracking authorization (shows the popup)
     */
    requestTrackingAuthorization: function() {
        return new Promise((resolve, reject) => {
            if (!this.isATTPluginAvailable()) {
                console.log('[ATT Debug] Plugin not available for requestTrackingAuthorization');
                resolve('notAvailable');
                return;
            }

            const { AppTrackingTransparency } = window.Capacitor.Plugins;
            
            console.log('[ATT Debug] About to show ATT popup...');
            console.log('[ATT Debug] App state:', {
                readyState: document.readyState,
                visibilityState: document.visibilityState,
                hasFocus: document.hasFocus?.() || 'unknown'
            });
            console.log('[ATT Debug] AppTrackingTransparency object:', AppTrackingTransparency);
            console.log('[ATT Debug] Available methods:', Object.keys(AppTrackingTransparency));
            
            // Add a small delay to ensure app is fully loaded
            setTimeout(() => {
                console.log('[ATT Debug] Calling AppTrackingTransparency.requestPermission()');
                AppTrackingTransparency.requestPermission().then((result) => {
                    console.log('[ATT Debug] Authorization request result:', result);
                    console.log('[ATT Debug] Result details:', JSON.stringify(result));
                    resolve(result.status);
                }).catch((error) => {
                    console.error('[ATT Debug] Authorization request failed:', error);
                    console.error('[ATT Debug] Error details:', JSON.stringify(error));
                    console.error('[ATT Debug] Error code:', error.code);
                    console.error('[ATT Debug] Error message:', error.message);
                    reject(error);
                });
            }, 1000); // Increased delay
        });
    },

    /**
     * Check if tracking is authorized
     */
    isTrackingAuthorized: function() {
        return this.currentStatus === this.STATUS.AUTHORIZED;
    },

    /**
     * Check if we can show personalized ads
     */
    canShowPersonalizedAds: function() {
        return this.isTrackingAuthorized();
    },

    /**
     * Get ad configuration based on ATT status
     */
    getAdConfig: function() {
        const isPersonalized = this.canShowPersonalizedAds();
        
        return {
            npa: isPersonalized ? '0' : '1', // Non-personalized ads parameter
            trackingEnabled: isPersonalized,
            consentStatus: this.currentStatus || 'unknown'
        };
    },

    /**
     * Helper: Check if running on iOS
     */
    isIOSPlatform: function() {
        return window.Capacitor && window.Capacitor.getPlatform() === 'ios';
    },

    /**
     * Helper: Check if ATT plugin is available
     */
    isATTPluginAvailable: function() {
        console.log('[ATT Debug] Checking plugin availability...');
        console.log('[ATT Debug] window.Capacitor:', !!window.Capacitor);
        console.log('[ATT Debug] window.Capacitor.Plugins:', !!window.Capacitor?.Plugins);
        console.log('[ATT Debug] AppTrackingTransparency plugin:', !!window.Capacitor?.Plugins?.AppTrackingTransparency);
        
        if (window.Capacitor?.Plugins?.AppTrackingTransparency) {
            const plugin = window.Capacitor.Plugins.AppTrackingTransparency;
            console.log('[ATT Debug] Plugin methods:', Object.keys(plugin));
            console.log('[ATT Debug] Has getStatus:', typeof plugin.getStatus);
            console.log('[ATT Debug] Has requestPermission:', typeof plugin.requestPermission);
        }
        
        return !!(window.Capacitor && 
                 window.Capacitor.Plugins && 
                 window.Capacitor.Plugins.AppTrackingTransparency);
    },

    /**
     * Debug: Get current state information
     */
    getDebugInfo: function() {
        return {
            platform: window.Capacitor?.getPlatform() || 'web',
            isIOSPlatform: this.isIOSPlatform(),
            isATTPluginAvailable: this.isATTPluginAvailable(),
            isInitialized: this.isInitialized,
            currentStatus: this.currentStatus,
            isTrackingAuthorized: this.isTrackingAuthorized(),
            canShowPersonalizedAds: this.canShowPersonalizedAds(),
            attAskedOnce: localStorage.getItem('attAskedOnce'),
            capacitorPlugins: Object.keys(window.Capacitor?.Plugins || {}),
            appState: {
                readyState: document.readyState,
                visibilityState: document.visibilityState,
                hasFocus: document.hasFocus?.() || 'unknown'
            }
        };
    },

    /**
     * Debug: Reset ATT state for testing
     */
    resetATTState: function() {
        try {
            localStorage.removeItem('attAskedOnce');
            this.currentStatus = null;
            this.isInitialized = false;
            console.log('[ATT Debug] ATT state reset - next app launch will show popup');
            return true;
        } catch (e) {
            console.error('[ATT Debug] Failed to reset ATT state:', e);
            return false;
        }
    },

    /**
     * Check iOS system ATT settings
     */
    checkSystemATTSettings: async function() {
        if (!this.isIOSPlatform() || !this.isATTPluginAvailable()) {
            return { available: false, reason: 'Not iOS or plugin unavailable' };
        }

        try {
            // Check if "Allow Apps to Request to Track" is enabled in iOS Settings
            console.log('[ATT Debug] Checking system ATT settings...');
            const status = await this.getTrackingStatus();
            
            // If status is 'restricted', it means tracking is disabled system-wide
            if (status === 'restricted') {
                return { 
                    available: false, 
                    reason: 'Tracking disabled in iOS Settings > Privacy & Security > Tracking',
                    solution: 'User needs to enable "Allow Apps to Request to Track" in iOS Settings'
                };
            }
            
            return { available: true, status: status };
        } catch (error) {
            return { available: false, reason: 'Error checking settings', error: error.message };
        }
    }
};

// Make ATTManager globally available
window.ATTManager = ATTManager;
