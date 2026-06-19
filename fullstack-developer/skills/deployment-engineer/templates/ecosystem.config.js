// PM2 Ecosystem Configuration
// Production process management for Node.js applications

module.exports = {
  apps: [
    {
      name: 'app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/app',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/app-error.log',
      out_file: '/var/log/pm2/app-out.log',
      log_file: '/var/log/pm2/app-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 8000,
      shutdown_with_message: true
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['server1.example.com', 'server2.example.com'],
      ref: 'origin/main',
      repo: 'git@github.com:user/repo.git',
      path: '/var/www/app',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: 'StrictHostKeyChecking=no'
    },
    staging: {
      user: 'deploy',
      host: 'staging.example.com',
      ref: 'origin/develop',
      repo: 'git@github.com:user/repo.git',
      path: '/var/www/app-staging',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};
