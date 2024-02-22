import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreComponent } from './core.component';
import { Subject } from 'rxjs';
import spyOn = jest.spyOn;

describe('core-component', () => {

  @Component({
    selector: 'comp',
    template: '<h1>my component</h1>'
  })
  class TestClassComponent extends CoreComponent {

    private subject$ = new Subject();

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    override ngOnInit() {
      this.subscriptions.push(this.subject$.subscribe());

      super.ngOnInit();
    }
  }

  let component: TestClassComponent;
  let fixture: ComponentFixture<TestClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestClassComponent ],
    });

    fixture = TestBed.createComponent(TestClassComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should unsubscribe when component is destroyed', () => {
    expect(component['subscriptions'].length).toEqual(0);

    component.ngOnInit();
    expect(component['subscriptions'].length).not.toEqual(0);

    const unsubscribeSpy = spyOn(component['subscriptions'][0], 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

});
