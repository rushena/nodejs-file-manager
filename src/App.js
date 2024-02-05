import Controller from './constroller/Controller.js';

export class App {

  constructor() {
    this.USER_NAME = this.getUserName();
    this.Controller = new Controller();
  }

  start() {
    console.log(`Welcome to the File Manager, ${this.USER_NAME}!`);

    process.stdin.on('data', (chunk) => {
      this.onGetStdinData(chunk.toString());
    });

    process.on('SIGINT', () => {
      this.exitProcess();
    });
  }

  onGetStdinData(chunk) {
    const value = chunk.toString();

    if (value.trim().toLowerCase() === '.exit') {
      process.emit('SIGINT');
      return;
    }

    this.Controller.startHandler(value)
  }

  exitProcess() {
    process.stdout.write(`\nThank you for using File Manager, ${this.USER_NAME}, goodbye!\n`);
    process.exit(0);
  }

  getUserName() {
    const startCliParams = process.argv.slice(2).filter((param) => param.startsWith('--username'));
    return startCliParams[0]?.split('=')[1] || 'Username';
  }
}

new App();