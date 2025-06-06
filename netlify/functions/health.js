// Netlify Function - Health Check
// Sistem durumu kontrolü

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        const healthStatus = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: 'netlify',
            hosting: 'static',
            functions: 'active',
            region: process.env.AWS_REGION || 'unknown',
            version: '1.1.0'
        };
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(healthStatus)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
}; 