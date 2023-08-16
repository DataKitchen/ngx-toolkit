/* eslint-disable @angular-eslint/no-input-rename,@angular-eslint/no-host-metadata-property,@typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { TypedFormControl } from '@heimdall-ui/core';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';
import { IEditorOptions, StandaloneCodeEditor } from './ngx-monaco-editor.module';
import { AbstractMatFormFieldControl } from '../fields/abstract-mat-form-field-control.directive';


@Component({
  selector: 'ngx-monaco-editor',
  template: `
    <div #monaco
      class="fx-flex ngx-monaco-editor-input-container"></div>

    <textarea #textarea [class.hidden]="(error$ | async) === false"
        [formControl]="_control"></textarea>
  `,
  providers: [
    { provide: MatFormFieldControl, useExisting: NgxMonacoEditorComponent },
  ],

  styles: [ `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 200px;
    }
  ` ]
})
export class NgxMonacoEditorComponent extends AbstractMatFormFieldControl<string> implements AfterViewInit {

  override controlType = 'ngx-monaco-editor-input';

  @ViewChild('monaco') monacoElm!: ElementRef;
  @ViewChild('textarea') textarea!: ElementRef;

  @Input() options!: IEditorOptions;

  _control = new TypedFormControl<string>();

  error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private editor!: StandaloneCodeEditor;

  private service: NgxMonacoEditorService = inject(NgxMonacoEditorService);

  getEmptyState(): boolean {
    // this must be set to false so that the mat-form-field will show the label
    // always floating.
    return false;
  }

  getValue(): string {
    return this._control.value;
  }

  setValue(v: string): void {
    this._control.setValue(v);
  }

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

  private async createEditor() {

    try {

      this.editor = await this.service.create(this.monacoElm.nativeElement, {
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

          // @ts-ignore
          (this.ngControl.form as TypedFormControl<any>).setErrors({ monaco: true });
        } else {
          this._control.setErrors(null);
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
