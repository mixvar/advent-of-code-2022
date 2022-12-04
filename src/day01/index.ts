import run from "aocrunner";

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
  const totals = input.map((calorieSet) =>
    calorieSet.reduce((sum, it) => sum + it, 0),
  );
  const maximum = totals.reduce((max, it) => (it > max ? it : max), 0);

  return maximum;
};

const part2 = (rawInput: string) => {
  const CARRIER_COUNT = 3;

  const input = parseInput(rawInput);
  const totals = input.map((calorieSet) =>
    calorieSet.reduce((sum, it) => sum + it, 0),
  );

  const topCalorieCounts = totals
    .sort((a, b) => a - b)
    .slice(-1 * CARRIER_COUNT);
  const totalTopCalorieCount = topCalorieCounts.reduce(
    (sum, it) => sum + it,
    0,
  );

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
