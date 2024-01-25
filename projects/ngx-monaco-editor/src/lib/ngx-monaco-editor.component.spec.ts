import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';
import { of } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NGX_MONACO_EDITOR_CONFIG2 } from './ngx-monaco-editor.module';
import { NgxMonacoEditorComponent } from './ngx-monaco-editor.component';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import Mock = jest.Mock;
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/*
  There are two know bugs left to resolve

  1) when the editor is initialized with a string containing an error (respect to the language set) the form does not receive the error state

  2) if the initial value is a json object the form hold the value as is. ie. the json object while the
    editor has the stringified version of it
 */

describe('NgxMonacoComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  const initialValue = '{\ntest:"2"\n}';

  let createSpy: Mock;
  let setValueSpy: Mock;
  let getValueSpy: Mock;
  let getModelMarkersSpy: Mock;

  @Component({
    selector: 'test-component',
    template: `
      <mat-form-field>
        <mat-label></mat-label>

        <ngx-monaco-editor [formControl]="testControl"></ngx-monaco-editor>

        <mat-hint></mat-hint>

        <mat-error>

        </mat-error>

        <mat-icon matPrefix></mat-icon>
        <mat-icon matSuffix></mat-icon>

      </mat-form-field>
    `
  })
  class TestComponent {
    @ViewChild(NgxMonacoEditorComponent) editor!: NgxMonacoEditorComponent;

    testControl = new FormControl(initialValue);
  }

  beforeEach(async () => {
    createSpy = jest.fn();
    setValueSpy = jest.fn();
    getValueSpy = jest.fn();
    getModelMarkersSpy = jest.fn().mockReturnValue([]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatLegacyFormFieldModule,
        NoopAnimationsModule,
      ],
      declarations: [
        NgxMonacoEditorComponent,
        TestComponent,
      ],
      providers: [
        {
          provide: NGX_MONACO_EDITOR_CONFIG2,
          useValue: {},
        },
        {
          provide: NgxMonacoEditorService,
          useClass: class {
          // eslint-disable-next-line @typescript-eslint/ban-types
          modelChangedCb!: Function;

          value!: string;

          monaco$ = of({
            editor: {
              getModelMarkers: getModelMarkersSpy,
              onDidChangeMarkers: () => {
                console.log('called onDidChangeMarkers');
              }
            }
          });

          create = createSpy.mockImplementation(() => {
            return {
              onDidChangeModelContent: jest.fn().mockImplementation((cb) => {
                this.modelChangedCb = cb;
              }),
              onDidBlurEditorWidget: jest.fn(),
              setValue: setValueSpy.mockImplementation((value) => {
                this.value = value;
                this.modelChangedCb.call(
                  component.editor);
              }),
              getValue: getValueSpy.mockImplementation(() => {
                return this.value;
              }),
              onDidChangeMarkers: getModelMarkersSpy,
            };
          });

          }
        }
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form control', () => {

    it('should create an editor with initial value', () => {
      expect(createSpy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        value: initialValue,
      }));

    });

    it('should have initial value set internally', () => {
      expect(component.editor.value).toEqual(initialValue);
    });
  });


  describe('form control changes', () => {

    const value = '{\ntest: "changed!"\n}';

    beforeEach(() => {
      // @ts-ignore
      component.testControl.patchValue(value);
    });

    it('should set editor model', () => {
      expect(component.editor.value).toEqual(value);
    });

  });

  describe('editor changes', () => {

    beforeEach(() => {
      setValueSpy.mockClear();
      component.editor['editor'].setValue('value');
    });

    it('should update the model', () => {

      expect(component.testControl.value).toEqual('value');

    });

    it('should not update again the editor', () => {
      expect(setValueSpy).toHaveBeenCalledTimes(1);
    });

  });

});
