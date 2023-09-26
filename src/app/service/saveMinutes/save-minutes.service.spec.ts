import { TestBed } from '@angular/core/testing';

import { SaveMinutesService } from '../save-minutes.service';

describe('SaveMinutesService', () => {
  let service: SaveMinutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveMinutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
