# @datakitchen/ngx-monaco-editor

[Microsoft's Monaco editor](https://microsoft.github.io/monaco-editor/) wrapper for Angular.
> Material forms version!

## Install
With your package manager of preference, install
```
@datakitchen/ngx-monaco-editor @monaco-editor/loader monaco-editor
```

## Usage
Import `NgxMonacoEditorModule` in your app module.

```typescript
import { NgxMonacoEditorModule } from '@datakitchen/ngx-monaco-editor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Depends on
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    // Main module
    NgxMonacoEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The main module will handle loading of js dependencies for monaco editor.

> This package is meant to be used inside an Angular Material `<mat-form-field>` and used with `ReactiveForms`, hence it dependes on both.

Use it within an Angular Material form field `<mat-form-field>`.

```html
<mat-form-field>

  <mat-label>Monaco Editor</mat-label>
  <ngx-monaco-editor [formControl]="formControl"></ngx-monaco-editor>

  <mat-error *ngIf="formControl.hasError('monaco')">Invalid Json</mat-error>
</mat-form-field>
```
Where `formControl` is an instance of `FormControl`.
In case the editor goes into an erroneous state, the `monaco` field of the `errors` object is set to `true`. This can be used to show custom error messages with `<mat-error>`.

```typescript
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  styles: [],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'monaco-editor-example';

  formControl = new FormControl<string>('');
}
```
The component is set to have a minimum height of `200px`. You can control this with the css variable `--ngx-monaco-editor-min-height`, which can be overriden with something like:
```css
:host {
  --ngx-monaco-editor-min-height: 120px;
}
```
Moncaco editor configuration can be pa
By default the editor is set to handle Json.
`monacoEditor.editor.IEditorOptions` can be passed through the `NGX_MONACO_EDITOR_CONFIG` injectionToken. Such as:
```typescript
// ...
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        language: 'typescript',
        lineNumbers: false,
        // please note that this will override the default values
      }
    }
  ],
// ...
```

Default values are exported and available from `@datakitchen/ngx-monaco-editor`:

```typescript
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
```
Refer to Monaco Editor's [documentation](https://microsoft.github.io/monaco-editor/docs.html) for details.

### Running example app.
We use yarn and suggest to do so if you're planning to contribute or just playing with this code.
Following instruction assume you use yarn.
Checkout main repo and install dependencies.
Build the library with
```bash
yarn ng b ngx-monaco-editor
```
Append `--watch` while developing. Once that's done run the example app with
```bash
yarn ng serve monaco-editor-example
```
