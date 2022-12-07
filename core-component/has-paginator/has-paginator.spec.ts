import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreComponent } from '../core.component';
import { HasPaginator } from './has-paginator';
import { expectObservable, expectObservableWithCallback, testScheduler } from '../../../../testing/expect-observable';
import { rxjsScheduler } from '../rxjs-scheduler.token';

describe('core-component has paginator', () => {

  @Component({
    selector: 'comp',
    template: `
      <h1>my component</h1>

      <mat-paginator [pageSize]="10"></mat-paginator>
    `
  })
  class TestClassComponent extends CoreComponent implements HasPaginator {

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  }

  let component: TestClassComponent;
  let fixture: ComponentFixture<TestClassComponent>;

  beforeEach(() => {
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

  it('should call notify `__pageChange$` with default pagination', () => {
    // default pagination would be `[pageSize]` provided to `mat-paginator`

    expectObservable(component.__pageChange$).toBe('100ms a', {
      a: {
        length: 0,
        pageIndex: 0,
        pageSize: 10,
      },
    });
  });

  it('should call lifecycle hook onPageChange when pagination changes', () => {

    expectObservableWithCallback(({expectObservable}) => {
      component.paginator.page.emit({
        pageIndex: 1,
        pageSize: 20,
        length: 100,
      });

      expectObservable(component.__pageChange$).toBe('200ms b', {
        a: expect.anything(),
        b: {
          length: 100,
          pageIndex: 1,
          pageSize: 20,
        }
      });
    });

  });

});
