const responseText = `
abc

a
b
c

ab
ac

a
a
a
a

b
`;

// break up the groups - get an array of arrays of strings
const groups = responseText
  .trim()
  .split("\n\n")
  .map((group) => group.split("\n"));

// convert a char to a number (binary)
const charToBin = (char) => 1 << (char.charCodeAt() - 97);

// convert a "word" to a number (bitmask)
const wordToBin = (word) =>
  [...word].map(charToBin).reduce((result, bin) => result | bin, 0);

// find the number of set bits in an integer's binary representation
// (if you write the number in binary, how many 1's does it have?)
const countSetBits = (bin) => (bin ? countSetBits(bin & (bin - 1)) + 1 : 0);

// for part 1, do a bitwise | on all the bitmasks
const countGroupOr = (group) =>
  countSetBits(group.reduce((total, word) => total | wordToBin(word), 0));

const countSumOr = groups.map(countGroupOr).reduce((a, b) => a + b, 0);

// for part 2, do a bitwise & on all the bitmasks
const countGroupAnd = (group) =>
  countSetBits(
    group.reduce((total, word) => total & wordToBin(word), (1 << 27) - 1)
  );

const countSumAnd = groups.map(countGroupAnd).reduce((a, b) => a + b, 0);
