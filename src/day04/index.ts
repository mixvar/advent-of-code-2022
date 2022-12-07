import run from "aocrunner";

import * as Utils from "../utils/index.js";

type Assignment = [from: number, to: number];
type Pair = [Assignment, Assignment];

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((rawPair) =>
      rawPair
        .split(",")
        .map((rawAssignment) =>
          rawAssignment.split("-").map((num) => Number(num)),
        ),
    ) as Pair[];

const areAssignmentsFullyOverlapping = (a1: Assignment, a2: Assignment) =>
  (a1[0] <= a2[0] && a1[1] >= a2[1]) || (a1[0] >= a2[0] && a1[1] <= a2[1]);

const areAssignmentsPartiallyOverlapping = (a1: Assignment, a2: Assignment) =>
  (a1[0] <= a2[0] && a1[1] >= a2[0]) ||
  (a1[0] <= a2[1] && a1[1] >= a2[1]) ||
  areAssignmentsFullyOverlapping(a1, a2);

const part1 = (rawInput: string) => {
  const pairs = parseInput(rawInput);
  const overlappingPairs = pairs.filter(([a1, a2]) =>
    areAssignmentsFullyOverlapping(a1, a2),
  );

  return overlappingPairs.length;
};

const part2 = (rawInput: string) => {
  const pairs = parseInput(rawInput);
  const overlappingPairs = pairs.filter(([a1, a2]) =>
    areAssignmentsPartiallyOverlapping(a1, a2),
  );

  return overlappingPairs.length;
};

run({
  part1: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          2-4,6-8
          2-3,4-5
          5-7,7-9
          2-8,3-7
          6-6,4-6
          2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
