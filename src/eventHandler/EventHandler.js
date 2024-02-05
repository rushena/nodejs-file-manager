import EventEmitter from 'events';

export default class EventHandler {

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
      console.log('Invalid input\n');
    });
  }

  setOperationErrorEvent() {
    this.event.on(this.eventsName.OPERATION_ERROR, () => {
      console.log('Operation failed\n');
    });
  }

  setEvents() {
    this.setInputErrorEvent()
    this.setOperationErrorEvent();
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