const http = require('http');

const packages = [
  { language: 'javascript', version: '18.15.0' },
  { language: 'python',     version: '3.10.0'  },
  { language: 'typescript', version: '5.0.3'   },
  { language: 'java',       version: '15.0.2'  },
  { language: 'c++',        version: '10.2.0'  },
  { language: 'c',          version: '10.2.0'  },
  { language: 'go',         version: '1.16.2'  },
  { language: 'rust',       version: '1.68.2'  },
  { language: 'csharp.net', version: '5.0.201' },
  { language: 'php',        version: '8.2.3'   },
  { language: 'ruby',       version: '3.0.1'   },
  { language: 'kotlin',     version: '1.8.20'  },
  { language: 'swift',      version: '5.3.3'   },
];

const PISTON_HOST = process.env.PISTON_HOST || 'seek-piston';
const PISTON_PORT = parseInt(process.env.PISTON_PORT || '2000', 10);

function installPackage(pkg) {
  return new Promise((resolve) => {
    const body = JSON.stringify(pkg);
    const options = {
      hostname: PISTON_HOST,
      port: PISTON_PORT,
      path: '/api/v2/packages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 300000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`[${pkg.language}@${pkg.version}] installed: ${result.language}@${result.version}`);
        } catch {
          console.log(`[${pkg.language}] response: ${data.slice(0, 100)}`);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error(`[${pkg.language}] ERROR: ${err.message}`);
      resolve();
    });

    req.on('timeout', () => {
      console.error(`[${pkg.language}] TIMEOUT`);
      req.destroy();
      resolve();
    });

    req.write(body);
    req.end();
  });
}

(async () => {
  console.log(`Installing ${packages.length} Piston packages...\n`);
  for (const pkg of packages) {
    process.stdout.write(`Installing ${pkg.language}@${pkg.version}... `);
    await installPackage(pkg);
  }
  console.log('\nAll packages installed.');
})();
