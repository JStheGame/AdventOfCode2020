const responseText = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`;

// split the input into an array of objects of the form { type, num }
// (for example { type: "acc", num: 3 })
const instructions = responseText
  .trim()
  .split("\n")
  .map((instruction) => {
    // the 0th element is the full match from the regexp, which we won't be using
    const [_, type, numString] = instruction.match(/(acc|jmp|nop) ([+-]\d+)/);

    // .match will always return strings, so it's important to convert this
    // otherwise we might end up with unexpected arithmetic results
    const num = parseInt(numString);

    // this shorthand is equivalent to { "type": type, "num": num }
    return { type, num };
  });

// this is a recursive depth-first search algorithm. it starts with the command at index,
// if it's a "jmp" or "nop" type, it will try both the actual instruction and the erroneous version
// the variable foundMistake prevents us from accidentally considering a case with multiple mistakes
const runCommand = (
  index = 0,
  accumulator = 0,
  visited = new Set(),
  foundMistake = false
) => {
  // in case index > instructions.length, we destructure an empty object
  // this will make both type and num undefined but that's ok because we won't use them in that case
  const { type, num } = instructions[index] || {};

  // make a new visited set based on the previous one.
  // this way it's more immutable, and we can also reference the previous visited set below
  const nextVisited = new Set([...visited, index]);

  return index === instructions.length
    ? accumulator // if we manage to reach the end, return the value of the accumulator
    : visited.has(index)
    ? -1 // if we hit an infinite loop, return -1
    : type === "acc"
    ? runCommand(index + 1, accumulator + num, nextVisited, foundMistake) // run "acc" command normally
    : type === "jmp"
    ? Math.max(
        // consider both possibilities for "jmp" command, set foundMistake to true if mistaken
        runCommand(index + num, accumulator, nextVisited, foundMistake),
        foundMistake
          ? -1 // don't consider the other possibility if we've already found the mistake
          : runCommand(index + 1, accumulator, nextVisited, true)
      )
    : Math.max(
        // consider both possibilities for "nop" command, set foundMistake to true if mistaken
        runCommand(index + 1, accumulator, nextVisited, foundMistake),
        foundMistake
          ? -1 // don't consider the other possibility if we've already found the mistake
          : runCommand(index + num, accumulator, nextVisited, true)
      );
};
