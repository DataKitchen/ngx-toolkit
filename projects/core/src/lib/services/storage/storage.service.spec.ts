import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('storage service', () => {

  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
      ],
    });

    service = TestBed.inject(StorageService);

  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should set into local storage and retrieve', () => {
    const data = {my: 'data'};

    service.setStorage('ActiveGraph', data);
    expect(service.getStorage('ActiveGraph')).toEqual(data);

  });

});
