/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AfterContentInit, AfterViewChecked, AfterViewInit, Directive, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, scan, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Params } from '@angular/router';
import { isObject, keysIn, omit, pick } from 'lodash';
import { $Keys, isPrimitive } from 'utility-types';
import { getBindableProperties, getBindablePropertyNamespace } from './decorators/bind-to-query-params/bind-to-query-params';
import { getLocalStorageOptions, getPersistOnLocalStorage, PersistOnLocalStorageOptions } from './decorators/persist-on-local-storage/persist-on-local-storage';
import { ParameterService } from '../../services/paramter/parameter.service';
import { StorageService } from '../../services/storage/storage.service';
import { defaultPagination, isWithTable, Pagination, WithTable } from './with-table';
import { isWithSearchForm, WithSearchForm } from './with-search-form';
import { DeferredProp } from './decorators/deferred-props';
import { LifeCycle, LifeCycleHoos } from './lifecycle.model';

@Directive()
export abstract class CoreComponent implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, OnDestroy {

  public tableBindingsInitialized: boolean = false;

  protected subscriptions: Subscription[] = [];
  protected destroyed$: Subject<void> = new Subject<void>();

  private propertiesToBindToQueryParams: string[] = getBindableProperties(this);
  private propertiesToHydrateFromLocalStorage: string[] = getPersistOnLocalStorage(this);
  private defaultDebounce: number = 300;

  private hooks: LifeCycleHoos = {
    OnInit: {
      hooked: [],
      done: false,
    },
    AfterContentInit: {
      hooked: [],
      done: false,
    },
    AfterViewInit: {
      hooked: [],
      done: false,
    },
  };

  constructor(
    @Self() @Optional() protected paramsService?: ParameterService,
    @Self() @Optional() protected storageService?: StorageService) {
  }

  public ngOnInit(): void {
    const listObservables: Array<Observable<any>> = [];

    this.scanPropertiesForDecorators();

    // logic for interfaces
    if (isWithTable(this)) {
      this.pageChange$ = new BehaviorSubject(defaultPagination);
      listObservables.push(this.pageChange$);
    }

    if (isWithSearchForm(this)) {
      listObservables.push(
        // noinspection JSDeprecatedSymbols
        this.search.valueChanges.pipe(
          // if the search form is bound to query params is has already been patched
          debounceTime(this.defaultDebounce),
          startWith(this.search.value),
        )
      );
    }

    if (listObservables.length > 0) {
      merge(...listObservables).pipe(
        scan((acc: { pagination: Pagination<any>; search: any }, value: unknown | Pagination<any>) => {
          const keys = keysIn(value) as unknown as Array<$Keys<Pagination<any>>>;
          const paginationKeys: Set<$Keys<Pagination<any>>> = new Set([ 'page', 'count', 'sort_by', 'order' ]);
          const isPagination = keys.filter(key => paginationKeys.has(key)).length > 0;

          return Object.assign(
            {},
            acc,
            isPagination
              ? {pagination: value as Pagination<any>}
              : {pagination: {...(acc.pagination || {}), page: 0}, search: value},
          );
        }, {} as { pagination: Pagination<any>; search: any }),
        // TODO with debounce time on tests fail, do we actually need it?
        // debounceTime(10),
        tap((data) => {
          if (data.pagination && isWithTable(this)) {
            (this as unknown as WithTable<any>).onPageChange(data.pagination);
          }
          if (data.search && isWithSearchForm(this)) {
            (this as unknown as WithSearchForm<any>).onSearchChange(data.search);
          }
        }),
        takeUntil(this.destroyed$),
        catchError((err) => {
          console.error(err);
          return err;
        })
      ).subscribe();
    }

    this.runLifecycleHooks('OnInit');
  }

