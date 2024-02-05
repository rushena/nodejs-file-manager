import EventHandler from '../eventHandler/EventHandler.js';
import {readdir, stat} from 'fs/promises';
import path from 'path';

export default class NavigationController extends EventHandler {

  constructor() {
    super();

    this.commandsList = {
      'up': this.folderUp,
      'cd': this.getFolder,
      'ls': this.folderChild,
    }
  }

  parseParams(command, ...args) {
    this.commandsList[command].call(this, ...args);
  }

  folderUp() {
    EventHandler.HOME_DIR = path.dirname(EventHandler.HOME_DIR);
    this.dispatchOperationEnd();
  }

  getFolder(newPath) {
    if (!path) {
      this.dispatchInputError();
      return;
    }

    stat(newPath).then((obj) => {
      if (obj.isFile()) {
        this.dispatchOperationError();
        return;
      }
      EventHandler.HOME_DIR = newPath;
    }).catch(() => {
      this.dispatchOperationError();
    }).finally(() => {
      this.dispatchOperationEnd();
    })
  }

  folderChild() {
    readdir(EventHandler.HOME_DIR).then({
      flags: 'r'
    }).then((filenames) => {
      Promise.all(filenames.map(link => {
        return stat(path.join(EventHandler.HOME_DIR, link));
      })).then((res) => {
        console.table(res.map((obj, key) => {
          return {
            "Name": filenames[key],
            "Type": obj.isFile() ? 'file' : 'directory'
          }
        }))
      }).finally(() => {
        this.dispatchOperationEnd();
      })
    }).catch(() => {
      this.dispatchOperationError();
    }).finally(() => {
      this.dispatchOperationEnd();
    })
  }
}