import { Directive, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Directive()
export abstract class UnsubscribeOnDestroy implements OnDestroy {

    protected subscriptions: Subscription[] = [];
    protected componentDestroyed = new Subject();

    ngOnDestroy(): void {
        this.unsubscribeOnDestroy();
    }

    protected unsubscribeOnDestroy(): void {
        this.componentDestroyed.next(null);
        this.componentDestroyed.complete();

        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
    }
}
