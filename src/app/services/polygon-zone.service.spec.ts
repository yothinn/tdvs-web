import { TestBed } from '@angular/core/testing';

import { PolygonZoneService } from './polygon-zone.service';

describe('PolygonZoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolygonZoneService = TestBed.get(PolygonZoneService);
    expect(service).toBeTruthy();
  });
});
