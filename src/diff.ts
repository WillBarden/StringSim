import { mean } from 'lodash';

const editDistance = (string1: string, string2: string) => {
  if (Math.min(string1.length, string2.length) === 0) {
    if (Math.max(string1.length, string2.length) === 0) {
      // Empty strings are equivalent
      return 0.0;
    } else {
      // An empty string is completely different than a non-empty string
      return 1.0;
    }
  }

  let table = [];
  // Increment along the first column of each row
  for (let i = 0; i <= string2.length; i++) {
    table[i] = [i];
  }
  // Increment each column in the first row
  for (let j = 0; j <= string1.length; j++) {
    table[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= string2.length; i++) {
    for (let j = 1; j <= string1.length; j++) {
      if (string2.charAt(i - 1) == string1.charAt(j - 1)) {
        table[i][j] = table[i - 1][j - 1];
      } else {
        table[i][j] = Math.min(
          table[i - 1][j - 1] + 1, // Substitution
          table[i][j - 1] + 1,     // Insertion
          table[i - 1][j] + 1      // Deletion
        );
      }
    }
  }

  /**
   * Normalize so that 1.0 means the strings are entirely different and
   * 0.0 means they are exactly the same.
   */
  const editsNeeded = table[string2.length][string1.length];
  return editsNeeded / Math.max(string1.length, string2.length);
};

function substringDistance(string1: string, string2: string){
  let longestCommonSubstring = 0;
  let table = Array(string1.length + 1).fill(Array(string2.length + 1).fill(0));

  for(let i = 0; i < string1.length; i++) {
    for(let j = 0; j < string2.length; j++) {
      if(string1[i] === string2[j]) {
        const substringLength = table[i][j] + 1;
        table[i + 1][j + 1] = substringLength;
        // Update the result if it is a new maximum
        if(substringLength > longestCommonSubstring) {
          longestCommonSubstring = substringLength;
        }
      }
    }
  }

  /**
   * Normalize so that 1 means one string contains the other and
   * that 0 means they share nothing in common. Then, subtract from 1
   * so that 0 reflects no difference and 1 reflects max distance.
   */
  const amountShared = longestCommonSubstring / Math.max(string1.length, string2.length);
  return 1.0 - amountShared;
}

export const similarity = (string1: string, string2: string) => mean(
  [editDistance, substringDistance].map(
    distFunc => distFunc(string1, string2)
  )
);

const collectionSimilarity = (targetValues: string[], value: string) => mean(
  targetValues.map(targetValue => similarity(targetValue, value))
);

export const mostSimilar = (targetValues: string | string[], collection: string | string[]): string | null => {
  if (!Array.isArray(targetValues)) {
    targetValues = [targetValues];
  }
  if (!Array.isArray(collection)) {
    collection = [collection];
  }

  // Get the value that minimizes the objective function
  let bestValue = null;
  let minDiff = 1.0;
  for (let item of collection) {
    const diff = collectionSimilarity(targetValues, item);
    if (diff < minDiff) {
      minDiff = diff;
      bestValue = item;
    }
  }
  return bestValue;
};

export const leastSimilar = (targetValues: string | string[], collection: string | string[]): string | null => {
  if (!Array.isArray(targetValues)) {
    targetValues = [targetValues];
  }
  if (!Array.isArray(collection)) {
    collection = [collection];
  }

  // Get the value that minimizes the objective function
  let bestValue = null;
  let maxDiff = 0.0;
  for (let item of collection) {
    const diff = collectionSimilarity(targetValues, item);
    if (diff > maxDiff) {
      maxDiff = diff;
      bestValue = item;
    }
  }
  return bestValue;
};
