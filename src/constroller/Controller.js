import path from 'path';
import OsController from '../osController/OsController.js';
import CompressController from '../compressController/CompressController.js';
import FileController from '../fileController/FileController.js';
import HashController from '../hashController/HashController.js';
import NavigationController from '../navigationController/NavigationController.js';
import EventHandler from '../eventHandler/EventHandler.js';

export default class Controller extends EventHandler{
  constructor() {
    super();

    this.osController = new OsController();
    this.compressController = new CompressController();
    this.fileController = new FileController();
    this.hashController = new HashController();
    this.navigationController = new NavigationController();

    this.commandsHandler = {
      'navigationController': ['up', 'cd', 'ls'],
      'fileController': ['cat', 'add', 'rn', 'cp', 'mv', 'rm'],
      'osController': ['os'],
      'compressController': ['compress', 'decompress'],
      'hashController': ['hash']
    }

    this.EOL = this.osController.getEOL();
  }

  startHandler(value) {
    const valueArr = value.trim().replace(this.EOL, '').split(' ');
    const command = valueArr.shift();

    Object.entries(this.commandsHandler).forEach(([key, val]) => {
      if (!val.includes(command)) return;

      this[key].parseParams(command, ...(this.normalizePath(command, valueArr)));
    })
  }

  normalizePath(command, args) {
    if (command === 'os') return args;
    return args.map(link => {
      if (path.isAbsolute(link)) {
        return link;
      }
      return path.join(EventHandler.HOME_DIR, link);
    })
  }
}