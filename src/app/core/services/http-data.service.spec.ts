import { TestBed } from '@angular/core/testing';

import { HttpDataService } from './http-data.service';
import { HttpClientModule } from '@angular/common/http';

describe('HttpDataService', () => {
  let service: HttpDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(HttpDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
