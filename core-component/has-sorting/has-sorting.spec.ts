import { Component, ViewChild } from '@angular/core';
import { CoreComponent } from '../core.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { rxjsScheduler } from '../rxjs-scheduler.token';
import { expectObservableWithCallback, testScheduler } from '@heimdall-ui/testing/expect-observable';
import { HasSorting } from './has-sorting';

describe('core.component has sorting', () => {
  let component: TestClass2Component;

  @Component({
    selector: 'comp',
    template: `
        <h1>my component</h1>

        <div class="table-container" matSort></div>
      `
  })
  class TestClass2Component extends CoreComponent implements HasSorting {
    @ViewChild(MatSort) __sortBy!: MatSort;
  }
  let fixture: ComponentFixture<TestClass2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatPaginatorModule, MatSortModule ],
      declarations: [ TestClass2Component ],
      providers: [
        {
          provide: rxjsScheduler,
          useValue: testScheduler,
        }
      ],
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

    it('should call lifecycle hook onPageChange when sort changes', () => {

      expectObservableWithCallback(({expectObservable}) => {
        component.__sortBy.sortChange.emit({
          active: 'created_on',
          direction: 'desc',
        });

        expectObservable(component.__sortChange$).toBe('a 99ms b', {
          b: {
            active: 'created_on',
            direction: 'desc',
          }
        });

      });

    });

  });

});
