import { Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


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