  public ngAfterViewInit(): void {

    if (isWithTable(this)) {

      if (this.paginator) {
        this.paginator.page.pipe(
          distinctUntilChanged((prev, current) => {
            // when on paginator is used bindQueryParamsMatPaginator directive
            // we get a second emitted value coming from the ngOnChanges of that directive
            // to avoid unnecessary calls to lifecycle hook we check if pageSize or pageIndex actually changed
            return prev.pageIndex === current.pageIndex && prev.pageSize === current.pageSize;
          }),
          // @ts-ignore
          withLatestFrom(this.pageChange$),
          map(([{pageIndex: page, pageSize: count}, pagination ]) => {
            return {...pagination, page, count};
          }),
          tap((page) => {
            // @ts-ignore
            (this as unknown as WithTable<any>).pageChange$.next(page);
          }),
          takeUntil(this.destroyed$),
        ).subscribe();
        this.tableBindingsInitialized = true;
      }

      if (this.sortBy) {
        this.sortBy.sortChange.pipe(
          distinctUntilChanged((p, c) => {
            // same note as above for MatPaginator but regarding
            // bindQueryParamsMatSort and setInitialValue
            return p.direction === c.direction && p.active === c.active;
          }),
          // @ts-ignore
          withLatestFrom(this.pageChange$),
          map(([{active, direction}, pagination ]) => {

            return {...pagination, order: direction, sort_by: active};
          }),
          tap((page) => {
            // @ts-ignore
            (this as unknown as WithTable<any>).pageChange$.next(page);
          }),
          takeUntil(this.destroyed$),
        ).subscribe();
        this.tableBindingsInitialized = true;
      }
    }


    this.runLifecycleHooks('AfterViewInit');
  }

  public ngAfterContentInit() {
    this.runLifecycleHooks('AfterContentInit');
  }

