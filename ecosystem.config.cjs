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
    max_memory_restart: '1G',
    error_file: '/var/www/new.carrentbaku.az/server.log',
    out_file: '/var/www/new.carrentbaku.az/server.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    min_uptime: '5s',
    max_restarts: 20,
    restart_delay: 3000,
    kill_timeout: 3000,
    wait_ready: false,
    listen_timeout: 8000,
    env: {
      NODE_ENV: "production",
      PORT: 7423,
      DATABASE_URL: "postgresql://carrent_user:t3mpCarrent!@localhost:5432/carrent_db?schema=public",
    }
  }]
};
