import { TestBed } from '@angular/core/testing';

import { EvernoteService } from './evernote.service';

describe('EvernoteService', () => {
  let service: EvernoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvernoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
