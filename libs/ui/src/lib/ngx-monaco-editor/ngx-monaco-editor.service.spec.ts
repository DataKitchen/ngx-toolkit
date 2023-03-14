import { TestBed } from '@angular/core/testing';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';

describe('ngx-monaco-editor.service', () => {

  let service: NgxMonacoEditorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ NgxMonacoEditorService ],
    });

    service = TestBed.inject(NgxMonacoEditorService);

  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

});
