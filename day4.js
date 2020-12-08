const responseText = `
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
`;

// split the input into an array of entries (multi-line strings)
const inputList = responseText.trim().split("\n\n");

// replace newlines with spaces, then split into arrays
// convert the resulting array into an object
const entryObjects = inputList.map((entry) =>
  entry
    .replace(/\n/g, " ")
    .split(" ")
    .map((keyValuePair) => keyValuePair.split(":"))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
);

// since we need to do this more than once, it's worth writing a function for it!
const checkInRange = (numString, min, max) => {
  const num = parseInt(numString);
  return min <= num && num <= max;
};

// check if all the required fields are there
const requiredKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const completenessCheck = (obj) => requiredKeys.every((key) => key in obj);

// check if the values are valid (according to the specifications in the description)
const validityCheck = ({ byr, iyr, eyr, hgt, hcl, ecl, pid }) => {
  const byrCheck = checkInRange(byr, 1920, 2002);
  const iyrCheck = checkInRange(iyr, 2010, 2020);
  const eyrCheck = checkInRange(eyr, 2010, 2030);
  const hgtCheck = /^(?:(?:(?:59|6[0-9]|7[0-6])in)|(?:(?:1[5-8][0-9]|19[0-3])cm))$/.test(
    hgt
  );
  const hclCheck = /^#[0-9a-f]{6}$/.test(hcl);
  const eclCheck = /^(?:amb|blu|brn|gry|grn|hzl|oth)$/.test(ecl);
  const pidCheck = /^\d{9}$/.test(pid);

  // keeping all of these results in an object like this could be really useful for debugging
  const results = {
    byrCheck,
    iyrCheck,
    eyrCheck,
    hgtCheck,
    hclCheck,
    eclCheck,
    pidCheck,
  };

  // return true only if every check passed
  return Object.values(results).every((bool) => bool);
};

// the filter gives us an array of all the valid passports.
// the validityCheck will only be attempted if completenessCheck returns true.
// since we only need to know how many of the passports are valid, we can do .length
const validPassportsCount = entryObjects.filter(
  (entry) => completenessCheck(entry) && validityCheck(entry)
).length;
