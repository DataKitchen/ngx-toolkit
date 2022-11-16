import { InjectionToken } from '@angular/core';
import { asyncScheduler } from 'rxjs';

export const rxjsScheduler = new InjectionToken('rxjs/scheduler', {
  providedIn: 'root',
  factory: () => {
    return asyncScheduler;
  }
});
