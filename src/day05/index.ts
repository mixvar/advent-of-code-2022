import run from "aocrunner";
import * as Utils from "../utils/index.js";

type Input = {
  stacks: Partial<Record<StackId, Stack>>;
  instructions: Instruction[];
};

type StackId = number;
type StackItem = string;
type Stack = StackItem[];

type Instruction = {
  kind: "move";
  from: StackId;
  to: StackId;
  amount: number;
};

type SimOptions = {
  moveBehaviour: "single" | "multiple";
};

const parseInput = (rawInput: string): Input => {
  const rows = rawInput.split("\n");
  const stackLabelsRowIndex = rows.findIndex((row) => row.match(/\d/) != null);

  const stackLabelsRow = rows[stackLabelsRowIndex];
  const stackRows = rows.slice(0, stackLabelsRowIndex);
  const instructionRows = rows.slice(stackLabelsRowIndex + 2);

  return {
    stacks: parseStacks(stackLabelsRow, stackRows),
    instructions: parseInstructions(instructionRows),
  };
};

const parseStacks = (
  stackLabelsRow: string,
  stackRows: string[],
): Input["stacks"] => {
  const parseStack = (id: StackId): Stack =>
    stackRows
      .reduceRight((stack, row) => [...stack, row[id * 4 - 3]], [] as Stack)
      .filter((item) => item?.trim().length > 0);

  const maxStackIndex = Number.parseInt(
    stackLabelsRow.trim().split(/\s/).pop() ?? "",
    10,
  );
  return Utils.Arr.naturalNumbers(maxStackIndex, 1).reduce(
    (acc, id) => ({ ...acc, [id]: parseStack(id) }),
    {} as Input["stacks"],
  );
};

const parseInstructions = (instructionRows: string[]): Instruction[] => {
  const parseInstruction = (row: string): Instruction | null => {
    const words = row.split(/\s/);

    switch (words[0]) {
      case "move": {
        return {
          kind: "move",
          amount: Number(words[1]),
          from: Number(words[3]),
          to: Number(words[5]),
        };
      }

      default:
        return null;
    }
  };

  return instructionRows
    .map(parseInstruction)
    .filter(Utils.Predicate.notNullable);
};

const runSimulation = (
  { stacks, instructions }: Input,
  opts: SimOptions,
): Input["stacks"] =>
  instructions.reduce((acc, ins) => runInstruction(acc, ins, opts), stacks);

const runInstruction = (
  stacks: Input["stacks"],
  instruction: Instruction,
  opts: SimOptions,
): Input["stacks"] => {
  switch (instruction.kind) {
    case "move": {
      const stackFrom = stacks[instruction.from] ?? [];
      const stackTo = stacks[instruction.to] ?? [];

      const remainingItems = stackFrom.slice(
        0,
        stackFrom.length - instruction.amount,
      );
      const movedItems = stackFrom.slice(-instruction.amount);
      if (opts.moveBehaviour === "single") {
        movedItems.reverse();
      }

      return {
        ...stacks,
        [instruction.from]: remainingItems,
        [instruction.to]: [...stackTo, ...movedItems],
      };
    }
  }
};

const readTopStackItems = (stacks: Input["stacks"]): string =>
  Object.values(stacks)
    .filter(Utils.Predicate.notNullable)
    .map((stack) => stack[stack.length - 1] ?? " ")
    .join("");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = runSimulation(input, { moveBehaviour: "single" });
  const topItems = readTopStackItems(result);

  return topItems;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = runSimulation(input, { moveBehaviour: "multiple" });
  const topItems = readTopStackItems(result);

  return topItems;
};

run({
  part1: {
    tests: [
      {
        input: `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  // onlyTests: true,
});
