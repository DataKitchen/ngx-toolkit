import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import loader from '@monaco-editor/loader';
import { NgxMonacoEditorComponent } from './ngx-monaco-editor.component';
import { NGX_MONACO_EDITOR_CONFIG, defaultOptions } from './ngx-monaco-editor.model';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';



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
