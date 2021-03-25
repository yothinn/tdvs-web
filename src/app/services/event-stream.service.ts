import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventStreamService {

  _eventStream;

  constructor() { }

  openEventStream() {
    return new Observable(subscriber => {
      let eventStreamUri = `${environment.apiUrl}/api/tvds/sse/subscribe`;
      this._eventStream = new EventSource(eventStreamUri);

      this._eventStream.onopen = event => {
        subscriber.next(event);
      };

      this._eventStream.onmessage = event => {
        // console.log(event);
        subscriber.next(event);
      };

      this._eventStream.onerror = event => {
        subscriber.error(event);
      }

    });
  }

  close() {
    this._eventStream.close();
  }
}
