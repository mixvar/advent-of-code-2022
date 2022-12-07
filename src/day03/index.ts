import run from "aocrunner";

import * as Utils from "../utils/index.js";

type ItemCode = string;
type Rucksack = ItemCode[];
type FragmentedRucksack = [ItemCode[], ItemCode[]];
type RucksackGroup = Rucksack[];

const assignPriority = (item: ItemCode): number => {
  if (item.length > 1) {
    throw new Error(`expected char, received string "${item}"`);
  }

  if (item.match(/[a-z]/)) {
    return item.charCodeAt(0) - 96;
  }

  if (item.match(/[A-Z]/)) {
    return item.charCodeAt(0) - 38;
  }

  throw new Error(`expected char in range a-Z, received "${item}"`);
};

const part1 = (rawInput: string) => {
  const parseInput = (rawInput: string): FragmentedRucksack[] =>
    rawInput.split(`\n`).map((rucksack) => {
      const compartment1 = [...rucksack.slice(0, rucksack.length / 2)];
      const compartment2 = [...rucksack.slice(rucksack.length / 2)];
      return [compartment1, compartment2] as FragmentedRucksack;
    });

  const findRepeatingItem = (rucksack: FragmentedRucksack): ItemCode => {
    const [left, right] = rucksack;
    const leftSet = new Set(left);

    const repeatingItem = right.find((item) => leftSet.has(item));
    if (repeatingItem == null) {
      throw new Error(
        `expected rucksack to contain exactly 1 repeating item "${rucksack}"`,
      );
    }

    return repeatingItem;
  };

  const rucksacks = parseInput(rawInput);
  const priorities = rucksacks.map(findRepeatingItem).map(assignPriority);
  return Utils.Arr.sum(priorities);
};

const part2 = (rawInput: string) => {
  const parseInput = (rawInput: string): RucksackGroup[] => {
    const rucksacks = rawInput
      .split(`\n`)
      .map((rawRucksack) => [...rawRucksack]);
    return Utils.Arr.splitIntoChunksByLength(rucksacks, 3);
  };

  const findRepeatingItem = (rucksackGroup: RucksackGroup): ItemCode => {
    const [referenceRucksack, ...otherRucksacks] = rucksackGroup;
    const otherRucksacksAsSets = otherRucksacks.map((rs) => new Set(rs));
    const repeatingItem = referenceRucksack.find((item) =>
      otherRucksacksAsSets.every((otherRucksack) => otherRucksack.has(item)),
    );

    if (repeatingItem == null) {
      throw new Error(
        `expected rucksack group to contain exactly 1 repeating item "${rucksackGroup}"`,
      );
    }

    return repeatingItem;
  };

  const rucksackGroups = parseInput(rawInput);
  const priorities = rucksackGroups.map(findRepeatingItem).map(assignPriority);
  return Utils.Arr.sum(priorities);
};

run({
  part1: {
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          vJrwpWtwJgWrhcsFMMfFFhFp
          jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
          PmmdzqPrVvPwwTWBwg
          wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
          ttgJtRGJQctTZtZT
          CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
