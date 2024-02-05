import EventHandler from '../eventHandler/EventHandler.js';
import {createReadStream} from 'fs';
import stream from 'stream';
import {createHash} from 'crypto';

export default class HashController extends EventHandler {

  parseParams(_, ...args) {
    if (args.length < 1) {
      this.dispatchInputError();
      this.dispatchOperationEnd();
      return;
    }

    this.getHash(args[0]);
  }

  getHash(path) {
    const readFile = createReadStream(path);
    const transformFile = new stream.Transform({
      transform(chunk, encoding, callback) {
        const res = createHash('sha256').update(chunk.toString()).digest('hex');
        callback(null, res);
      }
    });

    readFile.on('error', () => {
      this.dispatchOperationError();
      this.dispatchOperationEnd();
    })

    readFile.pipe(transformFile).pipe(process.stdout);
    readFile.on('end', () => {
      process.stdout.write('\n');
      this.dispatchOperationEnd();
    });
  }
}