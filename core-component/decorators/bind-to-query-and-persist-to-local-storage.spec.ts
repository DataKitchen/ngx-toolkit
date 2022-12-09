import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CoreComponent } from '../core.component';
import { PersistOnLocalStorage } from './persist-on-local-storage/persist-on-local-storage';
import { BindToQueryParams } from './bind-to-query-params/bind-to-query-params';
import { ParameterService } from '../../../services/paramter/parameter.service';
import { Mocked, MockService } from '../../../../testing/mock-service';
import { StorageService } from '../../../services/storage/storage.service';
import { TestScheduler } from '@heimdall-ui/testing/test-scheduler';

describe('core-componenta with both @BindToQueryParams and @PersistOnLocalStorage decorators', () => {

  @Component({
    selector: 'comp',
    template: `
      <h1>my component</h1>
    `,
  })
  class TestComponent extends CoreComponent {

    @PersistOnLocalStorage()
    @BindToQueryParams()
    formGroup = new FormGroup({
      name: new FormControl('a-name'),
      email: new FormControl('em@il'),
    });

    @BindToQueryParams()
    @PersistOnLocalStorage()
    heroName = new FormControl();

    @BindToQueryParams()
    @PersistOnLocalStorage()
    primitive = 'popeye';

    @BindToQueryParams()
    @PersistOnLocalStorage()
    subject$ = new BehaviorSubject('popeye');

    // tslint:disable-next-line:no-shadowed-variable
    constructor(protected parametersService: ParameterService, protected storage: StorageService) {
      super(parametersService, storage);
    }
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let storageService: Mocked<StorageService>;
  let paramsService: Mocked<ParameterService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      providers: [
        {
          provide: StorageService,
          useClass: MockService(StorageService)(),
        },
        {
          provide: ParameterService,
          useClass: MockService(ParameterService)(),
        }
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    storageService = TestBed.inject(StorageService) as Mocked<StorageService>;
    paramsService = TestBed.inject(ParameterService) as Mocked<ParameterService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('there are query params but nothing on local storage', () => {

    describe('with a FormGroup', () => {
      beforeEach(() => {
        paramsService.getQueryParams.mockReturnValue({name: 'name', email: 'email'});
      });

      it('should set initial values', () => {
        fixture.detectChanges();
        expect(component.formGroup.value).toEqual({name: 'name', email: 'email'});
      });

    });

    describe('with a FormControl', () => {

      beforeEach(() => {
        paramsService.getQueryParams.mockReturnValue({heroName: 'superman'});
      });

      it('should set initial values', () => {
        fixture.detectChanges();
        expect(component.heroName.value).toEqual('superman');
      });

    });

    describe('with a primitive type', () => {

      beforeEach(() => {
        paramsService.getQueryParams.mockReturnValue({primitive: 'superman'});
      });

      it('should set initial values', () => {
        fixture.detectChanges();
        expect(component.primitive).toEqual('superman');
      });

    });

    describe('with a Subject type', () => {

      beforeEach(() => {
        paramsService.getQueryParams.mockReturnValue({subject$: 'superman'});
      });

      it('should set initial values', () => {
        new TestScheduler().run(({expectObservable}) => {
          fixture.detectChanges();
          expectObservable(component.subject$).toBe('a', {a: 'superman'});
        });
      });

    });

  });

  describe('there are values stored in local storage but not on query params', () => {

    describe('with a FormGroup', () => {

      beforeEach(() => {
        storageService.getStorage.mockReturnValue({name: 'name', email: 'email'});
        paramsService.getQueryParams.mockReturnValue({});
      });

      it('should set initial values', () => {
        fixture.detectChanges();
        expect(component.formGroup.value).toEqual({name: 'name', email: 'email'});
      });

      it('should reflect initial values on the query params', () => {
        fixture.detectChanges();
        expect(paramsService.setQueryParams).toHaveBeenCalledWith({name: 'name', email: 'email'});
      });
    });

    describe('with a FormControl', () => {
      beforeEach(() => {
        storageService.getStorage.mockReturnValue('superman');
        paramsService.getQueryParams.mockReturnValue({});

      });

      it('should set initial values', () => {
        fixture.detectChanges();
        expect(component.heroName.value).toEqual('superman');
      });

      it('should reflect initial values on the query params', () => {
        fixture.detectChanges();
        expect(paramsService.setQueryParams).toHaveBeenCalledWith({heroName: 'superman'});
      });
    });

    describe('with a primitive type', () => {
      beforeEach(() => {
        storageService.getStorage.mockReturnValue('superman');
        paramsService.getQueryParams.mockReturnValue({});

      });

      it('should set initial values', () => {
        fixture.detectChanges();
        expect(component.primitive).toEqual('superman');
      });

      it('should reflect initial values on the query params', () => {
        fixture.detectChanges();
        expect(paramsService.setQueryParams).toHaveBeenCalledWith(expect.objectContaining({primitive: 'superman'}));
      });
    });

    describe('with a Subject type', () => {
      beforeEach(() => {
        storageService.getStorage.mockReturnValue('superman');
        paramsService.getQueryParams.mockReturnValue({
          subject$: 'spiderman'
        });

      });

      it('should set initial values', () => {
        fixture.detectChanges();
        expect(component.subject$.value).toEqual('spiderman');
      });

      it('should reflect initial values on the query params', () => {
        fixture.detectChanges();
        expect(paramsService.setQueryParams).toHaveBeenCalledWith(expect.objectContaining({subject$: 'spiderman'}));
      });
    });

  });

  describe('there are values on both localstorage and query params', () => {
    describe('with a FormGroup', () => {

      beforeEach(() => {
        paramsService.getQueryParams.mockReturnValue({name: 'batman', email: 'b@tm.an'});
        storageService.getStorage.mockReturnValueOnce({name: 'name', email: 'email'}).mockReturnValueOnce('superman');
      });

      it('should win params coming from query and set localstorage accordingly', () => {
        fixture.detectChanges();
        expect(component.formGroup.value).toEqual({name: 'batman', email: 'b@tm.an'});
        expect(storageService.setStorage).toHaveBeenCalledWith('formGroup', {name: 'batman', email: 'b@tm.an'});
        expect(storageService.setStorage).toHaveBeenCalledWith('heroName', 'superman');
      });
    });

    describe('with a primitive type', () => {

      beforeEach(() => {
        paramsService.getQueryParams.mockReturnValue({name: 'batman', email: 'b@tm.an', primitive: 'spiderman'});
        storageService.getStorage.mockReturnValueOnce({
          name: 'name',
          email: 'email',
          primitive: 'batman'
        }).mockReturnValueOnce('superman');
      });

      it('should win params coming from query and set localstorage accordingly', () => {
        fixture.detectChanges();
        expect(component.primitive).toEqual('spiderman');
        expect(storageService.setStorage).toHaveBeenCalledWith('primitive', 'spiderman');

      });
    });

  });

});
