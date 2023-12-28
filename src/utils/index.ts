import Util from "util";

export namespace Arr {
  export const min = (it: readonly number[]) =>
    it.reduce((min, it) => (it < min ? it : min), Infinity);

  export const max = (it: readonly number[]) =>
    it.reduce((max, it) => (it > max ? it : max), -Infinity);

  export const sum = (it: readonly number[]) =>
    it.reduce((acc, el) => acc + el, 0);

  export const naturalNumbers = (count: number, offset = 0) =>
    [...Array(count).keys()].map((_, i) => i + offset);

  export const dropLast = <T>(it: readonly T[]): T[] => it.slice(0, -1);

  export const splitIntoChunksByLength = <T>(
    it: readonly T[],
    chunkLength: number,
  ): T[][] =>
    it.reduce((acc, item) => {
      const lastChunk = acc.pop();

      if (!lastChunk) {
        const firstChunk = [item];
        acc.push(firstChunk);
      } else if (lastChunk.length < chunkLength) {
        lastChunk.push(item);
        acc.push(lastChunk);
      } else {
        const nextChunk = [item];
        acc.push(lastChunk);
        acc.push(nextChunk);
      }

      return acc;
    }, [] as T[][]);
}

export namespace Predicate {
  export const notNullable = <T>(it: T): it is NonNullable<T> => it != null;
}

export namespace Debug {
  export const inspect = (value: unknown) =>
    Util.inspect(value, { depth: Infinity, colors: true });
}
