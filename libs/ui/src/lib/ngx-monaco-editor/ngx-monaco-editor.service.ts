import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { Monaco } from '@monaco-editor/loader';

@Injectable({
  providedIn: 'root',
})
export class NgxMonacoEditorService {
  monaco$: AsyncSubject<Monaco> = new AsyncSubject<Monaco>();
}
