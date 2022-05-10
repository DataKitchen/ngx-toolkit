import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { CoreComponent } from './core-component';
import { GetSearchableFields, WithSearchForm } from './with-search-form';
import { TypedFormGroup } from '../../typed-form/typed-forms';
import { Entity } from '../../entity/entity.model';

describe('dk-component with search form', () => {

  @Component({
    selector: 'comp',
    template: `
      <h1>my component</h1>

      <mat-paginator></mat-paginator>
    `
  })
  class TestClassComponent extends CoreComponent implements WithSearchForm<GetSearchableFields<Entity>> {

    spy = jest.fn();

    search: TypedFormGroup<GetSearchableFields<Entity>> = new TypedFormGroup<GetSearchableFields<Entity>>({
      name: new FormControl('initial name'),
      active: new FormControl(true),
    });

    onSearchChange(search: GetSearchableFields<Entity>): void {
      this.spy(search);
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

  it('should call lifecycle hook onSearchChange with initial value', fakeAsync(() => {
    tick(10);
    expect(component.spy).toHaveBeenCalledWith({name: 'initial name', active: true});
  }));

  // it('should call lifecycle hook onSearchChange when form value changes', fakeAsync(() => {
  //   component.search.patchValue({name: make('a name'), active: make(false)});
  //   tick(entitySearchDebounce + 10);
  //   expect(component.spy).toHaveBeenCalledWith({name: 'a name', active: false});
  // }));

});
