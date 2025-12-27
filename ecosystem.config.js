module.exports = {
  apps: [{
    name: 'carrentbaku-backend',
    script: 'npx',
    args: 'tsx server/index.ts',
    cwd: '/var/www/new.carrentbaku.az/source',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: '/var/www/new.carrentbaku.az/server.log',
    out_file: '/var/www/new.carrentbaku.az/server.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    min_uptime: '10s',
    max_restarts: 5,
    restart_delay: 4000,
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
};
