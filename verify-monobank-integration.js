
const token = 'uKpBgFqzJ55luzXRYEQLdctgkwK9uqLehZQfz0lnY0TY';
const jarId = 'vNjUI46HAOxH9x2MwVU3vSPd0nXXX6g'; // Valid jar ID

async function testEndpoints() {
  console.log('--- Testing /bank/jar/{id} WITH Token ---');
  try {
    const res = await fetch(`https://api.monobank.ua/bank/jar/${jarId}`, {
      headers: { 'X-Token': token }
    });
    console.log('Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Error text:', await res.text());
    }
  } catch (e) {
    console.error('Error:', e);
  }

  console.log('\n--- Testing /bank/jar/{id} WITHOUT Token ---');
  try {
    const res = await fetch(`https://api.monobank.ua/bank/jar/${jarId}`);
    console.log('Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Error text:', await res.text());
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

testEndpoints();
