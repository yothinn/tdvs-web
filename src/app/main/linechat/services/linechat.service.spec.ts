import { TestBed } from '@angular/core/testing';

import { LinechatService } from './linechat.service';

describe('LinechatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinechatService = TestBed.get(LinechatService);
    expect(service).toBeTruthy();
  });
});
