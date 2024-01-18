import { Prop } from './deferred-props';

describe('deferred-prop', () => {

  class TestComponent {
    prop1 = 'hello';
    prop2 = 'world';
  }

  let instance: TestComponent;

  beforeEach(() => {
    instance = new TestComponent();
  });

  it('should get `prop1` value', () => {
    const actual = () => Prop('prop1').resolve(instance);
    expect(actual()).toEqual('hello');
  });

  it('should get `prop2` value', () => {
    const actual = () => Prop('prop2').resolve(instance);
    expect(actual()).toEqual('world');
  });

  it('should return the given key if not present', () => {
    const actual = () => Prop('prop3').resolve(instance);
    expect(actual()).toEqual('prop3');
  });

  it('should return combined properties', () => {
    const actual = () => Prop('prop1.prop2').resolve(instance);
    expect(actual()).toEqual('hello:world');
  });
});
