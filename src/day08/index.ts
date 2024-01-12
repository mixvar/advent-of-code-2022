import run from "aocrunner";

import * as Utils from "../utils/index.js";

type TreeHeight = number;
type TreeHeightGrid = { rows: TreeHeight[][]; cols: TreeHeight[][] };
type TreePosition = [x: number, y: number];

const parseInput = (rawInput: string): TreeHeightGrid => {
  const rows = rawInput
    .split("\n")
    .map((line) => [...line].map((char) => +char));

  const cols = rows.reduce((cols, row) => {
    row.forEach((h, x) => {
      if (cols[x] == null) {
        cols[x] = [];
      }

      cols[x].push(h);
    });

    return cols;
  }, [] as TreeHeight[][]);

  return { rows, cols };
};

const hasTreeTallerOrTheSameHeightAs = (
  row: TreeHeight[],
  referenceHeight: number,
): boolean => row.some((h) => h >= referenceHeight);

const getViewingDistance = (
  row: TreeHeight[],
  referenceHeight: number,
): number => {
  const i = row.findIndex((h) => h >= referenceHeight);
  return i === -1 ? row.length : i + 1;
};

const calculateScenicScore = (viewingDistances: number[]) =>
  viewingDistances.reduce((acc, dist) => acc * dist, 1);

const getTreeHeight = (
  grid: TreeHeightGrid,
  [x, y]: TreePosition,
): TreeHeight => grid.cols[x][y];

const getRelativeHeightsInAllDirections = (
  grid: TreeHeightGrid,
  [x, y]: TreePosition,
): TreeHeight[][] => {
  const gridRow = grid.rows[y];

  const left = gridRow.slice(0, x).reverse();
  const right = gridRow.slice(x + 1);

  const gridCol = grid.cols[x];

  const top = gridCol.slice(0, y).reverse();
  const bottom = gridCol.slice(y + 1);

  return [left, right, top, bottom];
};

const part1 = (rawInput: string) => {
  const treeGrid = parseInput(rawInput);
  // console.log(Utils.Debug.inspect({ grid: treeGrid.rows }));

  const positions = Utils.Arr.naturalNumbers(treeGrid.cols.length).flatMap(
    (x) =>
      Utils.Arr.naturalNumbers(treeGrid.rows.length).map(
        (y) => [x, y] as TreePosition,
      ),
  );

  const treeVisibilities = positions.map((position) => {
    const height = getTreeHeight(treeGrid, position);
    const dirs = getRelativeHeightsInAllDirections(treeGrid, position);
    const treeHidden = dirs.every((dir) =>
      hasTreeTallerOrTheSameHeightAs(dir, height),
    );

    return { visible: !treeHidden };
  });

  return treeVisibilities.filter((it) => it.visible).length;
};

const part2 = (rawInput: string) => {
  const treeGrid = parseInput(rawInput);
  // console.log(Utils.Debug.inspect({ grid: treeGrid.rows }));

  const positions = Utils.Arr.naturalNumbers(treeGrid.cols.length).flatMap(
    (x) =>
      Utils.Arr.naturalNumbers(treeGrid.rows.length).map(
        (y) => [x, y] as TreePosition,
      ),
  );

  const scenicScores = positions.map((position) => {
    const height = getTreeHeight(treeGrid, position);
    const dirs = getRelativeHeightsInAllDirections(treeGrid, position);
    const viewingDistances = dirs.map((dir) => getViewingDistance(dir, height));

    return calculateScenicScore(viewingDistances);
  });

  return Math.max(...scenicScores);
};

run({
  part1: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          30373
          25512
          65332
          33549
          35390
        `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
