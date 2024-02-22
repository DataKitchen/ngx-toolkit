# Datakitchen's ngx-toolkit :rocket:
[![@datakitchen/ngx-toolkit](https://badge.fury.io/js/@datakitchen%2Fngx-toolkit.svg)](https://badge.fury.io/js/@datakitchen%2Fngx-toolkit)


This library contains a collection of utilities for Angular applications. There are three categories of utilities:
 - General utilities such as a `@Memoize` decorator and a wrapper around the browser `localStorage`.
 - An abstract component and a set of decorators and interfaces to ease the implementation of common tasks such as search, pagination, and sorting.
 - Testing utilities to ease mocking and implementing common tasks when writing unit tests.

## Install
With your package manager of preference, install
```
@datakitchen/ngx-toolkit
```

### General Utilities

> say something nice

#### @Memoize
Caches a method's result when it has already been calculated for a given input.

```typescript
class TestClass {

  @Memoize
  testMemo(value: number): number {
    return value * 2;
  }
}
```
#### TypedForms
An easier to use version of Angular's `TypedForms`

> TBD add example and comparison with Angular's TypedForms

#### StorageService
Service that wraps `localStorage`.

> TBD add example and explain optional `localStorage`


#### ParameterService

> TBD add example and use case especially for when the ParameterService is handy for fixing issue with angular's Router

### CoreComponent
> TBD add small description or maybe a TOC for all the CoreComponent things

#### Automatic unsubscription
CoreComponent implements a `subscriptions: Subscription[]` array for automatic unsubscriptions of observables.

```typescript
import { CoreComponent } from '@datakitchen/ngx-toolkit';

@Component({
  selector: 'comp',
  template: '<h1>my component</h1>'
})
class TestClassComponent extends CoreComponent {

  private subject$ = new Subject();

  override ngOnInit() {
    // Extend CoreComponent to leverage automatic unsubscriptions
    this.subscriptions.push(this.subject$.subscribe());
  }
}
```
`subject$` will be automatically unsubscribed on `OnDestroy`.

#### Defer a function after a lifecycle hooks
Sometimes you may want to defer a method/function call after one of Angular's lifecycle hooks.

```typescript
import { CoreComponent } from '@datakitchen/ngx-toolkit';

@Component({
  selector: 'comp',
  template: `
<h1>My Component</h1>
`
})
class TestClassComponent extends CoreComponent {

  callAfterNgAfterContentInit() {
    this.defer(() => {
      // do stuff

      /**
       * The callback function is executed after the given lifecycle and,
       * after that, every subsequent call to `callAfterNgAfterContentInit`
       * will execute the callback directly, i.e.: as if the defer block wans't there.
       */
    }).after('AfterContentInit');
  }
}
```
At the moment, the lifecycle hooks available are `OnInit`, `AfterContentInit` and `AfterViewInit`.

#### @PersistOnLocalStorage
Annotate a property with `@PersistOnLocalStorage()` to have it hydrated from localStorage and to keep its value synced on the local storage.

```typescript
import { CoreComponent } from '@datakitchen/ngx-toolkit';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'comp',
  template: `
<h1>my component</h1>
`,
})
class TestComponent extends CoreComponent {

  @PersistOnLocalStorage()
  heroEmail: string = 'b@tman';
}
```
When the component runs its `ngOnInit` lifecycle, it checks for all properties decorated with `@PersistOnLocalStorage`. If a non-nullish entry for the given variable exists on `localStorage`, then that value is used instead.


The following interface represents the options that can be passed to the decorator
```typescript
export interface PersistOnLocalStorageOptions {
  /**
   * A string for the namespace to scope the property value with
   * A `DeferredProp` as in
   *
   * @example
   *   @PersistOnLocalStorage({namespace: Prop('myNamespace')})
   *   heroEmailDeferred: string = 'spiderman';
   *
   *   ngOnInit() {
   *     this.myNamespace = someAsyncValue;
   *   }
   *
   * the `Prop` is resolved after ngOnInit inside CoreComponent
   */
  namespace?: string | DeferredProp;

  /**
   * When the decorated property is an object we can whilelist some properties
   * so that only those are persisted.
   *
   * @example
   *
   *  @PersistOnLocalStorage({whiteList: [ 'age' ]})
   *  fgWithWhiteList = new FormGroup({
   *    age: new FormControl(),
   *    birthDate: new FormControl(),
   *  });
   */
  whiteList?: string[];


  /**
   * When the decorated property is an object we can blackList some properties
   * so that only those are not persisted.
   *
   * @example
   *
   *  @PersistOnLocalStorage({blackList: [ 'age' ]})
   *  fgWithBlackList = new FormGroup({
   *    age: new FormControl(),
   *    birthDate: new FormControl(),
   *  });
   */
  blackList?: string[];

}
```

#### @BindToQueryParameters
> TBD add docs and examples

#### hasSearchForm
> TBD add docs and examples

#### hasPaginator
> TBD add docs and examples

#### hasSorting
> TBD add docs and examples


### Testing Utilities

####  ActivatedRouteMock
> TBD add docs and examples

#### HttpClientMock
> TBD add docs and examples

#### MockComponent
> TBD add docs and examples

#### MockService
> TBD add docs and examples
