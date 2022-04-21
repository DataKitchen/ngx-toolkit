import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UnsubscribeOnDestroy } from '@heimdall-ui/core';
import { noop, Subject, takeUntil } from 'rxjs';

describe('UnsubscribeOnDestroy', () => {

  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'test-comp',
    template: '<div>Hello World</div>'
  })
  class TestComponent extends UnsubscribeOnDestroy {
    subject = new Subject();


    subscription = this.subject.subscribe(noop);
    subscription2;

    constructor() {
      super();

      const subject2 = new Subject();

      this.subscriptions.push(
        this.subscription
      );

      this.subscription2 = subject2.pipe(
        takeUntil(this.componentDestroyed)
      ).subscribe(noop);
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

  describe('OnDestroy', () => {

    beforeEach(() => {
      fixture.destroy();
    });

    it('should unsubscribe all subscriptions that are in `subscriptions`', () => {
      expect(component.subscription.closed).toBeTruthy();
    });

    it('should unsubscribe all subscriptions that are piped through `componentDestroyed`', () => {
      expect(component.subscription2.closed).toBeTruthy();
    });

  });

});
