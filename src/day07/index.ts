import run from "aocrunner";

import * as Utils from "../utils/index.js";

const COMMAND_START_MARKER = "$";
const ROOT_DIR = "/";
const PATH_SEPARATOR = "/";
const GO_UP_PATH = "..";

type Command =
  | { is: "ChangeDir"; path: string }
  | { is: "List"; output: LsEntry[] };

type LsEntry =
  | { is: "file"; name: string; size: number }
  | { is: "directory"; name: string };

const parseCommands = (rawInput: string): Command[] =>
  rawInput
    .split(`\n`)
    .filter((line) => line.trim().length > 0)
    .reduce((commands, line) => {
      const lineParts = line.split(/\s/);

      const parseCommand = (): Command => {
        const commandName = lineParts[1];
        switch (commandName) {
          case "cd":
            return { is: "ChangeDir", path: lineParts[2] };
          case "ls":
            return { is: "List", output: [] };
          default:
            throw new Error(`unknown command ${commandName}`);
        }
      };
      const parseLsEntry = (): LsEntry => {
        if (lineParts[0] === "dir") {
          return { is: "directory", name: lineParts[1] };
        } else {
          return { is: "file", size: +lineParts[0], name: lineParts[1] };
        }
      };

      if (lineParts[0] === COMMAND_START_MARKER) {
        commands.unshift(parseCommand());
      } else {
        const [currentCommand] = commands;
        switch (currentCommand.is) {
          case "List": {
            currentCommand.output.push(parseLsEntry());
            break;
          }
          default:
            throw new Error(
              `Unexpected output '${line}' for ${currentCommand.is} command!`,
            );
        }
      }

      return commands;
    }, [] as Command[])
    .reverse();

type FsTree = Record<Path, FsNode>;

type Path = string;

namespace Path {
  export const build = (fragments: string[]): Path =>
    fragments.length > 1
      ? fragments.map((it) => (it === ROOT_DIR ? "" : it)).join(PATH_SEPARATOR)
      : fragments[0];

  export const parse = (path: Path): string[] =>
    path.split(PATH_SEPARATOR).map((it) => (it === "" ? ROOT_DIR : it));
}

type FsNode = FileNode | DirNode;

type FileNode = {
  type: "file";
  name: string;
  size: number;
};

type DirNode = {
  type: "dir";
  name: string;
};

const buildFsTree = (commands: Command[]): FsTree => {
  const fsTree: FsTree = {
    [ROOT_DIR]: { type: "dir", name: ROOT_DIR },
  };

  let currentPath: string[] = [];

  commands.forEach((cmd) => {
    switch (cmd.is) {
      case "ChangeDir":
        if (cmd.path === GO_UP_PATH) {
          currentPath = Utils.Arr.dropLast(currentPath);
        } else {
          currentPath = [...currentPath, cmd.path];
        }
        break;

      case "List":
        cmd.output.forEach((lsEntry) => {
          const fullPath = Path.build([...currentPath, lsEntry.name]);

          switch (lsEntry.is) {
            case "file":
              fsTree[fullPath] = {
                type: "file",
                name: lsEntry.name,
                size: lsEntry.size,
              };
              break;

            case "directory":
              fsTree[fullPath] = {
                type: "dir",
                name: lsEntry.name,
              };
              break;
          }
        });
        break;
    }
  });

  return fsTree;
};

const calculateDirSizes = (fsTree: FsTree): Record<Path, number> => {
  const dirSizes: Record<Path, number> = {};

  Object.entries(fsTree).forEach(([path, node]) => {
    if (node.type === "dir") {
      return;
    }

    const parentPaths = Utils.Arr.dropLast(Path.parse(path)).map(
      (_, i, fragments) => Path.build(fragments.slice(0, i + 1)),
    );

    parentPaths.forEach((parentPath) => {
      dirSizes[parentPath] = (dirSizes[parentPath] ?? 0) + node.size;
    });
  });

  return dirSizes;
};

const part1 = (rawInput: string) => {
  const commands = parseCommands(rawInput);
  const fsTree = buildFsTree(commands);
  const dirSizes = calculateDirSizes(fsTree);

  // console.log(Utils.Debug.inspect({ commands, fsTree, dirSizes }));

  return Utils.Arr.sum(
    Object.values(dirSizes).filter((size) => size <= 100000),
  );
};

const part2 = (rawInput: string) => {
  const commands = parseCommands(rawInput);
  const fsTree = buildFsTree(commands);
  const dirSizes = calculateDirSizes(fsTree);

  const TOTAL_SPACE = 70000000;
  const TARGET_UNUSED_SPACE = 30000000;
  const UNUSED_SPACE = TOTAL_SPACE - dirSizes[ROOT_DIR];
  const MISSING_SPACE = TARGET_UNUSED_SPACE - UNUSED_SPACE;

  return Utils.Arr.min(
    Object.values(dirSizes).filter((size) => size >= MISSING_SPACE),
  );
};

run({
  part1: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k
        `,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k
        `,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
