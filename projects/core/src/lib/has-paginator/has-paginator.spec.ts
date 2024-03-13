import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreComponent } from '../core.component';
import { HasPaginator } from './has-paginator';
import { rxjsScheduler } from '../rxjs-scheduler.token';
import { TestScheduler } from '@datakitchen/rxjs-marbles';

describe('core-component has paginator', () => {

  @Component({
    selector: 'comp',
    template: `
      <h1>my component</h1>
      <mat-paginator pageSize="20"></mat-paginator>
    `
  })
  class TestClassComponent extends CoreComponent implements HasPaginator {

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  }

  let component: TestClassComponent;
  let fixture: ComponentFixture<TestClassComponent>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler();

    TestBed.configureTestingModule({
      imports: [ MatPaginatorModule ],
      declarations: [ TestClassComponent ],
      providers: [
        {
          provide: rxjsScheduler,
          useValue: testScheduler,
        }
      ],
    });

    fixture = TestBed.createComponent(TestClassComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should notify `__pageChange$` with default pagination', () => {
    // default pagination would be `[pageSize]` provided to `mat-paginator`
    testScheduler.expect$(component.__pageChange$).toBe('100ms a', {
      a: {
        length: 0,
        pageIndex: 0,
        pageSize: 20,
      }
    });
  });

  it('should notify pagination changes', () => {

    testScheduler.run(({ expectObservable }) => {
      component.paginator.page.emit({
        pageIndex: 1,
        pageSize: 20,
        length: 100,
      });

      expectObservable(component.__pageChange$).toBe('100ms a', {
        a: {
          pageIndex: 1,
          pageSize: 20,
          length: 100,
        },
      });

    });

  });

});
