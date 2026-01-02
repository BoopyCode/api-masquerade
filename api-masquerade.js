#!/usr/bin/env node

// API Masquerade - Because real APIs are like cats: unpredictable and often ignore you
// Usage: node api-masquerade.js [port]

const http = require('http');
const url = require('url');

const PORT = process.argv[2] || 3000;
const RESPONSE_DELAY = 100; // ms - because waiting builds character

// Our "database" - more reliable than most production APIs
const mockData = {
    '/users': [{ id: 1, name: 'Fake McFakerson', email: 'fake@example.com' }],
    '/products': [{ id: 1, name: 'Virtual Widget', price: 42.42 }],
    '/health': { status: 'healthy', message: 'Lying successfully' }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const path = parsedUrl.pathname;
    
    // Simulate network delay - adds that authentic "is it broken?" feeling
    setTimeout(() => {
        res.setHeader('Content-Type', 'application/json');
        
        // Check if we have mock data for this endpoint
        if (mockData[path]) {
            res.statusCode = 200;
            res.end(JSON.stringify({
                success: true,
                data: mockData[path],
                message: 'Fake data served fresh. You\'re welcome.'
            }));
        } else {
            // 404 - The API's favorite number
            res.statusCode = 404;
            res.end(JSON.stringify({
                success: false,
                error: 'Endpoint not found',
                suggestion: 'Try asking nicely. Or just make it up like we do.'
            }));
        }
    }, RESPONSE_DELAY);
});

server.listen(PORT, () => {
    console.log(`API Masquerade running on port ${PORT}`);
    console.log('Endpoints available:');
    Object.keys(mockData).forEach(endpoint => {
        console.log(`  http://localhost:${PORT}${endpoint}`);
    });
    console.log('\nAll other endpoints return 404 (for authenticity)');
    console.log('Press Ctrl+C to stop lying to your application');
});

// Handle graceful-ish shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down fake API. Your app will have to face reality now.');
    process.exit(0);
});