import EventEmitter from 'events';
import os from 'os';

export default class EventHandler {
  static HOME_DIR = os.homedir();

  constructor() {
    this.event = new EventEmitter();

    this.eventsName = {
      INPUT_ERROR: 'inputError',
      OPERATION_ERROR: 'operationFailed',
      OPERATION_END: 'operationEnd'
    }

    this.setEvents();
  }

  setInputErrorEvent() {
    this.event.on(this.eventsName.INPUT_ERROR, () => {
      console.error('Invalid input');
    });
  }

  setOperationErrorEvent() {
    this.event.on(this.eventsName.OPERATION_ERROR, () => {
      console.error('Operation failed');
    });
  }

  setOperationEndEvent() {
    this.event.on(this.eventsName.OPERATION_END, () => {
      console.info(`\nYou are currently in ${EventHandler.HOME_DIR}\n`);
    });
  }

  setEvents() {
    this.setInputErrorEvent()
    this.setOperationErrorEvent();
    this.setOperationEndEvent();
  }

  dispatchInputError() {
    this.event.emit(this.eventsName.INPUT_ERROR);
  }

  dispatchOperationError() {
    this.event.emit(this.eventsName.OPERATION_ERROR);
  }

  dispatchOperationEnd() {
    this.event.emit(this.eventsName.OPERATION_END);
  }
}