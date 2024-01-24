import { InjectionToken } from '@angular/core';
import { asyncScheduler, SchedulerLike } from 'rxjs';

export const rxjsScheduler = new InjectionToken<SchedulerLike>('rxjs/scheduler', {
  providedIn: 'root',
  factory: () => {
    return asyncScheduler;
  }
});
