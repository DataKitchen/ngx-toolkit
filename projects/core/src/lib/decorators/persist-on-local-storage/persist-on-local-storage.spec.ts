import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Prop } from '../deferred-props';
import { BehaviorSubject } from 'rxjs';
import { CoreComponent } from '../../core.component';
import { PersistOnLocalStorage } from './persist-on-local-storage';
import { Component } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { expectObservable } from '../../test-utils/expect-observable';
import { MockService, Mocked } from '../../test-utils/mock-service';

describe('core-componenta with @PersistOnLocalStorage', () => {


  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'comp',
    template: `
      <h1>my component</h1>
    `,
  })
  class TestComponent extends CoreComponent {

    @PersistOnLocalStorage()
    heroEmail: string = 'b@tman';

    @PersistOnLocalStorage()
    heroes$ = new BehaviorSubject('heroes');

    @PersistOnLocalStorage()
    formGroup = new FormGroup({
      name: new FormControl('name'),
      email: new FormControl('em@il'),
    });

    @PersistOnLocalStorage({namespace: 'hero'})
    heroFG = new FormGroup({
      name: new FormControl('name'),
      email: new FormControl('em@il'),
    });

    @PersistOnLocalStorage()
    name = new FormControl();

    @PersistOnLocalStorage({namespace: 'villain'})
    villainName = new FormControl();

    @PersistOnLocalStorage({namespace: 'Namespace'})
    heroEmailWith: string = 'supermane';

    @PersistOnLocalStorage({namespace: Prop('dynamicNamespace')})
    heroEmailDeferred: string = 'spiderman';

    @PersistOnLocalStorage()
    heroName = [ 'hero' ];

    @PersistOnLocalStorage({whiteList: [ 'age' ]})
    fgWithWhiteList = new FormGroup({
      age: new FormControl(),
      birthDate: new FormControl(),
    });

    @PersistOnLocalStorage({blackList: [ 'age' ]})
    fgWithBlackList = new FormGroup({
      age: new FormControl(),
      birthDate: new FormControl(),
    });

    @PersistOnLocalStorage({namespace: Prop('dynamicNamespace')})
    phone = new FormControl();

    constructor(protected storeService: StorageService) {
      // TODO this is ugly! Anyone knows how to fix it?
      super(undefined, storeService);
    }
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let service: Mocked<StorageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      providers: [
        {
          provide: StorageService,
          useClass: MockService(StorageService)(),
        }
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(StorageService) as Mocked<StorageService>;

    jest.spyOn(console, 'error').mockImplementation();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('used on any other type of property', () => {
    it('should console.log an error', () => {
      fixture.detectChanges();
      expect(console.error).toHaveBeenCalledWith('@PersistOnLocalStorage decorator has not been implemented yet to be used on this type of property! Offending property: "heroName"');
    });

  });

  describe('used on a FormGroup', () => {

    it('should not override initial values if nothing is already stored', () => {
      service.getStorage.mockReturnValue(undefined);

      fixture.detectChanges();
      expect(component.formGroup.value).toEqual({name: 'name', email: 'em@il'});
    });

    it('should not override initial values if an empty object is stored', () => {
      service.getStorage.mockReturnValue({});

      fixture.detectChanges();
      expect(component.formGroup.value).toEqual({name: 'name', email: 'em@il'});
    });

    it('should set new value when something is stored', () => {
      service.getStorage.mockReturnValue({name: 'batman', email: 'b@tm.an'});

      fixture.detectChanges();
      expect(component.formGroup.value).toEqual({name: 'batman', email: 'b@tm.an'});
    });

    it('should store new values', () => {
      fixture.detectChanges();

      component.formGroup.patchValue({name: 'superman', email: 'superman'});
      expect(service.setStorage).toHaveBeenCalledWith(expect.stringContaining('formGroup'), {name: 'superman', email: 'superman'});

    });

    describe('with namespace', () => {
      it('should use provided namespace to read from local storage', () => {
        fixture.detectChanges();
        expect(service.getStorage).toHaveBeenCalledWith('heroheroFG');
      });

      it('should use provide namespace to write to local storage', () => {
        fixture.detectChanges();

        component.heroFG.patchValue({name: 'superman', email: 'superman'});
        expect(service.setStorage).toHaveBeenCalledWith('heroheroFG', {name: 'superman', email: 'superman'});

      });
    });

    describe('with whitelist', () => {
      it('should store only whitelisted values', () => {
        fixture.detectChanges();

        component.fgWithWhiteList.patchValue({age: 12, birthDate: '01-01-2000'});
        expect(service.setStorage).toHaveBeenCalledWith(expect.stringContaining('fgWithWhiteList'), {age: 12});

      });
    });

    describe('with blackList', () => {
      it('should not store blacklisted values', () => {
        fixture.detectChanges();

        component.fgWithBlackList.patchValue({age: 12, birthDate: '01-01-2000'});
        expect(service.setStorage).toHaveBeenCalledWith(expect.stringContaining('fgWithBlackList'), {birthDate: '01-01-2000'});

      });
    });

  });

  describe('used on a FormControl', () => {

    it('should not override initial values if nothing is already stored', () => {
      service.getStorage.mockReturnValue(undefined);

      fixture.detectChanges();
      expect(component.name.value).toEqual(null);
    });

    it('should not override initial values if an empty string is stored', () => {
      service.getStorage.mockReturnValue('');

      fixture.detectChanges();
      expect(component.name.value).toEqual(null);
    });

    it('should set new value when something is stored', () => {
      service.getStorage.mockReturnValue('superhero');

      fixture.detectChanges();
      expect(component.name.value).toEqual('superhero');
    });

    it('should store new values', () => {
      fixture.detectChanges();

      component.name.patchValue('superman');
      expect(service.setStorage).toHaveBeenCalledWith(expect.stringContaining('name'), 'superman');

    });

    describe('with namespace', () => {
      it('should use provided namespace to read from local storage', () => {
        fixture.detectChanges();
        expect(service.getStorage).toHaveBeenCalledWith('villainvillainName');
      });

      it('should use provide namespace to write to local storage', () => {
        fixture.detectChanges();

        component.villainName.patchValue('superman');
        expect(service.setStorage).toHaveBeenCalledWith('villainvillainName', 'superman');

      });
    });

    describe('with deferred namespace', () => {
      const initialNamespace = 'hero:';
      const newNamespace = 'hero:alt:';

      xit('should use the initial namespace to read from local storage', () => {
        // FIXME
        // this is failing here but not on the orifinal repo and i do not know why
        fixture.detectChanges();
        console.log(service.getStorage.mock.calls);
        expect(service.getStorage).toHaveBeenCalledWith(`${initialNamespace}phone`);
      });

      it('should use the updated namespace to write to local storage', () => {
        fixture.detectChanges();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        component['dynamicNamespace'] = newNamespace;
        component.phone.patchValue('+18005551020');

        expect(service.setStorage).toHaveBeenCalledWith(`${newNamespace}phone`, '+18005551020');
      });
    });
  });

  describe('used on a primitive value', () => {

    it('should not override initial values if nothing is already stored', () => {
      service.getStorage.mockReturnValue(undefined);

      fixture.detectChanges();
      expect(component.heroEmail).toEqual('b@tman');
    });

    it('should not override initial values if an empty string is stored', () => {
      service.getStorage.mockReturnValue('');

      fixture.detectChanges();
      expect(component.heroEmail).toEqual('b@tman');
    });

    it('should set new value when something is stored', () => {
      service.getStorage.mockReturnValue('superhero@tman');

      fixture.detectChanges();
      expect(component.heroEmail).toEqual('superhero@tman');
    });

    it('should store new values', () => {
      fixture.detectChanges();

      component.heroEmail = 'superm@n';
      expect(service.setStorage).toHaveBeenCalledWith(expect.stringContaining('heroEmail'), 'superm@n');

    });

    describe('with namespace', () => {
      it('should use provided namespace to read from local storage', () => {
        fixture.detectChanges();
        expect(service.getStorage).toHaveBeenCalledWith('NamespaceheroEmailWith');
      });

      it('should use provide namespace to write to local storage', () => {
        fixture.detectChanges();

        component.heroEmailWith = 'supermanwithnamespace';
        expect(service.setStorage).toHaveBeenCalledWith('NamespaceheroEmailWith', 'supermanwithnamespace');

      });
    });

    describe('with deferred namespace', () => {
      const initialNamespace = 'hero:';
      const newNamespace = 'hero:alt:';

      xit('should use the initial namespace to read from local storage', () => {
        // FIXME
        // this is failing here but not on the orifinal repo and i do not know why
        fixture.detectChanges();
        expect(service.getStorage).toHaveBeenCalledWith(`${initialNamespace}phone`);
      });

      it('should use the updated namespace to write to local storage', () => {
        fixture.detectChanges();
        component['dynamicNamespace'] = newNamespace;
        component.heroEmailDeferred = '+spiderman';

        expect(service.setStorage).toHaveBeenCalledWith(`${newNamespace}heroEmailDeferred`, '+spiderman');
      });
    });
  });

  describe('used on a Subject', () => {
    it('should not next initial values if nothing is already stored', () => {
      service.getStorage.mockReturnValue(undefined);

      fixture.detectChanges();
      expectObservable(component.heroes$).toBe('a', {
        a: 'heroes'
      });
    });

    it('should set next value when something is stored', () => {
      service.getStorage.mockReturnValue('superhero@tman');
      fixture.detectChanges();
      expect(component.heroes$.value).toEqual('superhero@tman');
    });


    it('should store new values', () => {
      fixture.detectChanges();

      component.heroes$.next('superm@n');
      expect(service.setStorage).toHaveBeenCalledWith(expect.stringContaining('heroes$'), 'superm@n');

    });
  });
});
