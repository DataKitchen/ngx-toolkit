import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { ParameterService } from './parameter.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('Parameter Service', () => {

  let parameterService: ParameterService;
  let router: Router;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        ParameterService,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    parameterService = TestBed.inject(ParameterService);
  });

  it('should create', () => {
    expect(parameterService).toBeTruthy();
  });

  it('should store query parameters from new route on navigation', async () => {
    const newParams = {
      test: 'onlyThisShouldReturn',
    };

    await router.navigate([ '' ], {queryParams: newParams});

    expect(parameterService.getQueryParams()).toEqual(newParams);
  });

  describe('#setQueryParams', () => {

    it('should set all params from subsequent calls', () => {
      parameterService.setQueryParams({test: '1'});
      parameterService.setQueryParams({test2: '2'});


      expect(parameterService.getQueryParams()).toEqual({test: '1', test2: '2'});
    });
  });

});
