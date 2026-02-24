module.exports = {
  apps: [
    {
      name: 'civic-pulse-server',
      script: './dist/index.js',
      instances: process.env.PM2_INSTANCES || 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      // Auto-restart on errors
      min_uptime: '10s',
      max_restarts: 10,
      // Health monitoring
      health_check_url: 'http://localhost:3000/health',
      health_check_interval: 30000,
      health_check_grace_period: 5000,
    },
  ],
};
