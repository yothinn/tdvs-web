import { TestBed } from '@angular/core/testing';

import { PostcodeService } from './postcode.service';

describe('PostcodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostcodeService = TestBed.get(PostcodeService);
    expect(service).toBeTruthy();
  });
});
