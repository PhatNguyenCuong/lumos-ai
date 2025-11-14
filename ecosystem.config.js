module.exports = {
  apps: [
    {
      name: "lumos-ai-server",
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
      user: "ec2-user", // use "ec2-user" instead if your AMI is Amazon Linux
      host: "ec2-51-20-136-79.eu-north-1.compute.amazonaws.com",
      key: "login-key.pem", // path to your .pem on the local machine running pm2 deploy
      ref: "origin/main",
      repo: "git@github.com:PhatNguyenCuong/lumos-ai.git",
      path: "/var/www/lumos-ai",
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
