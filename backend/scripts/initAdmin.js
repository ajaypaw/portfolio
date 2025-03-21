import fetch from 'node-fetch';

const initAdmin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/init-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Admin user created successfully:', data);
    } else {
      console.error('Error creating admin user:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

initAdmin(); 