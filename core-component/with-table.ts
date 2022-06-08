import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Entity } from '../../entity/entity.model';
import { GetSortableFields } from './with-search-form';

export interface SortOptions<E = Entity> {
  sort_by?: GetSortableFields<E>;
  order?: 'asc' | 'desc' | '';
}

export interface Pagination {
  page?: number;
  count?: number;
}

export const defaultPagination: Pagination & SortOptions<Entity> = {
  page: 0,
  count: 10,
  sort_by: 'name',
  order: 'asc',
};

export interface WithTable {
    paginator: MatPaginator;

    pageChange$?: BehaviorSubject<Pagination>;

    sortBy?: MatSort;
    onPageChange: (page: Pagination) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class WithTable {}

export function isWithTable(c: unknown): c is WithTable {
    return typeof (c as { [key: string]: any; })['onPageChange'] === 'function';
}

