import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { CoreComponent } from '../core.component';
import { HasSearchForm } from './has-search-form';
import { TypedFormControl, TypedFormGroup } from '../../../typed-form/typed-forms';
import { Subject, tap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

describe('core-component has search form', () => {

  interface SearchFields {
    name: string;
    created_on: string;
  }

  @Component({
    selector: 'comp',
    template: `
      <h1>my component</h1>

      <mat-paginator></mat-paginator>
    `
  })
  class TestClassComponent extends CoreComponent implements HasSearchForm<SearchFields> {

    spy = jest.fn();

    search = new TypedFormGroup<SearchFields>({
      name: new TypedFormControl('initial name'),
      created_on: new TypedFormControl('2022-01-01'),
    });

    search$ = new Subject<SearchFields>();

    override ngOnInit() {
      this.search$.pipe(
        tap((values) => this.spy(values)),
        takeUntil(this.destroyed$),
      ).subscribe();

      super.ngOnInit();
    }
  }

  let component: TestClassComponent;
  let fixture: ComponentFixture<TestClassComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ MatPaginatorModule ],
      declarations: [ TestClassComponent ],
      providers: [],
    });

    fixture = TestBed.createComponent(TestClassComponent);
    component = fixture.componentInstance;
    // calls ngOnInit
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide initial values', () => {
    expect(component.spy).toHaveBeenCalledWith({
      name: 'initial name',
      created_on: '2022-01-01',
    });
  });

  it('should mirror form\'s value changes ', fakeAsync(() => {
    component.search.patchValue({name: 'spiderman', created_on: '2022-02-02'});
    tick(200);
    expect(component.spy).toHaveBeenCalledWith({name: 'spiderman', created_on: '2022-02-02'});
  }));

});
