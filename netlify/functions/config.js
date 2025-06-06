// Netlify Function - Config Endpoint
// Firebase configuration için güvenli endpoint

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'X-Security-Policy': 'Netlify-Protected'
    };
    
    // Preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    // Sadece GET isteğine izin ver
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ 
                error: 'Method not allowed',
                code: 'METHOD_NOT_ALLOWED' 
            })
        };
    }
    
    try {
        // Netlify Environment Variables'dan Firebase config al
        const config = {
            firebase: {
                apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0",
                authDomain: process.env.FIREBASE_AUTH_DOMAIN || "bilgisel-3e9a0.firebaseapp.com",
                databaseURL: process.env.FIREBASE_DATABASE_URL || "https://bilgisel-3e9a0-default-rtdb.firebaseio.com",
                projectId: process.env.FIREBASE_PROJECT_ID || "bilgisel-3e9a0",
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "bilgisel-3e9a0.appspot.com",
                messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "921907280109",
                appId: process.env.FIREBASE_APP_ID || "1:921907280109:web:7d9b4844067a7a1ac174e4",
                measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XH10LS7DW8"
            },
            security: {
                environment: 'netlify',
                hosting: 'static',
                timestamp: new Date().toISOString()
            }
        };
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                config: config,
                timestamp: new Date().toISOString(),
                source: 'netlify-function'
            })
        };
        
    } catch (error) {
        console.error('Config function error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                code: 'CONFIG_ERROR'
            })
        };
    }
}; 