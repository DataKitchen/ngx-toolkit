import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    private prefix = 'heimdall-storage-';

    setStorage(key: string, data: unknown): void {
      const dataString = JSON.stringify(data);
      localStorage.setItem(`${this.prefix}:${key}`, dataString);
    }

    getStorage(key: string): any {
      const data = localStorage.getItem(`${this.prefix}:${key}`);
      return data ? JSON.parse(data) : undefined;
    }
}
