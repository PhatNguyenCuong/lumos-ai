module.exports = {
  apps: [
    {
      name: "farmtrack-server",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],

  /**
   * PM2 deploy section for AWS EC2.
   * Fill in `host`, `repo`, and `path` for your setup, then run:
   *   pm2 deploy ecosystem.config.js production setup
   *   pm2 deploy ecosystem.config.js production
   */
  deploy: {
    production: {
      user: "ubuntu", // change to "ubuntu" if your AMI is Ubuntu
      host: "ec2-51-20-136-79.eu-north-1.compute.amazonaws.com",
      key: "login-key.pem", // path to your .pem on the local machine running pm2 deploy
      ref: "origin/main",
      repo: "git@github.com:YOUR_GITHUB_USER/farmtrack-server.git",
      path: "/var/www/lumos",
      "post-deploy":
        "npm install && " +
        "python3 -m venv matchcvenv && " +
        "matchcvenv/bin/pip install -r requirements.txt && " +
        "pm2 reload ecosystem.config.js --env production",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  },
};
