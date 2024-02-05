import EventHandler from '../eventHandler/EventHandler.js';
import {createReadStream, createWriteStream} from 'fs';
import {rename, rm, copyFile} from 'fs/promises';

export default class FileController extends EventHandler {
  constructor() {
    super();

    this.commandsList = {
      'rm': this.deleteFile,
      'mv': this.moveFile,
      'cp': this.copyFile,
      'rn': this.renameFile,
      'add': this.createFile,
      'cat': this.readFile
    }
  }

  parseParams(command, ...args) {
    if (args.length < 1) {
      this.dispatchInputError();
      return;
    }

    this.commandsList[command].call(this, ...args);
  }

  readFile(path) {
    console.log(path);
    const fileRead = createReadStream(path);

    fileRead.on('error', () => {
      this.dispatchOperationError();
    });

    fileRead.on('close', () => {
      this.dispatchOperationEnd();
    })

    fileRead.pipe(process.stdout);
  }

  createFile(path) {
    const newFile = createWriteStream(path);
    newFile.on('error', () => {
      this.dispatchOperationError();
    })

    newFile.on('close', () => {
      this.dispatchOperationEnd();
    })
  }

  renameFile (oldPath, newPath) {
    if (!newPath) {
      this.dispatchInputError();
      return;
    }

    rename(oldPath, newPath).catch(() => {
      this.dispatchOperationError();
    }).finally(() => {
      this.dispatchOperationEnd();
    });
  }

  copyFile(copiedFile, newFile) {
    if (!newFile) {
      this.dispatchInputError();
      return;
    }

    copyFile(copiedFile, newFile).catch(() => {
      this.dispatchOperationError();
    }).finally(() => {
      this.dispatchOperationEnd();
    });
  }

  moveFile(oldPath, newPath) {
    if (!newPath) {
      this.dispatchInputError();
      return;
    }

    const readStream = createReadStream(oldPath);
    const writeStream = createWriteStream(newPath);

    readStream.on('error', () => {
      this.dispatchOperationError();
    });

    writeStream.on('error', () => {
      this.dispatchOperationError();
    });

    readStream.pipe(writeStream);

    writeStream.on('finish', () => {
      this.deleteFile(oldPath);
    });
  }

  deleteFile(filePath) {
    rm(filePath).catch(() => {
      this.dispatchOperationError();
    }).finally(() => {
      this.dispatchOperationEnd();
    });
  }
}