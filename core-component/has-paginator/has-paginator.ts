import { Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface HasPaginator {
  paginator: MatPaginator;
  __pageChange$?: Subject<PageEvent>;
}

export function hasPaginator(c: unknown): c is HasPaginator {
    return (c as { [key: string]: any; })['paginator'] instanceof MatPaginator;
}
