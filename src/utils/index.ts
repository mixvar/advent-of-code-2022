export namespace Arr {
  export const max = (it: readonly number[]) =>
    it.reduce((max, it) => (it > max ? it : max), 0);

  export const sum = (it: readonly number[]) =>
    it.reduce((acc, el) => acc + el, 0);
}
