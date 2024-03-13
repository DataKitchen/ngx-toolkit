/* eslint-disable @angular-eslint/no-input-rename,@angular-eslint/no-host-metadata-property,@typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';
import { AbstractMatFormFieldControl } from './abstract-mat-form-field-control/abstract-mat-form-field-control.directive';
import { FormControl } from '@angular/forms';
import { IEditorOptions, StandaloneCodeEditor } from './ngx-monaco-editor.model';


@Component({
  selector: 'ngx-monaco-editor',
  template: `
    <div #monaco class="ngx-monaco-editor"></div>
    <textarea #textarea [class.hidden]="(error$ | async) === false"
        [formControl]="_control"></textarea>
  `,
  providers: [
    { provide: MatFormFieldControl, useExisting: NgxMonacoEditorComponent },
  ],

  styles: [ `
    .ngx-monaco-editor {
      min-height: var(--ngx-monaco-editor-min-height, 200px);
    }

    .hidden {
      display: none;
    }
  ` ]
})
export class NgxMonacoEditorComponent extends AbstractMatFormFieldControl<string|null> implements AfterViewInit {

  override controlType = 'ngx-monaco-editor-input';

  @ViewChild('monaco') monacoElm!: ElementRef;
  @ViewChild('textarea') textarea!: ElementRef;

  @Input() options!: IEditorOptions;

  _control = new FormControl<string>('');

  error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private editor!: StandaloneCodeEditor;

  private service: NgxMonacoEditorService = inject(NgxMonacoEditorService);

  getEmptyState(): boolean {
    // this must be set to false so that the mat-form-field will show the label
    // always floating.
    return false;
  }

  getValue() {
    return this._control.value;
  }

  setValue(v: string): void {
    this._control.setValue(v);
  }

  /* istanbul ignore next */
  ngAfterViewInit() {

    this.service.monaco$.pipe(
      tap(() => {
        void this.createEditor();
      }),
      catchError((err) => {
        console.warn(err);
        this.error$.next(true);
        this.error$.complete();
        return EMPTY;

      }),
      // TODO need to unsubscribe here
    ).subscribe();
  }

  /* istanbul ignore next */
  private async createEditor() {

    try {

      this.editor = this.service.create(this.monacoElm.nativeElement, {
        value: this.value || '',
        options: this.options,
      });

      this.editor.onDidChangeModelContent(() => {
        this.value = this.editor.getValue();
        // triggers a value change to the parent
        this.onChange(this.value);
      });


      this.editor.onDidBlurEditorWidget(() => {
        this._control.markAsTouched();
      });

      this.editor.onDidChangeMarkers((errors) => {

        if (errors.length) {

          this._control.setErrors({ monaco: true });

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (this.ngControl.form as TypedFormControl<any>).setErrors({ monaco: true });
        } else {
          this._control.setErrors(null);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (this.ngControl.form as TypedFormControl<any>).setErrors(null);
        }

      });


    } catch (e) {
      console.error(e);
      this.error$.next(true);
      this.error$.complete();
    }

  }
}
