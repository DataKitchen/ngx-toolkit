import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {

  private queryParams: Params = {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    this.activatedRoute.queryParams.pipe(
      tap((params) => {
        this.queryParams = params;
      })
    ).subscribe();
  }

  getQueryParams(): Params {
    return this.queryParams;
  }

  async setQueryParams(params: Params) {
    this.queryParams = {...this.queryParams, ...params};

    return this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: this.queryParams,
      replaceUrl: true,
    });
  }
}
