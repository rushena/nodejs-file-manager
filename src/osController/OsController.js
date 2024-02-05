import os from 'os';
import EventHandler from '../eventHandler/EventHandler.js';

export default class OsController extends EventHandler{
  constructor() {
    super();

    this.commandsList = {
      '--EOL': this.printEOL,
      '--cpus': this.printCPUS,
      '--homedir': this.printHomeDir,
      '--username': this.printUserName,
      '--architecture': this.printArch
    }
  }

  parseParams(_, ...args) {
    if (args.length < 1) {
      this.dispatchInputError();
    }

    args.forEach((command) => {
      const handler = this.commandsList[command];
      handler && handler.call(this);
    });

    this.dispatchOperationEnd();
  }

  printArch () {
    console.log(`CPU architecture: ${os.arch()}`);
  }

  printEOL() {
    console.log(`Default system EOL:${this.getEOL()}`);
  }

  getEOL() {
    return os.EOL === '\n' ? ' "\\n"' : ' "\\r\\n"';
  }

  printUserName() {
    console.log(`System User Name: ${os.userInfo().username}`);
  }

  printCPUS() {
    const res = os.cpus().map((item) => {
      return {
        "Model": item.model,
        "Clock rate (GHz)": item.speed * 0.001}
    });

    console.log(`Overall amount of CPUS: ${os.availableParallelism()}`);
    console.table(res);
  }

  getHomeDir() {
    return os.homedir();
  }

  printHomeDir() {
    console.log(`Home directory: ${this.getHomeDir()}`);
  }
}