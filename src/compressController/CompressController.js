import {createReadStream, createWriteStream} from 'fs';
import {createBrotliCompress, createBrotliDecompress} from 'zlib';
import EventHandler from '../eventHandler/EventHandler.js';

export default class CompressController extends EventHandler {

  constructor() {
    super();

    this.commandsList = {
      'compress': this.createCompressFile,
      'decompress': this.createDecompressFile
    }
  }

  parseParams(command, ...args) {
    if (args.length < 2) {
      this.dispatchInputError();
      this.dispatchOperationEnd();
      return;
    }

    this.commandsList[command].call(this, ...args);
  }

  createCompressFile(filePath, compressPath) {
    const readFile = createReadStream(filePath);
    const compressFile = createWriteStream(compressPath);
    const compressProcess = createBrotliCompress();

    readFile.on('error',() => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    });

    compressFile.on('error',() => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    });

    compressProcess.on('error',() => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    });

    compressFile.on('close', () => {
      this.dispatchOperationEnd();
    });

    readFile.pipe(compressProcess).pipe(compressFile);
  }

  createDecompressFile(filePath, decompressPath) {
    const readFile = createReadStream(filePath);
    const decompressFile = createWriteStream(decompressPath);
    const compressProcess = createBrotliDecompress();

    readFile.on('error',() => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    });

    decompressFile.on('error',() => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    });

    compressProcess.on('error',() => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    });

    decompressFile.on('close', () => {
      this.dispatchOperationEnd();
    });

    readFile.pipe(compressProcess).pipe(decompressFile);
  }

}