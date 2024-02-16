import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import IMarker = editor.IMarker;
import { InjectionToken } from '@angular/core';

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
