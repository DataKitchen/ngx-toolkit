# Datakitchen's ngx-toolkit :rocket:

## Install
`npm i -S @datakitchen/ngx-toolkit`

This library contains an abstract class which need to be `extended` in other to leverage most of functionalities implemented in this library.

```typescript
import { CoreComponent } from '@datakitchen/ngx-toolkit';

@Component({
  selector: 'comp',
  template: '<h1>my component</h1>'
})
class TestClassComponent extends CoreComponent {

  private subject$ = new Subject();

  override ngOnInit() {
    // Extend CoreComponent to leverage automatic unsubscriptions
    this.subscriptions.push(this.subject$.subscribe());

    super.ngOnInit();
  }
}
```
