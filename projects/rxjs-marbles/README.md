# @datakitchen/rxjs-marbles

Wrapper around rxjs own TestScheduler used to simplify and streamline marble testing.

## Install

With the package manager of your choice install
```
@datakitchen/rxjs-marbles
```
## TestScheduler

> `expect(expected).toEqual(actual)` this the current comparator used so this package can only be used with testing frameworks and support this syntax.

To instantiate a new `TestScheduler`
```typescript
let testScheduler: TestScheduler;

beforeEach(() => {
    testScheduler = new TestScheduler();
});
```
`testScheduler` extends rxjs' own `TestScheduler` so `expectObservable` can be used as usual
```typescript
it('.toBe', () => {
    const source$ = new BehaviorSubject(1);
    testScheduler.expectObservable(source$).toBe('(a|)', {a: 1});
});

it('.toEqual', () => {
    const source$ = new BehaviorSubject(1);
    testScheduler.expectObservable(source$).toEqual(of(1));
});
```
Both the above pass.
Also if anything need to happen when asserting an observable `.run` method can be used as in
```typescript
it('.run', () => {
    testScheduler.run(({cold, expectObservable}) => {
        const cold$ = cold('---a');
        expectObservable(cold$).toBe('---a');
    });
});
```
This package add a new method `expect$` with few differences with `expectObservable`

- `.run` works exactly the same
- `.toEqual` is stricter and will fail the above test but pass the following
```typescript
it('.toEqual', () => {
    const source$ = new BehaviorSubject(1);
    const expected$ = new BehaviorSubject(1);
    testScheduler.expect$(source$).toEqual(expected$);
});

```
- `.toContain` can check whether a stream contains a given value. I.e.:
```typescript
it('.toContain', () => {
    testScheduler.expect$(from([ 1, 2, 3 ])).toContain(2);
});
```
