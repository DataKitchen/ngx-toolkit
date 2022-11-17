import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CoreComponent } from './core.component';
import { WithTable } from './with-table';
import { expectObservable, expectObservableWithCallback, testScheduler } from '../../../testing/expect-observable';
import { rxjsScheduler } from './rxjs-scheduler.token';


describe('core-component', () => {

  @Component({
    selector: 'comp',
    template: `
      <h1>my component</h1>

      <mat-paginator></mat-paginator>
    `
  })
  class TestClassComponent extends CoreComponent implements WithTable {

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call lifecycle hook onPageChange with default pagination', () => {
    // calls ngOnInit
    fixture.detectChanges();

    expectObservable(component.__pageChange$).toContain({
      length: 0,
      pageIndex: 0,
      pageSize: 50,
    });
  });

  describe('page change', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call lifecycle hook onPageChange when pagination changes', () => {

      expectObservableWithCallback(({expectObservable}) => {
        component.paginator.page.emit({
          pageIndex: 1,
          pageSize: 20,
          length: 100,
        });

        expectObservable(component.__pageChange$).toBe('100ms a 99ms b', {
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

  // TODO move elsewhere for testing the HasSortable interface
  xdescribe('with MatPaginator and optional MatSort ', () => {


    let component: TestClass2Component;

    @Component({
      selector: 'comp',
      template: `
        <h1>my component</h1>

        <div class="table-container"
             matSort>
        </div>

        <mat-paginator></mat-paginator>
      `
    })
    class TestClass2Component extends CoreComponent implements WithTable {

      @ViewChild(MatPaginator)
      paginator!: MatPaginator;

      @ViewChild(MatSort)
      __sortBy!: MatSort;

      onPageChange = jest.fn();

    }
    let fixture: ComponentFixture<TestClassComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ MatPaginatorModule, MatSortModule ],
        declarations: [ TestClass2Component ],
        providers: [],
      });

      fixture = TestBed.createComponent(TestClass2Component);
      component = fixture.componentInstance as TestClass2Component;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    describe('sort change', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should call lifecycle hook onPageChange when sort changes', fakeAsync(() => {
        component.__sortBy.sortChange.emit({
          active: 'created_on',
          direction: 'desc',
        });

        tick(10);
        expect(component.onPageChange).toHaveBeenCalledWith({
          page: 0,
          count: 10,
          // TODO discuss: we probably don't want to send these when MatSort in not available?
          sort_by: 'created_on',
          order: 'desc',
        });

      }));

    });
  });
});



