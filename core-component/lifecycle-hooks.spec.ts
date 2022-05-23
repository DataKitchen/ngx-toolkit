import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreComponent } from '@heimdall-ui/core';
import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';

describe('CoreComponent lifecycle hooks', () => {

  @Component({
    selector: 'test-component',
    template: 'test'
  })
  class TestComponent extends CoreComponent implements OnInit, AfterContentInit, AfterViewInit {
    spyNgOnInit = jest.fn();
    spyNgAfterContentInit = jest.fn();
    spyNgAfterViewInit = jest.fn();

    constructor() {
      super();

      this.callMeOnOnInit();
      this.callMeOnAfterContentInit();
      this.callMeOnAfterViewInit();
    }

    override ngOnInit() {
      this.spyNgOnInit('ngOnInit');
      super.ngOnInit();
    }

    override ngAfterContentInit() {
      this.spyNgAfterContentInit('ngAfterContentInit');
      super.ngAfterContentInit();
    }

    override ngAfterViewInit() {
      this.spyNgAfterViewInit('ngAfterViewInit');
      super.ngAfterViewInit();
    }

    callMeOnAfterViewInit() {
      this.defer(() => {
        this.spyNgAfterViewInit('after ngAfterViewInit');
      }).after('AfterViewInit');
    }

    callMeOnOnInit() {
      this.defer(() => {
        this.spyNgOnInit('after ngOnInit');
      }).after('OnInit');
    }

    callMeOnAfterContentInit() {
      this.defer(() => {
        this.spyNgAfterContentInit('after ngAfterContentInit');
      }).after('AfterContentInit');
    }
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {

    it('should defer a function so that it is called after a lifecycle', () => {
      expect(component.spyNgOnInit).not.toHaveBeenCalled();

      // force lifecycles
      fixture.detectChanges();
      expect(component.spyNgOnInit).toHaveBeenCalled();

      expect(component.spyNgOnInit.mock.calls).toEqual([[ 'ngOnInit' ], [ 'after ngOnInit' ]]);
    });

    it('should call directly the deferred function if the lifecycle already happened', () => {
      // force lifecycles
      fixture.detectChanges();
      expect(component.spyNgOnInit).toHaveBeenCalled();

      component.callMeOnOnInit();
      expect(component.spyNgOnInit).toHaveBeenCalledTimes(3);

      expect(component.spyNgOnInit.mock.calls).toEqual([[ 'ngOnInit' ], [ 'after ngOnInit' ], [ 'after ngOnInit' ]]);
    });

  });

  describe('AfterViewInit', () => {

    it('should defer a function so that it is called after a lifecycle', () => {
      expect(component.spyNgAfterViewInit).not.toHaveBeenCalled();

      // force lifecycles
      fixture.detectChanges();
      expect(component.spyNgAfterViewInit).toHaveBeenCalled();

      expect(component.spyNgAfterViewInit.mock.calls).toEqual([[ 'ngAfterViewInit' ], [ 'after ngAfterViewInit' ]]);
    });

    it('should call directly the deferred function if the lifecycle already happened', () => {
      // force lifecycles
      fixture.detectChanges();
      expect(component.spyNgAfterViewInit).toHaveBeenCalled();

      component.callMeOnAfterViewInit();
      expect(component.spyNgAfterViewInit).toHaveBeenCalledTimes(3);

      expect(component.spyNgAfterViewInit.mock.calls).toEqual([[ 'ngAfterViewInit' ], [ 'after ngAfterViewInit' ], [ 'after ngAfterViewInit' ]]);
    });

  });

  describe('AfterContentInit', () => {

    it('should defer a function so that it is called after a lifecycle', () => {
      expect(component.spyNgAfterContentInit).not.toHaveBeenCalled();

      // force lifecycles
      fixture.detectChanges();
      expect(component.spyNgAfterContentInit).toHaveBeenCalled();

      expect(component.spyNgAfterContentInit.mock.calls).toEqual([[ 'ngAfterContentInit' ], [ 'after ngAfterContentInit' ]]);
    });

    it('should call directly the deferred function if the lifecycle already happened', () => {
      // force lifecycles
      fixture.detectChanges();
      expect(component.spyNgAfterContentInit).toHaveBeenCalled();

      component.callMeOnAfterContentInit();
      expect(component.spyNgAfterContentInit).toHaveBeenCalledTimes(3);

      expect(component.spyNgAfterContentInit.mock.calls).toEqual([[ 'ngAfterContentInit' ], [ 'after ngAfterContentInit' ], [ 'after ngAfterContentInit' ]]);
    });

  });

});
