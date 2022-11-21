/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AfterContentInit, AfterViewInit, Directive, inject, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';
import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Params } from '@angular/router';
import { isPrimitive } from 'utility-types';
import { getBindableProperties, getBindablePropertyNamespace } from './decorators/bind-to-query-params/bind-to-query-params';
import { getLocalStorageOptions, getPersistOnLocalStorage, PersistOnLocalStorageOptions } from './decorators/persist-on-local-storage/persist-on-local-storage';
import { ParameterService } from '../../services/paramter/parameter.service';
import { StorageService } from '../../services/storage/storage.service';
import { hasPaginator } from './has-paginator/has-paginator';
import { hasSearchForm } from './has-search-form/has-search-form';
import { DeferredProp } from './decorators/deferred-props';
import { LifeCycle, LifeCycleHooks } from './lifecycle-hooks/lifecycle.model';
import { isObject, omit, pick } from '../../utilities/general.utilities';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { rxjsScheduler } from './rxjs-scheduler.token';
import { hasSorting } from './has-sorting/has-sorting';


@Directive()
export abstract class CoreComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  __pageChange$ = new BehaviorSubject<PageEvent>({
      pageIndex: 0, pageSize: 50, length: 0
    });

  __sortChange$ = new BehaviorSubject<Sort | undefined>(undefined);

  protected subscriptions: Subscription[] = [];
  protected destroyed$: Subject<void> = new Subject<void>();

  protected defaultDebounce: number = 100;

  private propertiesToBindToQueryParams: string[] = getBindableProperties(this);
  private propertiesToHydrateFromLocalStorage: string[] = getPersistOnLocalStorage(this);

  private hooks: LifeCycleHooks = {
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

  protected scheduler = inject(rxjsScheduler);

  constructor(
    @Self() @Optional() protected paramsService?: ParameterService,
    @Self() @Optional() protected storageService?: StorageService) {
  }

  public ngOnInit(): void {

    this.scanPropertiesForDecorators();

    if (hasSearchForm(this)) {
      this.search.valueChanges.pipe(
        tap(() => {
          if (hasPaginator(this)) {
            this.paginator.firstPage();
          }
        }),
        debounceTime(this.defaultDebounce, this.scheduler),
        // if the search form is bound to query params is has already been patched
        startWith(this.search.value),
      ).subscribe(this.search$);

    }

    this.runLifecycleHooks('OnInit');
  }

  public ngAfterViewInit(): void {

    if (hasPaginator(this)) {

      this.paginator.page.pipe(
       startWith({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.paginator.length,
        }),
        // when bindQueryParamMatPaginator is in place avoids "nexting" twice
        debounceTime(this.defaultDebounce, this.scheduler),
        takeUntil(this.destroyed$),
      ).subscribe(this.__pageChange$);

    }

    if (hasSorting(this)) {

      this.__sortBy.sortChange.pipe(
        startWith({
          active: this.__sortBy.active,
          direction: this.__sortBy.direction,
        }),
        // same as above but for bindQueryParamsMatSort
        debounceTime(this.defaultDebounce, this.scheduler),
        takeUntil(this.destroyed$),
      ).subscribe(this.__sortChange$);

    }

    this.runLifecycleHooks('AfterViewInit');
  }

  public ngAfterContentInit() {
    this.runLifecycleHooks('AfterContentInit');
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
    };
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

          if (value instanceof UntypedFormGroup) {
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

          if (value instanceof UntypedFormControl || isPrimitive(value) || value instanceof Subject) {
            params = params[`${queryParamsNamespace}${property}`] as string;
          }

          initialValueFromQueryParams = params;
        }

      }


      let initialValue;

      if (isObject(initialValueFromQueryParams) && isObject(initialValueFromLocalStorage)) {
        // @ts-ignore
        initialValue = { ...initialValueFromLocalStorage, ...initialValueFromQueryParams };
      } else {
        initialValue = (initialValueFromQueryParams || initialValueFromLocalStorage) as unknown;
      }

      if (value instanceof AbstractControl) {

        value.valueChanges.pipe(
          tap((v) => this.persistValue(v, isBoundToQueryParams, isHydratedFromLocalStorage, queryParamsNamespace, property, localStorageOptions, getLocalStorageNamespace)),
          takeUntil(this.destroyed$),
        ).subscribe();

        if (initialValue !== null && initialValue !== undefined && Object.keys(initialValue as object).length) {
          value.patchValue(initialValue, { emit: isHydratedFromLocalStorage });
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

          // @ts-ignore
          if (p[paramName] instanceof Date) {
            // @ts-ignore
            p[paramName] = p[paramName].toISOString();
          }
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
