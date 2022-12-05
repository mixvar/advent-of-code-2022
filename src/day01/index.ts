import run from "aocrunner";
import * as Utils from "../utils/index.js";

type Calories = number;
type ParsedInput = Calories[][];

const parseInput = (rawInput: string): ParsedInput =>
  rawInput
    .split("\n\n")
    .map((calorieSet) =>
      calorieSet.split("\n").map((val) => Number.parseFloat(val)),
    );

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const totals = input.map((calorieSet) => Utils.Arr.sum(calorieSet));
  const maximum = Utils.Arr.max(totals);

  return maximum;
};

const part2 = (rawInput: string) => {
  const CARRIER_COUNT = 3;

  const input = parseInput(rawInput);
  const totals = input.map((calorieSet) => Utils.Arr.sum(calorieSet));

  const topCalorieCounts = totals
    .sort((a, b) => a - b)
    .slice(-1 * CARRIER_COUNT);
  const totalTopCalorieCount = Utils.Arr.sum(topCalorieCounts);

  return totalTopCalorieCount;
};

run({
  part1: {
    tests: [
      {
        input: `
          1000
          2000
          3000
          
          4000
          
          5000
          6000
          
          7000
          8000
          9000
          
          10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          1000
          2000
          3000
          
          4000
          
          5000
          6000
          
          7000
          8000
          9000
          
          10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
