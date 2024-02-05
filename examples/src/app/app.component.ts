import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  styles: [`
    :host {
      --ngx-monaco-editor-min-height: 120px;
    }
  `],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'monaco-editor-example';

  formControl = new FormControl<string>('');
}
