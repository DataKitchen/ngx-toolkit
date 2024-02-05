import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IEditorOptions, NGX_MONACO_EDITOR_CONFIG, NgxMonacoEditorModule } from '@datakitchen/ngx-monaco-editor';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxMonacoEditorModule,
  ],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        language: 'typescript',
        lineNubers: false,

      } as IEditorOptions,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
