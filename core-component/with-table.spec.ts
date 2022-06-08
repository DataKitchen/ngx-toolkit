import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CoreComponent } from './core.component';
import { defaultPagination, WithTable } from './with-table';
import { Entity } from '../../entity';

describe('core-component', () => {


  @Component({
    selector: 'comp',
    template: `
      <h1>my component</h1>

      <mat-paginator></mat-paginator>
    `
  })
  class TestClassComponent extends CoreComponent implements WithTable {

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    onPageChange = jest.fn();
  }

  describe('with MatPaginator only', () => {

    let component: TestClassComponent;
    let fixture: ComponentFixture<TestClassComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ MatPaginatorModule ],
        declarations: [ TestClassComponent ],
        providers: [],
      });

      fixture = TestBed.createComponent(TestClassComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call lifecycle hook onPageChange with default pagination', fakeAsync(() => {
      // calls ngOnInit
      fixture.detectChanges();
      tick(10);
      expect(component.onPageChange).toHaveBeenCalledWith(defaultPagination);
    }));

    describe('page change', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should call lifecycle hook onPageChange when pagination changes', () => {
        component.paginator.page.emit({
          pageIndex: 1,
          pageSize: 20,
          length: 100,
        });

        expect(component.onPageChange).toHaveBeenCalledWith({
          page: 1,
          count: 20,
          // TODO discuss: we probably don't want to send these when MatSort in not available?
          sort_by: 'name',
          order: 'asc',
        });

      });

    });
  });

  describe('with MatPaginator and optional MatSort ', () => {


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
    class TestClass2Component extends TestClassComponent implements WithTable {

      @ViewChild(MatPaginator)
      override paginator!: MatPaginator;

      @ViewChild(MatSort)
      sortBy!: MatSort;

      override onPageChange = jest.fn();

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
        component.sortBy.sortChange.emit({
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


