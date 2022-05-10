import { TypedFormGroup } from '../../typed-form/typed-forms';
import { $Keys, PickByValue } from 'utility-types';


export type FieldType = string | number | boolean;

export type SortableField<T extends FieldType> = T & {
  __sortable: true;
};

export type SearchableField<T extends FieldType> = T & {
  __searchable: true;
};

export type SortableAndSearchable<T extends FieldType> = T & SortableField<T> & SearchableField<T>;

export type GetSortableFields<T> = $Keys<PickByValue<T, SortableField<FieldType>>>;

export type GetSearchableFields<T> = PickByValue<T, SearchableField<FieldType>>;

export function make<T extends FieldType>(v: T): SearchableField<T> & SortableField<T> {
  return v as SearchableField<T> & SortableField<T>;
}

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;


export interface WithSearchForm<E extends { [key: string]: any }> {
    search: TypedFormGroup<E>;
    onSearchChange: (search: E) => void;
}

export function isWithSearchForm(c: unknown): c is WithSearchForm<any> {
    return typeof (c as { [key: string]: any; })['onSearchChange'] === 'function';
}
