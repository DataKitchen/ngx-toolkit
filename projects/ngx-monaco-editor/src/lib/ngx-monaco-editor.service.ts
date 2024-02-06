/* istanbul ignore file */
import { Inject, Injectable } from '@angular/core';
import { AsyncSubject, tap } from 'rxjs';
import { Monaco } from '@monaco-editor/loader';
import { IEditorOptions, NGX_MONACO_EDITOR_CONFIG, StandaloneCodeEditor } from './ngx-monaco-editor.module';
import { editor } from 'monaco-editor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import IMarker = editor.IMarker;

@Injectable({
  providedIn: 'root',
})
export class NgxMonacoEditorService {
  monaco$: AsyncSubject<Monaco> = new AsyncSubject<Monaco>();

  private monaco!: Monaco;

  private didChangeMarkersCallbacks: {
    [uri: string]: Array<(errors: IMarker[]) => void>;
  } = {};

  constructor(
    @Inject(NGX_MONACO_EDITOR_CONFIG) private defaults: IEditorOptions,
  ) {

    this.monaco$.pipe(
      tap((monaco) => {
        this.monaco = monaco;


        monaco.editor.onDidChangeMarkers((clients) => {
          console.log('errors changed');

          for (const client of clients) {
            const errors = monaco.editor.getModelMarkers({ resource: client });
            console.log('errors in', client.toString(), errors);
            for (const didChangeMarkersCallbackElement of this.didChangeMarkersCallbacks[client.toString()]) {
              didChangeMarkersCallbackElement(errors);
            }
          }
        });
      }),
      takeUntilDestroyed(),
    ).subscribe();
  }

  create(elm: HTMLElement, { value, options }: { value: string, options: editor.IEditorOverrideServices }): StandaloneCodeEditor {

    const editor = this.monaco.editor.create(elm, {
      value,
      ...this.defaults,
      ...options,
    });

    this.didChangeMarkersCallbacks[editor.getModel()!.uri.toString()] = [];

    (editor as StandaloneCodeEditor).onDidChangeMarkers = (cb) => {
      this.didChangeMarkersCallbacks[editor.getModel()!.uri.toString()].push(cb);
    };

    return editor as StandaloneCodeEditor;
  }

}
