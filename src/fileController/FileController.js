import EventHandler from '../eventHandler/EventHandler.js';
import {createReadStream, createWriteStream} from 'fs';
import {rename, rm} from 'fs/promises';
import path from 'path';

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

    newFile.on('ready', () => {
      this.dispatchOperationEnd();
    })
  }

  renameFile (oldPath, newPath) {
    if (!newPath) {
      this.dispatchInputError();
      return;
    }

    const folder = path.dirname(oldPath);
    const newName = path.basename(newPath);

    rename(oldPath, path.join(folder, newName)).catch(() => {
      this.dispatchOperationError();
    }).finally(() => {
      this.dispatchOperationEnd();
    });
  }

  copyFile(copiedFile, newFile) {
    if (!newFile) {
      this.dispatchInputError();
      this.dispatchOperationEnd();
      return;
    }

    const newFilePath = path.join(newFile, path.basename(copiedFile))

    const readStream = createReadStream(copiedFile);
    const writeStream = createWriteStream(newFilePath);

    readStream.on('error', () => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
      writeStream.end();
    })

    writeStream.on('error', () => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    })

    readStream.on('end', () => {
      this.dispatchOperationEnd();
    })

    readStream.pipe(writeStream);
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
      this.dispatchOperationEnd();
    });

    writeStream.on('error', () => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
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