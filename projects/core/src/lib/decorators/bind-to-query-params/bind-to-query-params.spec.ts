import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CoreComponent } from '../../core.component';
import { BindToQueryParams } from './bind-to-query-params';
import spyOn = jest.spyOn;
import { ParameterService } from '../../services/paramter/parameter.service';
import { Prop } from '../deferred-props';
import { MockService, Mocked } from '../../test-utils/mock-service';
import { expectObservable } from '../../test-utils/expect-observable';

describe('core-componenta with @BindToQueryParam', () => {


  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'comp',
    template: `
      <h1>my component</h1>
    `
  })
  class TestComponent extends CoreComponent {

    @BindToQueryParams()
    formGroup = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
    });

    @BindToQueryParams()
    formControl = new FormControl();

    @BindToQueryParams()
    heroName = 'batman';

    @BindToQueryParams('namespace')
    heroName2 = 'batman';

    @BindToQueryParams()
    nameSubject$ = new BehaviorSubject('subzero');

    @BindToQueryParams('hero:')
    name$ = new BehaviorSubject('subzero');

    @BindToQueryParams('hero')
    heroFG = new FormGroup({
      name: new FormControl('batman'),
      email: new FormControl('b@tm.an'),
    });

    @BindToQueryParams('villain_')
    name = new FormControl('subzero');

    @BindToQueryParams(Prop('testPath'))
    namespacedWithDeferredProp = new FormControl('valueWithDeferredNamespace');

    @BindToQueryParams()
    unsupportedType: [] = [];

    testPath = 'myPath';

    constructor(public parameterService: ParameterService) {
      super(parameterService);
    }
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let service: Mocked<ParameterService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      providers: [
        {
          provide: ParameterService,
          useClass: MockService(ParameterService)(),
        }
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(ParameterService) as Mocked<ParameterService>;
    spyOn(console, 'error').mockImplementation();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('used on any other type of property', () => {
    it('should console.log an error', () => {
      fixture.detectChanges();
      expect(console.error).toHaveBeenCalledWith('@BindToQueryParams decorator has not been implemented yet to be used on this type of property! Offending property: "unsupportedType"');
    });

  });

  describe('used on a FormGroup', () => {

    it('should set initial values read from the service (no values)', () => {
      spyOn(component.formGroup, 'patchValue');
      // calls ngOnInit
      fixture.detectChanges();
      expect(component.formGroup.value).toEqual({name: null, email: null});

    });

    it('should set initial values read from the service (some values)', () => {
      service.getQueryParams.mockReturnValue({
        name: 'batman',
        email: 'b@tm.an',
      });

      // calls ngOnInit
      fixture.detectChanges();
      expect(component.formGroup.value).toEqual({name: 'batman', email: 'b@tm.an'});

    });

    it('should update parameters when formGroup changes', () => {
      // calls ngOnInit
      fixture.detectChanges();
      component.formGroup.patchValue({name: 'hercules', email: 'hercu@les'});
      expect(service.setQueryParams).toHaveBeenCalledWith({name: 'hercules', email: 'hercu@les'});
    });

    describe('with a namespace', () => {

      it('should preserve initial values in form group when there are no value in the query params', () => {
        spyOn(component.heroFG, 'patchValue');
        // calls ngOnInit
        fixture.detectChanges();
        expect(component.heroFG.value).toEqual({name: 'batman', email: 'b@tm.an'});
      });

      it('should set initial values read from the service', () => {
        service.getQueryParams.mockReturnValue({
          heroname: 'batman',
          heroemail: 'b@tm.an',
        });

        // calls ngOnInit
        fixture.detectChanges();
        expect(component.heroFG.value).toEqual({name: 'batman', email: 'b@tm.an'});

      });

      it('should update parameters when heroFG changes', () => {
        // calls ngOnInit
        fixture.detectChanges();
        component.heroFG.patchValue({name: 'hercules', email: 'hercu@les'});
        expect(service.setQueryParams).toHaveBeenCalledWith({heroname: 'hercules', heroemail: 'hercu@les'});
      });
    });

  });

  describe('used on a FormControl', () => {

    it('should set initial values read from the service (no values)', () => {
      spyOn(component.formControl, 'patchValue');
      // calls ngOnInit
      fixture.detectChanges();
      expect(component.formControl.value).toEqual(null);

    });

    it('should set initial values read from the service (some values)', () => {
      service.getQueryParams.mockReturnValue({
        formControl: 'batman',
      });

      // calls ngOnInit
      fixture.detectChanges();
      expect(component.formControl.value).toEqual('batman');

    });

    it('should update parameters when formControl changes', () => {
      // calls ngOnInit
      fixture.detectChanges();
      component.formControl.patchValue('hercules');
      expect(service.setQueryParams).toHaveBeenCalledWith({formControl: 'hercules'});
    });

    describe('with namespace', () => {

      it('should preserve initial values in form group when there are no value in the query params', () => {
        spyOn(component.name, 'patchValue');
        // calls ngOnInit
        fixture.detectChanges();
        expect(component.name.value).toEqual('subzero');

      });

      it('should set initial values read from the service', () => {
        service.getQueryParams.mockReturnValue({
          villain_name: 'scorpion',
        });

        // calls ngOnInit
        fixture.detectChanges();
        expect(component.name.value).toEqual('scorpion');

      });

      it('should update parameters when formControl changes', () => {
        // calls ngOnInit
        fixture.detectChanges();
        component.name.patchValue('scorpion');
        expect(service.setQueryParams).toHaveBeenCalledWith({villain_name: 'scorpion'});
      });

      describe('with deferred prop', () => {

        it('should preserve initial values in form control when there are no value in the query params', () => {
          spyOn(component.namespacedWithDeferredProp, 'patchValue');
          // calls ngOnInit
          fixture.detectChanges();
          expect(component.namespacedWithDeferredProp.value).toEqual('valueWithDeferredNamespace');

        });

        it('should set initial values read from the service', () => {
          service.getQueryParams.mockReturnValue({
            myPathnamespacedWithDeferredProp: 'valueA',
          });

          // calls ngOnInit
          fixture.detectChanges();
          expect(component.namespacedWithDeferredProp.value).toEqual('valueA');

        });

        it('should update parameters when formControl changes', () => {
          // calls ngOnInit
          fixture.detectChanges();
          component.namespacedWithDeferredProp.patchValue('valueB');
          expect(service.setQueryParams).toHaveBeenCalledWith({myPathnamespacedWithDeferredProp: 'valueB'});
        });

      });
    });

  });

  describe('used on a primitive type', () => {

    it('should not override initial values if there are no values in query params)', () => {
      // calls ngOnInit
      fixture.detectChanges();
      expect(component.heroName).toEqual('batman');

    });

    it('should set initial values read from the service (some values)', () => {
      service.getQueryParams.mockReturnValue({
        heroName: 'bat@man',
      });

      // calls ngOnInit
      fixture.detectChanges();
      expect(component.heroName).toEqual('bat@man');
    });

    it('should update parameters when value changes', () => {
      // calls ngOnInit
      fixture.detectChanges();
      component.heroName = 'hercules';
      expect(service.setQueryParams).toHaveBeenCalledWith({heroName: 'hercules'});
    });

    describe('with namespace', () => {

      it('should set initial values read from the service', () => {
        service.getQueryParams.mockReturnValue({
          namespaceheroName2: 'scorpion',
        });

        // calls ngOnInit
        fixture.detectChanges();
        expect(component.heroName2).toEqual('scorpion');

      });

      it('should update parameters when value changes', () => {
        // calls ngOnInit
        fixture.detectChanges();
        component.heroName2 = 'scorpion';
        expect(service.setQueryParams).toHaveBeenCalledWith({namespaceheroName2: 'scorpion'});
      });
    });

  });

  describe('used on a Subject type', () => {

    it('should not override initial values if there are no values in query params)', () => {
      // calls ngOnInit
      fixture.detectChanges();
      expectObservable(component.nameSubject$).toEqual('subzero');

    });

    it('should set initial values read from the service (some values)', () => {
      service.getQueryParams.mockReturnValue({
        nameSubject$: 'bat@man',
      });
      // calls ngOnInit
      fixture.detectChanges();


      expect(component.nameSubject$.value).toEqual('bat@man');
    });

    it('should update parameters when value changes', () => {
      // calls ngOnInit
      fixture.detectChanges();
      component.nameSubject$.next('hercules');
      expect(service.setQueryParams).toHaveBeenCalledWith({nameSubject$: 'hercules'});
    });

    describe('with namespace', () => {

      it('should set initial values read from the service', () => {


        service.getQueryParams.mockReturnValue({
          'hero:name$': 'scorpion',
        });

        // calls ngOnInit
        fixture.detectChanges();
        expect(component.name$.value).toEqual('scorpion');


      });

      it('should update parameters when value changes', () => {
        // calls ngOnInit
        fixture.detectChanges();
        component.name$.next('godzilla');
        expect(service.setQueryParams).toHaveBeenCalledWith({'hero:name$': 'godzilla'});
      });
    });

  });

});
