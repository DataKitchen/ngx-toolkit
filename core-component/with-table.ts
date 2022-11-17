import { BehaviorSubject, Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';


// TODO move SortOptions and Pagination to Entity
export interface SortOptions {
  sort_by?: any;
  sort?: 'asc' | 'desc' | '';
}

export interface Pagination extends SortOptions{
  page?: number;
  count?: number;
}

export function isPagination(c: unknown): c is Pagination {
  return typeof c === 'object' && c !== null && c !== undefined && 'page' in c;
}


export interface WithTable {
  paginator: MatPaginator;
  __pageChange$?: Subject<PageEvent>;
}

export function isWithTable(c: unknown): c is WithTable {
    return (c as { [key: string]: any; })['paginator'] instanceof MatPaginator;
}

export interface HasSorting {
  __sortBy: MatSort;
  __sortChanged$?: BehaviorSubject<Sort>;
}

export function hasSorting(c: unknown): c is HasSorting {
  return (c as { [key: string]: any; })['__sortBy'] instanceof MatSort;
}
