import { TestBed } from '@angular/core/testing';
import { NgxMonacoEditorService } from './ngx-monaco-editor.service';
import { NGX_MONACO_EDITOR_CONFIG2 } from './ngx-monaco-editor.module';

describe('ngx-monaco-editor.service', () => {

  let service: NgxMonacoEditorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        NgxMonacoEditorService,
        {
          provide: NGX_MONACO_EDITOR_CONFIG2,
          useValue: {},
        }
      ],
    });

    service = TestBed.inject(NgxMonacoEditorService);

  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

});
