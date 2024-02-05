import OsController from '../osController/OsController.js';
import CompressController from '../compressController/CompressController.js';
import FileController from '../fileController/FileController.js';
import HashController from '../hashController/HashController.js';
import NavigationController from '../navigationController/NavigationController.js';

export default class Controller {
  constructor() {
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

    this.currentPath = '';
  }

  startHandler(value) {
    const valueArr = value.split(' ');
    const command = valueArr.shift();

    Object.entries(this.commandsHandler).forEach(([key, val]) => {
      console.log(key, val);
      console.log(command, valueArr);
    })
  }

  normalizePath() {

  }
}