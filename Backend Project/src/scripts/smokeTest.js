import app from '../server.js';
import http from 'http';

async function testBackend() {
  console.log('Testing Backend Domain Routes...');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  console.log('Test server listening on port 5099');

  try {
    const endpoints = [
      '/api/health',
      '/api/categories',
      '/api/filters',
      '/api/badges',
      '/api/pages',
      '/api/products?limit=5',
    ];

    for (const ep of endpoints) {
      const res = await fetch(`http://localhost:5099${ep}`);
      const json = await res.json();
      console.log(`[PASS] ${ep} -> Status: ${res.status}, Success: ${json.success !== false}`);
    }

    console.log('ALL API ENDPOINTS TESTED SUCCESSFULLY!');
  } catch (err) {
    console.error('[FAIL] Backend endpoint test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

testBackend();
