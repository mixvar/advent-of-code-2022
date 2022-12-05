import run from "aocrunner";
import * as Utils from "../utils/index.js";

enum Move {
  Rock,
  Paper,
  Scissors,
}
enum RoundOutcome {
  Win,
  Loss,
  Draw,
}

const OpponentMoveCodes: Record<string, Move> = {
  A: Move.Rock,
  B: Move.Paper,
  C: Move.Scissors,
};
const OwnMoveCodes: Record<string, Move> = {
  X: Move.Rock,
  Y: Move.Paper,
  Z: Move.Scissors,
};
const OutcomeCodes: Record<string, RoundOutcome> = {
  X: RoundOutcome.Loss,
  Y: RoundOutcome.Draw,
  Z: RoundOutcome.Win,
};

const OutcomeToScore: Record<Move, number> = {
  [RoundOutcome.Win]: 6,
  [RoundOutcome.Draw]: 3,
  [RoundOutcome.Loss]: 0,
};
const ShapeToScore: Record<Move, number> = {
  [Move.Rock]: 1,
  [Move.Paper]: 2,
  [Move.Scissors]: 3,
};

type OwnMove = Move;
type OpponentMove = Move;

const MOVES_TO_OUTCOME_MATRIX: Record<
  OwnMove,
  Record<OpponentMove, RoundOutcome>
> = {
  [Move.Rock]: {
    [Move.Rock]: RoundOutcome.Draw,
    [Move.Paper]: RoundOutcome.Loss,
    [Move.Scissors]: RoundOutcome.Win,
  },
  [Move.Paper]: {
    [Move.Rock]: RoundOutcome.Win,
    [Move.Paper]: RoundOutcome.Draw,
    [Move.Scissors]: RoundOutcome.Loss,
  },
  [Move.Scissors]: {
    [Move.Rock]: RoundOutcome.Loss,
    [Move.Paper]: RoundOutcome.Win,
    [Move.Scissors]: RoundOutcome.Draw,
  },
};

const OWN_MOVE_FITTING_MATRIX: Record<
  OpponentMove,
  Record<RoundOutcome, OwnMove>
> = {
  [Move.Rock]: {
    [RoundOutcome.Win]: Move.Paper,
    [RoundOutcome.Draw]: Move.Rock,
    [RoundOutcome.Loss]: Move.Scissors,
  },
  [Move.Paper]: {
    [RoundOutcome.Win]: Move.Scissors,
    [RoundOutcome.Draw]: Move.Paper,
    [RoundOutcome.Loss]: Move.Rock,
  },
  [Move.Scissors]: {
    [RoundOutcome.Win]: Move.Rock,
    [RoundOutcome.Draw]: Move.Scissors,
    [RoundOutcome.Loss]: Move.Paper,
  },
};

type GameRoundAsMoves = {
  opponentMove: Move;
  ownMove: Move;
};
type GameRoundAsMoveOutcome = {
  opponentMove: Move;
  outcome: RoundOutcome;
};

const parseInput1 = (rawInput: string): GameRoundAsMoves[] => {
  const parseRound = (rawRound: string): GameRoundAsMoves => {
    const [opponentCode, ownCode] = rawRound.split(" ");
    const opponentMove = OpponentMoveCodes[opponentCode];
    const ownMove = OwnMoveCodes[ownCode];

    if (opponentMove == null || ownMove == null) {
      throw new Error(`unexpected round input: ${rawRound}`);
    }

    return { opponentMove, ownMove };
  };

  return rawInput.split("\n").map(parseRound);
};

const parseInput2 = (rawInput: string): GameRoundAsMoveOutcome[] => {
  const parseRound = (rawRound: string): GameRoundAsMoveOutcome => {
    const [opponentCode, outcomeCode] = rawRound.split(" ");
    const opponentMove = OpponentMoveCodes[opponentCode];
    const outcome = OutcomeCodes[outcomeCode];

    if (opponentMove == null || outcome == null) {
      throw new Error(`unexpected round input: ${rawRound}`);
    }

    return { opponentMove, outcome };
  };

  return rawInput.split("\n").map(parseRound);
};

const getRoundOutcome = (round: GameRoundAsMoves): RoundOutcome =>
  MOVES_TO_OUTCOME_MATRIX[round.ownMove][round.opponentMove];

const getOutcomeBasedRoundScore = (round: GameRoundAsMoves): number => {
  const outcome = getRoundOutcome(round);
  return OutcomeToScore[outcome];
};

const getShapeBasedRoundScore = (round: GameRoundAsMoves): number =>
  ShapeToScore[round.ownMove];

const findOwnMove = (round: GameRoundAsMoveOutcome): Move =>
  OWN_MOVE_FITTING_MATRIX[round.opponentMove][round.outcome];

const part1 = (rawInput: string) => {
  const rounds = parseInput1(rawInput);
  const roundScores = rounds.map(
    (it) => getOutcomeBasedRoundScore(it) + getShapeBasedRoundScore(it),
  );

  return Utils.Arr.sum(roundScores);
};

const part2 = (rawInput: string) => {
  const rounds = parseInput2(rawInput);

  const roundScores = rounds
    .map(
      (it): GameRoundAsMoves => ({
        opponentMove: it.opponentMove,
        ownMove: findOwnMove(it),
      }),
    )
    .map((it) => getOutcomeBasedRoundScore(it) + getShapeBasedRoundScore(it));

  return Utils.Arr.sum(roundScores);
};

run({
  part1: {
    tests: [
      {
        input: `
          A Y
          B X
          C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          A Y
          B X
          C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
