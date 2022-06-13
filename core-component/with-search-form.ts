import { TypedFormGroup } from '../../typed-form/typed-forms';
import { $Keys, PickByValue } from 'utility-types';


export type FieldType = string | number | boolean | symbol;

export type SortableField<T extends FieldType> = T & {
  __sortable: true;
};

export type SearchableField<T extends FieldType> = T & {
  __searchable: true;
};

export type SortableAndSearchable<T extends FieldType> = T & {
  __sortable__searchable: true;
}

export type GetSortableFields<T> = $Keys<PickByValue<T, SortableField<FieldType> | SortableAndSearchable<FieldType>>>;

export type GetSearchableFields<T> = PickByValue<T, SearchableField<FieldType> | SortableAndSearchable<FieldType>>;

export type Rebrand<T> = {
  [k in keyof T]: T[k] extends SortableField<infer R> ? R :
                  T[k] extends SortableAndSearchable<infer R> ? R :
                  T[k] extends SearchableField<infer R> ? R : T[k]
};

export function make<T extends FieldType>(v: T): SearchableField<T> & SortableField<T> & SortableAndSearchable<T>{
  return v as SearchableField<T> & SortableField<T> & SortableAndSearchable<T>;
}

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface WithSearchForm<E extends { [key: string]: any }> {
    search: TypedFormGroup<E>;
    onSearchChange: (search: E) => void;
}

export function isWithSearchForm(c: unknown): c is WithSearchForm<any> {
    return typeof (c as { [key: string]: any; })['onSearchChange'] === 'function';
}
