const responseText = `
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
`;

// convert to an array of strings
const list = responseText.trim().split("\n");

// use this regexp to capture index1, index2, the target character, and the password
const pattern = /(\d+)-(\d+) (\w): (\S+)/;

// part 1 answer
const howManyValid1 = list.filter((entry) => {
  // 0th element is the full match, which we won't be using
  const [_, min, max, targetChar, password] = entry.match(pattern);

  // this isn't the fastest way to count the target character instances, but it's
  // more semantic than many of the alternatives
  const instances = (password.match(new RegExp(targetChar, "g")) || []).length;

  // I like to write these statements in this format so that they look like the
  // traditional math way of writing the inequality (min <= instances <= max)
  return min <= instances && instances <= max;
}).length;

// part 2 answer
const howManyValid2 = list.filter((entry) => {
  // 0th element is the full match, which we won't be using
  const [_, index1, index2, targetChar, password] = entry.match(pattern);

  // using the !== operator keeps these booleans, whereas ^ would typecast to number
  return (
    (password[index1 - 1] === targetChar) !==
    (password[index2 - 1] === targetChar)
  );
}).length;
