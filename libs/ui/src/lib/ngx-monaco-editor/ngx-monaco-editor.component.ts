import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { IEditorOptions, IStandaloneCodeEditor, NGX_MONACO_EDITOR_CONFIG2 } from './ngx-monaco-editor.module';
import { Monaco } from '@monaco-editor/loader';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';
import { AbstractField } from '../fields';
import { takeUntil } from 'rxjs/operators';
import { stringify } from '@heimdall-ui/core';

@Component({
  selector: 'ngx-monaco-editor',
  templateUrl: 'ngx-monaco-editor.component.html',
  styleUrls: [ 'ngx-monaco-editor.component.scss' ],

})
export class NgxMonacoEditorComponent extends AbstractField implements OnInit, AfterViewInit {

  private _value!: string;

  // whether or not a change to the editor should be bubbled to
  // the form control
  private updateFormControl: boolean = true;
  private updateEditor: boolean = true;

  @Input() set value(value: any) {
    this._value = stringify(value, true);
  };

  get value() {
    return this._value;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() options!: IEditorOptions;

  @ViewChild('monaco') monacoElm!: ElementRef;
  @ViewChild('textarea') textarea!: ElementRef;

  error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private editor!: IStandaloneCodeEditor;

  constructor(
    private service: NgxMonacoEditorService,
    @Inject(NGX_MONACO_EDITOR_CONFIG2) private defaults: IEditorOptions,
    @Self() @Optional() protected override ngControl?: NgControl,
  ) {
    super(ngControl);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.service.monaco$.pipe(
      tap((monaco) => {
        this.defer(() => {
          this.createEditor(monaco);
        }).after('AfterViewInit');
      }),
      catchError((err) => {
        console.warn(err);
        this.error$.next(true);
        this.error$.complete();
        return EMPTY;

      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  @HostListener('window:resize')
  layout() {
    this.editor?.layout();
  }

  private createEditor(monaco: Monaco) {

    try {

      this.editor = monaco.editor.create(this.monacoElm.nativeElement, {
        value: this.value,
        ...this.defaults,
        ...this.options,
      });

      this.editor.onDidChangeModelContent(() => {
        this.editorChanged(monaco);
      });

      this.editor.onDidBlurEditorWidget(() => this.control.markAsTouched());

    } catch (e) {
      console.error(e);
      this.error$.next(true);
      this.error$.complete();
    }

  }

  override writeValue(value: any) {
    this.value = value;

    if (this.updateEditor) {
      this.service.monaco$.toPromise().then(() => {
        this.updateFormControl = false;
        this.editor.setValue(this.value);
      });
    } else {
      // same below comment on `updateFormControl`
      // this is basically to avoid an infinite loop of calls
      // between the FC that updates the editor and the editor
      // that updates again the FC
      this.updateEditor = true;
    }

  }

  private editorChanged(monaco: Monaco) {

    if (this.updateFormControl) {

      this.updateEditor = false;
      const value = this.editor.getValue();
      this.control.setValue(value);

    } else {
      // when bubbleChanges is false means that we came here
      // from an external change to the form control
      // so we don't need to set the value back on it
      // if we do we'll land on an infinite loop
      // still we want to reset `bubbleChanges`
      this.updateFormControl = true;
    }


    const errors = monaco.editor.getModelMarkers({});

    if (errors.length > 0) {
      this.control.setErrors({ monaco: true });
    }

    this.valueChange.emit(this.value);
  }

}
