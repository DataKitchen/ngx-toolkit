import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Entity } from '../../entities/entity.model';
import { GetSortableFields } from './with-search-form';

export interface SortOptions<E extends Entity = Entity> {
  sort_by?: GetSortableFields<E>;
  order?: 'asc' | 'desc' | '';
}

export interface Pagination<E extends Entity> extends SortOptions<E> {
  page?: number;
  count?: number;
}

export const defaultPagination: Pagination<Entity> = {
  page: 0,
  count: 10,
  sort_by: 'name',
  order: 'asc',
};

export interface WithTable<E extends Entity> {
    paginator: MatPaginator;

    pageChange$?: BehaviorSubject<Pagination<E>>;

    sortBy?: MatSort;
    onPageChange: (page: Pagination<E>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class WithTable<E extends Entity> {}

export function isWithTable(c: unknown): c is WithTable<any> {
    return typeof (c as { [key: string]: any; })['onPageChange'] === 'function';
}

