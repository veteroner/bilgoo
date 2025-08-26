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

    currentStatus: null,
    isInitialized: false,

    /**
     * Initialize ATT Manager
     * Should be called early in app lifecycle, before any ads
     */
    init: function() {
        if (this.isInitialized) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            // Only proceed on iOS platform
            if (!this.isIOSPlatform()) {
                console.log('ATT: Not iOS platform, skipping ATT setup');
                this.isInitialized = true;
                resolve('notRequired');
                return;
            }

            // Check if ATT plugin is available
            if (!this.isATTPluginAvailable()) {
                console.error('ATT: Plugin not available');
                this.isInitialized = true;
                resolve('pluginNotAvailable');
                return;
            }

            // Get current status first
            this.getTrackingStatus().then((status) => {
                this.currentStatus = status;
                this.isInitialized = true;
                console.log('ATT: Initialized with status:', status);
                resolve(status);
            }).catch((error) => {
                console.error('ATT: Initialization failed:', error);
                this.isInitialized = true;
                reject(error);
            });
        });
    },

    /**
     * Request tracking permission if needed
     * Returns promise with final status
     */
    requestPermissionIfNeeded: function() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                console.error('ATT: Manager not initialized');
                reject(new Error('ATT Manager not initialized'));
                return;
            }

            if (!this.isIOSPlatform() || !this.isATTPluginAvailable()) {
                resolve('notRequired');
                return;
            }

            this.getTrackingStatus().then((status) => {
                this.currentStatus = status;
                
                if (status === this.STATUS.NOT_DETERMINED) {
                    console.log('ATT: Status is notDetermined, requesting permission...');
                    this.requestTrackingAuthorization().then((newStatus) => {
                        this.currentStatus = newStatus;
                        console.log('ATT: Permission request completed with status:', newStatus);
                        resolve(newStatus);
                    }).catch(reject);
                } else {
                    console.log('ATT: Permission already determined, status:', status);
                    resolve(status);
                }
            }).catch(reject);
        });
    },

    /**
     * Get current tracking authorization status
     */
    getTrackingStatus: function() {
        return new Promise((resolve, reject) => {
            if (!this.isATTPluginAvailable()) {
                resolve('notAvailable');
                return;
            }

            const { AppTrackingTransparency } = window.Capacitor.Plugins;
            
            AppTrackingTransparency.getTrackingAuthorizationStatus().then((result) => {
                resolve(result.status);
            }).catch((error) => {
                console.error('ATT: Failed to get tracking status:', error);
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
                resolve('notAvailable');
                return;
            }

            const { AppTrackingTransparency } = window.Capacitor.Plugins;
            
            // Add a small delay to ensure app is fully loaded
            setTimeout(() => {
                AppTrackingTransparency.requestTrackingAuthorization().then((result) => {
                    console.log('ATT: Authorization request result:', result);
                    resolve(result.status);
                }).catch((error) => {
                    console.error('ATT: Authorization request failed:', error);
                    reject(error);
                });
            }, 500);
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
            canShowPersonalizedAds: this.canShowPersonalizedAds()
        };
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.ATTManager = ATTManager;
}
