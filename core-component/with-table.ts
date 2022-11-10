import { BehaviorSubject, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SortOptions {
  // sort_by?: GetSortableFields<E>;
  sort?: 'asc' | 'desc' | '';
}

export interface Pagination extends SortOptions{
  page?: number;
  count?: number;
}

export const defaultPagination: Pagination & SortOptions = {
  page: 0,
  count: 10,
  // sort_by: 'name',
  sort: 'asc',
};

export interface WithTable {
  paginator: MatPaginator;

  __pageChange$?: BehaviorSubject<Pagination>;

  __sortBy?: MatSort;

  // Implementing this lifecycle is no longer mandatory, components that
  // implement this interface can either use `onPageChange` or `pageChange$`
  onPageChange?: (page: Pagination) => void;
}

export function isWithTable(c: unknown): c is WithTable {
    return typeof (c as { [key: string]: any; })['onPageChange'] === 'function' || (c as { [key: string]: any; })['__pageChange$'] instanceof Subject;
}

export function isPagination(c: unknown): c is Pagination {
  return typeof c === 'object' && c !== null && c !== undefined && 'page' in c;
}
