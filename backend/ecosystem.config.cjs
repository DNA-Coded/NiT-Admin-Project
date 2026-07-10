module.exports = {
  apps: [
    {
      name: 'nit-admin-backend',
      script: 'src/server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false, // Do not watch in production
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      // Graceful shutdown settings
      kill_timeout: 10000, // 10 seconds before force kill
      wait_ready: true, // Wait for `process.send('ready')` if implemented, else starts immediately
    },
  ],
};
