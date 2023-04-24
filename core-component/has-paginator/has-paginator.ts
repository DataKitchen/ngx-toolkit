import { Subject } from 'rxjs';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';

export interface HasPaginator {
  paginator: MatPaginator;
  __pageChange$?: Subject<PageEvent>;
}

export function hasPaginator(c: unknown): c is HasPaginator {
    return (c as { [key: string]: any; })['paginator'] instanceof MatPaginator;
}
