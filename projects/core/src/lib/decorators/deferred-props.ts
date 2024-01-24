export interface DeferredProp {
  resolve: (object: unknown) => string;
}


/**
 * Resolves a property from the current class to be used as namespace.
 *
 * @param propertyPath A dot separated string with properties defined in the current class.
 * @return a colon `:` separated string of the value contained in the given property or the key itself if that property is not defined.
 *
 * @example

 * class MyComponent {
 *     kitchen = 'myKitchen';
 *
 *     // namespace will be `myNamespace:myKitchen`
 *     @PersistOnLocalStorage({ namespace: Prop('myNamespace.kitchen') })
 *     form = new FormGroup(....)
 *
 * }
 */
export function Prop(propertyPath: string): DeferredProp {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolve: (object: object): string => {
      return propertyPath.split('.').map((key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (object.hasOwnProperty(key)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return object[key] as string;
        } else {
          return key;
        }
      }).join(':');
    },
  };
}
