const responseText = `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
`;

// the input describes a directed acyclic graph (DAG)
// we can represent the graph in the form of an object of objects,
// where bagGraph[bag1][bag2] = n; means that bag1 contains n bag2s
const bagGraph = responseText
  .trim()
  .split("\n")
  .reduce((graph, rule) => {
    // 0th element is the full match, which we won't be using
    const [_, outerBag, innerBagList] = rule.match(/(.+) bags contain (.+)\./);
    const innerBags =
      innerBagList === "no other bags" // if no other bags, bagGraph[outerBag] = {}
        ? {}
        : innerBagList.split(",").reduce((children, innerBag) => {
            // for each innerBag, get the colour and quantity, and append it to innerBags
            const [_, numString, innerColour] = innerBag.match(
              /(\d+) (.+) bag/
            );

            // we create a object consisting of the previous contents of children, plus the new innerBag.
            // this produces the same result as doing children[innerColour] = parseInt(numString);
            // but this is more immutable since we're creating a new object instead of modifying an old one
            return { ...children, [innerColour]: parseInt(numString) };
          }, {});

    // similar to the children object above, we're making a new object at every step instead of modifying
    // the existing graph object. I believe it's considered more functional this way :)
    return { ...graph, [outerBag]: innerBags };
  }, {});

// find the transpose of bagGraph (unweighted)
// this means reversing all the edges in bagGraph
const bagTranspose = Object.entries(bagGraph).reduce(
  // for each outerBag
  (transpose, [outerBag, innerBags]) =>
    Object.keys(innerBags).reduce(
      // go through the list of innerBags
      (newGraph, innerBag) => ({
        ...newGraph,
        [innerBag]: [...(newGraph[innerBag] || []), outerBag], // if the array already exists, append to it
        // otherwise assign it as a new single-element array [outerBag]
      }), // since this is an object we're returning, we need these outer parentheses!
      { ...transpose } // newGraph starts as a copy of the current transpose object,
      // and is reassigned each step with innerBag's reversed edge to outerBag
    ),
  {} // transpose starts as an empty object,
  // and is reassigned each step with all of outerBag's reversed edges
);

// this function finds all the ancestors of bag and returns them as a set.
// it includes the initial bag that we called it with, so we'll need to subtract 1 after.
// this is a recursive depth-first search algorithm
const findAllParents = (bag) =>
  (bagTranspose[bag] || []).reduce(
    // create a new set with all the elements of the previous one, plus nextBag.
    // a set will ignore repeat elements so we don't need to worry about checking
    // whether we've already added this bag
    (visited, nextBag) => new Set([...visited, ...findAllParents(nextBag)]),
    new Set([bag])
  );

// we only need to know how many parents there are, so we return the size of the set.
// we subtract 1 because the returned set includes the initial parameter as a parent bag
const parentCount = findAllParents("shiny gold").size - 1;

// this function counts how many children bags in total fit inside bag.
// it includes the initial bag that we called it with, so we'll need to subtract 1 after.
// this is a recursive depth-first search algorithm
const countInnerBags = (bag) =>
  Object.entries(bagGraph[bag] || []).reduce(
    (count, [innerBag, quantity]) =>
      // for each child bag, add the quantity multiplied by its contents
      count + quantity * countInnerBags(innerBag),
    1 // the count starts at 1 to include the current bag
  );

// countInnerBags has already returned an integer, so we don't need to measure the size or length
// we subtract 1 because the returned set includes the initial parameter as a child bag
const childCount = countInnerBags("shiny gold") - 1;
