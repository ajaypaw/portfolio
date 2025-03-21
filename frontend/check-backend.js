// Script to check if the backend server is running
import http from 'node:http';

const checkServerRunning = (port) => {
  return new Promise((resolve) => {
    const req = http.request({
      method: 'HEAD',
      hostname: 'localhost',
      port: port,
      path: '/api/health',
      timeout: 2000
    }, (res) => {
      resolve(res.statusCode < 400);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Check ports 5000 through 5010
const checkBackendServer = async () => {
  console.log('Checking if backend server is running...');
  
  let serverRunning = false;
  let runningPort = null;
  
  for (let port = 5000; port <= 5010; port++) {
    const running = await checkServerRunning(port);
    if (running) {
      serverRunning = true;
      runningPort = port;
      break;
    }
  }
  
  if (serverRunning) {
    console.log(`✅ Backend server is running on port ${runningPort}`);
    process.exit(0);
  } else {
    console.log('❌ Backend server is not running. Please start the backend server.');
    process.exit(1);
  }
};

checkBackendServer(); 