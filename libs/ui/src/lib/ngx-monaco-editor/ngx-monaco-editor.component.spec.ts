import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMonacoEditorComponent } from './ngx-monaco-editor.component';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';
import { MockProvider } from '@heimdall-ui/testing/mock-service';
import { of } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NGX_MONACO_EDITOR_CONFIG2 } from './ngx-monaco-editor.module';
import Mock = jest.Mock;

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
      <ngx-monaco-editor [formControl]="testControl"></ngx-monaco-editor>
    `
  })
  class TestComponent {
    @ViewChild(NgxMonacoEditorComponent) editor: NgxMonacoEditorComponent;


    value = 'initial value';
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
        MockProvider(NgxMonacoEditorService, class {
          // eslint-disable-next-line @typescript-eslint/ban-types
          modelChangedCb: Function;

          value: string;

          monaco$ = of({
            editor: {
              getModelMarkers: getModelMarkersSpy,
              create: createSpy.mockImplementation(() => {
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
                }
              }),
            }
          });
        })
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
      component.testControl.patchValue(value);
    });

    it('should set editor model', () => {
      expect(component.editor.value).toEqual(value);
    });

    it('should update the editor', () => {
      expect(setValueSpy).toHaveBeenCalledWith(value);
      // this is for testing implicitly that the
      // form control has not been patched again
      // which would happen when the form changes
      // programmatically which updates the editor
      expect(getValueSpy).not.toHaveBeenCalled();
    });

    it('should parse non string value', () => {
      const value = { test: true };
      // @ts-ignore
      component.testControl.patchValue(value);

      expect(component.editor.value).toEqual(JSON.stringify(value, null, 2))

    });

  });

  describe('editor changes', () => {

    beforeEach(() => {
      console.log('updating editor manually');
      setValueSpy.mockClear();
      component.editor['editor'].setValue('value');
    });

    it('should update the model', () => {

      expect(component.testControl.value).toEqual('value');

    });

    it('should not update again the editor', () => {
      expect(setValueSpy).toHaveBeenCalledTimes(1);
    });

    it('should set errors when value is invalid', () => {

      // error could be anything we only care that the array
      // is not empty
      getModelMarkersSpy.mockReturnValue([ 'error' ]);

      component.editor['editor'].setValue('invalid value');
      expect(component.editor.control.errors).toEqual({
        monaco: true
      })
    });
  });

});
