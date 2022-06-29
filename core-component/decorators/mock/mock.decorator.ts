export function Mock(value?: any): MethodDecorator {

  return (target, key, descriptor) => {

    if (typeof value === 'function') {
      descriptor.value = value;
    } else {

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      descriptor.value = () => {
        return value;
      }
    }

  }
}
