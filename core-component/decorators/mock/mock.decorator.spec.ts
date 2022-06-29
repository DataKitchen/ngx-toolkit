import { Mock } from './mock.decorator';


describe('@Mock', () => {

  const mockedData = [ 'xyz' ];


  class TestClass {

    spy = jest.fn();

    @Mock(mockedData)
    method() {
      console.log('running original function')
      this.spy();
      return [ 'abc' ];
    }

    @Mock((request: string) => {

      return [ '0', request ];
    })
    methodB(request: string) {
      return [ request ];
    }

  }


  let instance: TestClass;

  beforeEach(() => {
    instance = new TestClass();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should mock a method', () => {
    instance.method();
    expect(instance.spy).not.toHaveBeenCalled();
  });

  it('should return mocked data', () => {
    const actual = instance.method();
    expect(actual).toEqual(mockedData);
  });

  it('should call mock function instead', () => {
    const actual = instance.methodB('hello');

    expect(actual).toEqual([ '0', 'hello' ]);
  });

});
