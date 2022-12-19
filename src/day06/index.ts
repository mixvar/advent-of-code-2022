import run from "aocrunner";

const findFirstMarkerIndex = (input: string, markerLength: number) => {
  let markerBuffer = [] as string[];
  for (let i = 0; i < input.length; i++) {
    markerBuffer.push(input[i]);
    if (markerBuffer.length > markerLength) {
      markerBuffer.shift();
    }
    if (
      markerBuffer.length === markerLength &&
      new Set(markerBuffer).size === markerLength
    ) {
      return i + 1;
    }
  }

  throw new Error("marker not found!");
};

const part1 = (rawInput: string) => findFirstMarkerIndex(rawInput, 4);

const part2 = (rawInput: string) => findFirstMarkerIndex(rawInput, 14);

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 6,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 10,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 23,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 29,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