  public ngAfterViewChecked(): void {
    if (!this.tableBindingsInitialized && isWithTable(this)) {
      this.ngAfterViewInit();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();

    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  public defer(fn: () => void) {
    return {
      after: (lc: LifeCycle) => {
        if (!this.hooks[lc].done) {
          this.hooks[lc].hooked.push(fn);
        } else {
          fn();
        }
      }
    }
  }

  private scanPropertiesForDecorators() {
    if (this.propertiesToBindToQueryParams.length) {
      if (!this.paramsService) {
        console.error('Some properties are annotated with @BindToQueryParams but ParameterService is not available. Did you forget to inject it?');
        return;
      }
    }

    if (this.propertiesToHydrateFromLocalStorage.length) {
      if (!this.storageService) {
        console.error('Some properties are annotated with @PersistOnLocalStorage but StorageService is not available. Did you forget to inject it?');
        return;
      }
    }

    const decoratedProperties = new Set([ ...this.propertiesToBindToQueryParams, ...this.propertiesToHydrateFromLocalStorage ]);

    decoratedProperties.forEach((property) => {

      // @ts-ignore
      const value = this[property] as unknown;

      const isBoundToQueryParams = this.propertiesToBindToQueryParams.includes(property);
      const isHydratedFromLocalStorage = this.propertiesToHydrateFromLocalStorage.includes(property);

      let initialValueFromQueryParams;
      let initialValueFromLocalStorage;
      const queryParamsNamespaceOption = getBindablePropertyNamespace(this, property);
      const queryParamsNamespace = (queryParamsNamespaceOption as DeferredProp)?.resolve?.(this) || queryParamsNamespaceOption as string || '';
      const localStorageOptions: PersistOnLocalStorageOptions = getLocalStorageOptions(this, property);
      const getLocalStorageNamespace = () => (localStorageOptions.namespace as DeferredProp)?.resolve?.(this) || localStorageOptions.namespace as string || '';

      if (isHydratedFromLocalStorage) {
        // get value from local storage
        initialValueFromLocalStorage = this.storageService?.getStorage([ getLocalStorageNamespace(), property ].join('')) as unknown;
      }

      if (isBoundToQueryParams) {
        // get value from query params
        let params: Params | string = this.paramsService?.getQueryParams() || {};

        if (params) {

          if (value instanceof FormGroup) {
            params = Object.keys(value.controls)
              .reduce((p, fieldName) => {
                // filter out undefined params
                // every is a string so '0' and 'false' will pass
                // @ts-ignore
                if (params[`${queryParamsNamespace}${fieldName}`]) {
                  // @ts-ignore
                  p[fieldName] = params[`${queryParamsNamespace}${fieldName}`] as string;
                }

                return p;
              }, {});
          }

          if (value instanceof FormControl || isPrimitive(value) || value instanceof Subject) {
            params = params[`${queryParamsNamespace}${property}`] as string;
          }

          initialValueFromQueryParams = params;
        }

      }


      let initialValue;

      if (isObject(initialValueFromQueryParams) && isObject(initialValueFromLocalStorage)) {
        initialValue = {...initialValueFromLocalStorage, ...initialValueFromQueryParams};
      } else {
        initialValue = (initialValueFromQueryParams || initialValueFromLocalStorage) as unknown;
      }

      if (value instanceof AbstractControl) {

        value.valueChanges.pipe(
          tap((v) => this.persistValue(v, isBoundToQueryParams, isHydratedFromLocalStorage, queryParamsNamespace, property, localStorageOptions, getLocalStorageNamespace)),
          takeUntil(this.destroyed$),
        ).subscribe();

        if (initialValue !== null && initialValue !== undefined && Object.keys(initialValue as object).length) {
          value.patchValue(initialValue, {emit: isHydratedFromLocalStorage});
        }

      } else if (isPrimitive(value)) {

        // eslint-disable-next-line no-prototype-builtins
        if (this.hasOwnProperty(`#__${property}__#`)) {
          console.error(`@PersistOnLocalStorage decorator is being used on a property that cannot be watched since it\\'s placeholder is already defined. Offending property: "${property}". Placeholder: "#__${property}__#"`);
        }
        // @ts-ignore
        delete this[property];

        Object.defineProperty(this, property, {
          set: (v: any) => {
            // @ts-ignore
            this[`#__${property}__#`] = v;
            this.persistValue(v, isBoundToQueryParams, isHydratedFromLocalStorage, queryParamsNamespace, property, localStorageOptions, getLocalStorageNamespace);
          },
          get() {
            return this[`#__${property}__#`];
          }

        });

        if (initialValue !== null && initialValue !== undefined && Object.keys(initialValue as object).length) {
          // @ts-ignore
          this[`#__${property}__#`] = initialValue;
        } else {
          // @ts-ignore
          this[`#__${property}__#`] = value;
        }

        if (isBoundToQueryParams && isHydratedFromLocalStorage) {
          // here we want to make sure that initial values from local storage are mirrored on the query params.
          // In other cases we took advantage of the reactive behaviour of the types in play to make it happen
          this.paramsService?.setQueryParams({
            // @ts-ignore
            [`${queryParamsNamespace}${property}`]: this[`#__${property}__#`]
          });
          // @ts-ignore
          this.storageService?.setStorage([ getLocalStorageNamespace(), property ].join(''), this[`#__${property}__#`]);
        }


      } else if (value instanceof Subject) {

        if (initialValue !== null && initialValue !== undefined) {
          if (isObject(initialValue) && !Array.isArray(initialValue)) {
            // @ts-ignore
            value.next(initialValue[[ queryParamsNamespace, property ].join('')]);
          } else {

            value.next(initialValue);
          }
        }

        value.pipe(
          tap((v) => {
            this.persistValue(v, isBoundToQueryParams, isHydratedFromLocalStorage, queryParamsNamespace, property, localStorageOptions, getLocalStorageNamespace);
          }),
          takeUntil(this.destroyed$)
        ).subscribe();

      } else {
        if (isBoundToQueryParams) {
          console.error(`@BindToQueryParams decorator has not been implemented yet to be used on this type of property! Offending property: "${property}"`);

        }

        if (isHydratedFromLocalStorage) {
          console.error(`@PersistOnLocalStorage decorator has not been implemented yet to be used on this type of property! Offending property: "${property}"`);
        }

      }

    });
  }

  // @ts-ignore
  private persistValue(v: any, isBoundToQueryParams: boolean, isHydratedFromLocalStorage: boolean, queryParamsNamespace, property, localStorageOptions: PersistOnLocalStorageOptions, getLocalStorageNamespace: () => string) {
    if (isBoundToQueryParams) {

      let searchParams = {};
      if (isObject(v)) {
        searchParams = Object.keys(v).reduce((p, fieldName) => {
          const paramName = [ queryParamsNamespace, fieldName ].join('');
          // @ts-ignore
          p[paramName] = v[fieldName] as unknown;
          return p;
        }, {});
      } else if (isPrimitive(v)) {
        searchParams = {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          [queryParamsNamespace + property]: v as unknown,
        };
      }

      this.paramsService?.setQueryParams(searchParams);
    }

    if (isHydratedFromLocalStorage) {
      let valueToStore = v as unknown;

      // only if v is an object
      if (isObject(v)) {
        if (localStorageOptions.whiteList?.length) {
          // add whitelisted properties
          valueToStore = pick(v, localStorageOptions.whiteList);
        }

        // remove blacklisted properties
        if (localStorageOptions.blackList?.length) {
          valueToStore = omit(valueToStore as Record<string, unknown>, localStorageOptions.blackList);
        }
      }

      this.storageService?.setStorage([ getLocalStorageNamespace(), property ].join(''), valueToStore);

    }

  }

  private runLifecycleHooks(lifecycle: LifeCycle) {
    this.hooks[lifecycle].hooked.forEach((fn) => {
      fn();
    });

    this.hooks[lifecycle].done = true;
  }
}
