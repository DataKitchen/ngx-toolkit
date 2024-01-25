import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';


describe('TestService', () => {

  @Injectable({
    providedIn: 'root'
  })
  class TestService {}

  let service: TestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
