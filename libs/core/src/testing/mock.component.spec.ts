import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MockComponent } from './mock-component';

describe('mock.component', () => {

  @Component({
    selector: 'test-component',
    template: `
      <div> test component</div>
      <component-to-mock (output)="myField = !myField"></component-to-mock>
      <component-to-mock (output)="myFn($event)"></component-to-mock>
    `
  })
  class TestComponent {
    myField = true;

    myFn($event: boolean) {
      console.log($event);
    }
  }


  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        MockComponent({
          selector: 'component-to-mock',
          outputs: [ 'output' ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

});
