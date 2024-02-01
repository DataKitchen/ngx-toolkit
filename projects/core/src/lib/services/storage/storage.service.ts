import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export const LocalStoragePrefix = new InjectionToken<string>('LocalStoragePrefixNamespace');

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor(
    @Inject(LocalStoragePrefix) @Optional() private readonly prefix: string = '',
  ) {}

  setStorage(key: string, data: unknown): void {
    const dataString = JSON.stringify(data);
    localStorage.setItem(`${this.prefix}:${key}`, dataString);
  }

  getStorage(key: string): any {
    const data = localStorage.getItem(`${this.prefix}:${key}`);
    return data ? JSON.parse(data) : undefined;
  }
}
