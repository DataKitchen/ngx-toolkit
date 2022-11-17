import { Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface WithTable {
  paginator: MatPaginator;
  __pageChange$?: Subject<PageEvent>;
}

export function isWithTable(c: unknown): c is WithTable {
    return (c as { [key: string]: any; })['paginator'] instanceof MatPaginator;
}


