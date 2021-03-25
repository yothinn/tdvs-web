import { TestBed } from '@angular/core/testing';

import { EventStreamService } from './event-stream.service';

describe('EventStreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventStreamService = TestBed.get(EventStreamService);
    expect(service).toBeTruthy();
  });
});
