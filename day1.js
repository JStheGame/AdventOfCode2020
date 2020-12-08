const responseText = `
1721
979
366
299
675
1456
`;

// O(n * log(n))
// convert the input to a sorted array of numbers
const nums = responseText
  .trim()
  .split("\n")
  .map(Number)
  .sort((a, b) => a - b);

// O(n)
// two pointers strategy to find a pair of elements that sum to target value
const findTarget = (target, l = 0, r = nums.length - 1) => {
  const num1 = nums[l];
  const num2 = nums[r];
  const sum = num1 + num2;

  return l >= r
    ? -1
    : sum === target
    ? num1 * num2
    : sum < target
    ? findTarget(target, l + 1, r)
    : findTarget(target, l, r - 1);
};

// O(n ** 2)
// filter out all the possible candidates for a trio of elements that sums to 2020
const goodNums = nums.filter((num) => {
  // assuming num is one of the numbers, the other two should sum to 2020 - num
  const product = findTarget(2020 - num);
  return product > -1;
});

// multiply the three numbers to get the required answer
const finalProduct = goodNums.reduce((product, num) => product * num, 1);
