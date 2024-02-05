import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import loader from '@monaco-editor/loader';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMonacoEditorComponent } from './ngx-monaco-editor.component';
import IMarker = editor.IMarker;

export const defaultOptions = {
  language: 'json',
  automaticLayout: true,
  lineNumbers: 'off',
  roundedSelection: false,
  scrollBeyondLastLine: false,
  readOnly: false,
  theme: 'vs',
  minimap: {
    enabled: false
  },
  selectOnLineNumbers: true,
  wordWrap: 'on'
};

export type IEditorOptions = monacoEditor.editor.IEditorOptions;
export type IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor;

export const NGX_MONACO_EDITOR_CONFIG = new InjectionToken<IEditorOptions>('NGX_MONACO_EDITOR_CONFIG');

export interface StandaloneCodeEditor extends IStandaloneCodeEditor {
  onDidChangeMarkers: (cb: (errors: IMarker[]) => void) => void;
}


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  declarations: [
    NgxMonacoEditorComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (service: NgxMonacoEditorService) => {

        return () => new Promise(resolve => {

          loader.init().then((monaco) => {
            service.monaco$.next(monaco);
            service.monaco$.complete();
          }).catch((err) => {
            service.monaco$.error(err);
            console.error('Error loading monaco-editor', err);
          });

          // resolve without waiting so app can start
          resolve(true);
        });
      },
      multi: true,
      deps: [ NgxMonacoEditorService ],
    },
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: defaultOptions,
    },
  ],
  exports: [
    NgxMonacoEditorComponent,
  ]
})
export class NgxMonacoEditorModule {

}
