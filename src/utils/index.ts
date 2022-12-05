export namespace Arr {
  export const sum = (it: readonly number[]) =>
    it.reduce((acc, el) => acc + el, 0);
}
