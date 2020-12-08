const responseText = `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
`;

// convert the input to an array of strings
// we can treat this the same way as a 2-dimensional matrix (eg: field[row][col])
const field = responseText.trim().split("\n");

// we'll be using this for the modulus later, since the field repeats
const width = field[0].length;

// these are the directions supplied in part 2
// note that it's in the order [rowChange, colChange]
const directions = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],
  [2, 1],
];

// this is a function that returns a function
// sometimes this is referred to as a higher-order function
const generateTraverser = (dRow, dCol) => {
  // this is a function to find the number of trees on the field
  const traverser = (row = 0, col = 0) =>
    row < field.length
      ? traverser(row + dRow, (col + dCol) % width) +
        (field[row][col] === "#" ? 1 : 0)
      : 0;

  // note that we are returning the function itself,
  // not just the result of invoking the function
  return traverser;
};

// generateTraverser(dRow, dCol) returns a function which we are invoking immediately
const treeCounts = directions.map(([dRow, dCol]) =>
  generateTraverser(dRow, dCol)()
);

// multiply the results as per the challenge description
const finalProduct = treeCounts.reduce((product, num) => product * num, 1);
