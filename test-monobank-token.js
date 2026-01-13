
const token = 'uKpBgFqzJ55luzXRYEQLdctgkwK9uqLehZQfz0lnY0TY';

async function checkToken() {
  console.log('Checking token...');
  try {
    const response = await fetch('https://api.monobank.ua/personal/client-info', {
      headers: {
        'X-Token': token,
        'User-Agent': 'MeowRoom/1.0'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token is VALID.');
      // Check for jars
      if (data.jars && data.jars.length > 0) {
        console.log('Found Jars Count:', data.jars.length);
        const firstJar = data.jars[0];
        console.log('Example Jar Structure:', JSON.stringify(firstJar, null, 2));
      } else {
        console.log('No Jars found in client info.');
      }
    } else {
      console.error('Token check FAILED:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response:', text);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkToken();
