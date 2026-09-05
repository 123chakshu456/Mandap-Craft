/**
 * Comprehensive Admin API Verification Suite
 * Tests all endpoints connected from the Admin Dashboard to backend & Neon DB
 */
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

const results = [];

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  const start = Date.now();
  try {
    const res = await fetch(url, { ...options, headers });
    const duration = Date.now() - start;
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, duration };
  } catch (err) {
    return { ok: false, status: 0, error: err.message, duration: Date.now() - start };
  }
}

function record(name, endpoint, res, condition = true, notes = '') {
  const passed = res.ok && condition;
  results.push({
    name,
    endpoint,
    status: res.status,
    passed,
    duration: `${res.duration}ms`,
    notes: passed ? notes || 'OK' : (res.data?.message || res.error || 'Failed'),
  });
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: [${res.status}] ${name} (${res.duration}ms) ${notes ? '- ' + notes : ''}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING ADMIN DASHBOARD API HEALTH SUITE');
  console.log('======================================================\n');

  // 1. AUTHENTICATION & SESSION
  console.log('── 1. Authentication & Role Gate ──');
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'shivshaktieventsmart@gmail.com',
      password: 'ShivShakti@2026',
    }),
  });
  authToken = loginRes.data?.data?.token || '';
  record('Admin Login', '/auth/login', loginRes, !!authToken, `Token acquired for ${loginRes.data?.data?.user?.email}`);

  if (!authToken) {
    console.error('❌ Cannot proceed without valid admin auth token.');
    process.exit(1);
  }

  const meRes = await request('/auth/me');
  record('Verify Admin Identity (me)', '/auth/me', meRes, meRes.data?.data?.user?.role === 'ADMIN', `Role: ${meRes.data?.data?.user?.role}`);

  // 2. DASHBOARD OVERVIEW & METRICS
  console.log('\n── 2. Dashboard Analytics & Audit Stream ──');
  const statsRes = await request('/admin/stats');
  record('Dashboard Overview Stats', '/admin/stats', statsRes, statsRes.data?.data?.stats !== undefined, 
    `Products: ${statsRes.data?.data?.stats?.totalProducts}, Orders: ${statsRes.data?.data?.stats?.totalOrders}`);

  const auditRes = await request('/admin/audit-logs?limit=10');
  record('Audit Logs Stream', '/admin/audit-logs?limit=10', auditRes, Array.isArray(auditRes.data?.data?.logs),
    `Logs retrieved: ${auditRes.data?.data?.logs?.length}`);

  // 3. PRODUCT CATALOG MANAGEMENT
  console.log('\n── 3. Product Catalog APIs ──');
  const prodListRes = await request('/products/admin/list?limit=10');
  const totalProducts = prodListRes.data?.data?.total || 0;
  const firstProdId = prodListRes.data?.data?.products?.[0]?.id;
  record('Admin Product List', '/products/admin/list', prodListRes, totalProducts > 0, `Total in DB: ${totalProducts}`);

  if (firstProdId) {
    const prodItemRes = await request(`/products/admin/item/${firstProdId}`);
    record('Get Product Details', `/products/admin/item/:id`, prodItemRes, prodItemRes.data?.data?.product?.id === firstProdId,
      `Item: "${prodItemRes.data?.data?.product?.name?.substring(0, 30)}..."`);
  }

  // 4. CATEGORIES, FILTERS & PROMO BADGES
  console.log('\n── 4. Taxonomic & Badging APIs ──');
  const catTreeRes = await request('/categories/admin/tree');
  const categoriesCount = catTreeRes.data?.data?.categories?.length || 0;
  record('Category Hierarchy Tree', '/categories/admin/tree', catTreeRes, categoriesCount > 0, `Categories: ${categoriesCount}`);

  const filtersRes = await request('/filters/admin/list');
  const filtersCount = filtersRes.data?.data?.filters?.length || 0;
  record('Dynamic Filter Attributes', '/filters/admin/list', filtersRes, filtersCount > 0, `Filter groups: ${filtersCount}`);

  const badgesRes = await request('/badges/admin/list');
  const badgesCount = badgesRes.data?.data?.badges?.length || 0;
  record('Promotional Badges List', '/badges/admin/list', badgesRes, badgesCount > 0, `Badges: ${badgesCount}`);

  // 5. PAGES CMS & MEDIA ASSETS
  console.log('\n── 5. CMS Content & Media Library ──');
  const pagesRes = await request('/pages/admin/list');
  const pagesCount = pagesRes.data?.data?.pages?.length || 0;
  const firstPageId = pagesRes.data?.data?.pages?.[0]?.id;
  record('CMS Pages List', '/pages/admin/list', pagesRes, pagesCount > 0, `Pages: ${pagesCount}`);

  if (firstPageId) {
    const pageItemRes = await request(`/pages/admin/item/${firstPageId}`);
    record('Get Single CMS Page', `/pages/admin/item/:id`, pageItemRes, pageItemRes.data?.data?.page?.id === firstPageId,
      `Slug: /page/${pageItemRes.data?.data?.page?.slug}`);
  }

  const mediaRes = await request('/media?limit=10');
  record('Media Asset Library', '/media', mediaRes, Array.isArray(mediaRes.data?.data?.assets),
    `Total assets: ${mediaRes.data?.data?.total || 0}`);

  // 6. ORDERS & QUOTES PIPELINE
  console.log('\n── 6. Orders & Quotes Pipeline ──');
  const ordersRes = await request('/orders?limit=10');
  record('Order Pipeline Listing', '/orders', ordersRes, Array.isArray(ordersRes.data?.data?.orders),
    `Total orders: ${ordersRes.data?.data?.total || 0}`);

  const quotesRes = await request('/quotes?limit=10');
  record('Quote Inquiries Listing', '/quotes', quotesRes, Array.isArray(quotesRes.data?.data?.quotes),
    `Total quotes: ${quotesRes.data?.data?.total || 0}`);

  // 7. PRODUCT CREATE, UPDATE, TOGGLE & DELETE LIFECYCLE
  console.log('\n── 7. Full Product CRUD Lifecycle Test ──');
  const uniqueSku = `TEST-SKU-${Date.now().toString().slice(-6)}`;
  const createProdRes = await request('/products/admin', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Automated Test Mandap Pillar',
      sku: uniqueSku,
      price: 15000,
      categoryId: 'wedding',
      subcategoryId: 'mandaps',
      description: 'Temporary item for verification test suite.',
      status: 'DRAFT',
    }),
  });
  const createdId = createProdRes.data?.data?.product?.id;
  record('Create Product (POST)', '/products/admin', createProdRes, !!createdId, `Created ID: ${createdId}, SKU: ${uniqueSku}`);

  if (createdId) {
    // Update Product
    const updateProdRes = await request(`/products/admin/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Automated Test Mandap Pillar (Updated)',
        price: 18500,
      }),
    });
    record('Update Product (PUT)', `/products/admin/:id`, updateProdRes, updateProdRes.data?.data?.product?.price === 18500);

    // Publish
    const pubRes = await request(`/products/admin/${createdId}/publish`, { method: 'PATCH' });
    record('Publish Product (PATCH)', `/products/admin/:id/publish`, pubRes, pubRes.data?.data?.product?.status === 'PUBLISHED');

    // Unpublish
    const unpubRes = await request(`/products/admin/${createdId}/unpublish`, { method: 'PATCH' });
    record('Unpublish Product (PATCH)', `/products/admin/:id/unpublish`, unpubRes, unpubRes.data?.data?.product?.status === 'UNPUBLISHED');

    // Delete Product
    const delRes = await request(`/products/admin/${createdId}`, { method: 'DELETE' });
    record('Delete Product (DELETE)', `/products/admin/:id`, delRes, delRes.ok, 'Cleaned up test product');
  }

  // 8. CLOUDINARY CONFIGURATION STATUS
  console.log('\n── 8. External Cloudinary Status ──');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const isCloudinaryConfigured = cloudName && cloudName !== 'your_cloud_name';
  console.log(`Cloudinary Cloud Name: ${cloudName || '(not set)'}`);
  console.log(`Cloudinary Status: ${isCloudinaryConfigured ? '🟢 CONFIGURED' : '🟡 PLACEHOLDER CREDENTIALS (Local/Remote image URLs can still be attached)'}`);

  // SUMMARY
  console.log('\n======================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  console.log(`TEST RESULTS: ${passed}/${total} ENDPOINTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('======================================================\n');
}

runTests().catch(console.error);
