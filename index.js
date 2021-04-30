const { spawn, execSync } = require('child_process')
const debug = require('debug')('mongodb-docker-server:index');

const config = {
  cwd: __dirname
}

module.exports = {
  cmd: null,
  start(){
    return new Promise((resolve) => {
      this.cmd = spawn('bash', ['./start.sh'], config)

      let isRunning = false;

      const handleMessage = (data) => {
        if (!isRunning && data.indexOf('msg":"Listening on"') !== -1){
          debug(`MongoDB Server is running at: mongodb://127.0.0.1:27017`)
          isRunning = true;
          resolve('mongodb://127.0.0.1:27017');
        }
      }

      this.cmd.stdout.on('data', handleMessage);
      this.cmd.stderr.on('data', handleMessage);
    });
  },
  stop(){
    if (this.cmd){
      this.cmd.kill('SIGINT');
      execSync('docker-compose down', config);
    }
  }
};

process.on('SIGINT', () => {
  console.log(`Processes are shutting down`);
  module.exports.stop();
});
