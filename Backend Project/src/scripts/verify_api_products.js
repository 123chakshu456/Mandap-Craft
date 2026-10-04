async function check() {
  const res = await fetch('http://localhost:5000/api/products?category=catering&subcategory=catering-equipment&limit=10');
  const d = await res.json();
  console.log('Total catering equipment products in DB:', d.data.total);
  d.data.products.slice(0, 5).forEach((p, idx) => {
    console.log(`\n[${idx + 1}] ${p.name}`);
    console.log(`    Base Price: ₹${p.price}`);
    console.log(`    Images (${p.images?.length}):`, p.images?.map(i => i.url).join(', '));
    if (p.presetSizes && p.presetSizes.length > 0) {
      console.log(`    Models (${p.presetSizes.length}):`);
      p.presetSizes.slice(0, 4).forEach(m => {
        console.log(`      * ${m.model} | Motor: ${m.motor || '-'} | Cap: ${m.capacity || '-'} | Size: ${m.size || '-'} | Rate: ₹${m.price}`);
      });
      if (p.presetSizes.length > 4) {
        console.log(`      ... and ${p.presetSizes.length - 4} more models`);
      }
    }
  });
}
check().catch(console.error);
