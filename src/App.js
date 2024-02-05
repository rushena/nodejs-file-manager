export class App {
  constructor() {
    this.USER_NAME = this.getUserName();
  }
  start() {
    console.log(`Welcome to the File Manager, ${this.USER_NAME}!`);
    /*process.stdin.on('data', this.onGetStdinData);*/

    process.on('SIGINT', () => {
      this.exitProcess();
    });
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