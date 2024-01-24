import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, Params } from '@angular/router';

export interface MockRoute {
  params: Observable<Params>;
  queryParams: Observable<Params>;
  snapshot: {
    params: Params;
    queryParams: Params;
    pathFromRoot: ActivatedRouteSnapshot[];
  };
  parent?: MockRoute;
  children: MockRoute[];
}

export function ActivatedRouteMock(params: Params = {}, queryParams: Params = {}, parent?: MockRoute): MockRoute {
  return {
    parent,
    params: of(params),
    queryParams: of(queryParams),
    snapshot: {
      params, queryParams,
      pathFromRoot: [],
    },
    children: [],
  };
}
