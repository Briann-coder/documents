module.exports = {
  apps: [
    {
      name: 'documents',
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      // PM2 uses env_<name> when started with --env <name>
      env_production: {
        NODE_ENV: 'production',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
