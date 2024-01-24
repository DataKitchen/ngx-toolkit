import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';

export interface HasSorting {
  __sortBy: MatSort;
  __sortChanged$?: BehaviorSubject<Sort>;
}

export function hasSorting(c: unknown): c is HasSorting {
  return (c as { [key: string]: any; })['__sortBy'] instanceof MatSort;
}
