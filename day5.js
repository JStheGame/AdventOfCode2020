const responseText = `
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL
BBFFBBFRRL
`;

// convert the input to an array of strings
const passes = responseText.trim().split("\n");

// convert a boarding pass string to a seat ID number
// first convert to a binary string, then convert to an integer
const legend = { B: 1, F: 0, R: 1, L: 0 };
const processPass = (pass) =>
  parseInt(
    pass.replace(/./g, (char) => (char in legend ? legend[char] : "")),
    2
  );

// convert all the boarding pass strings into seat ID numbers
const seatIds = passes.map(processPass);

// part 1 answer
const maxId = Math.max(...seatIds);

// part 2 METHOD ONE
// sort the array and find the seatIds that are spaced out by exactly 2
// O(n * log(n)) time complexity
const sortedIds = [...seatIds].sort((a, b) => a - b);

const candidates1 = sortedIds.filter(
  (id, index) => sortedIds[index + 1] - id === 2
);

const missingId1 = candidates1[0] + 1;

// part 2 METHOD TWO
// make a set of all seat IDs for O(1) lookups
// find the id for which (id + 2) is in the set but (id + 1) isn't
// O(n) time complexity
const idSet = new Set(seatIds);

const candidates2 = seatIds.filter(
  (id) => idSet.has(id + 2) && !idSet.has(id + 1)
);

const missingId2 = candidates2[0] + 1;
