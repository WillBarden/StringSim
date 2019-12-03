const editDistance = (a, b) => {
  if (Math.min(a.length, b.length) === 0) {
    if (Math.max(a.length, b.length) === 0) {
      // Empty strings are equivalent
      return 0.0;
    } else {
      // An empty string is completely different than a non-empty string
      return 1.0;
    }
  }

  let matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) == a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1,   // Substitution
          matrix[i][j-1] + 1,     // Insertion
          matrix[i-1][j] + 1      // Deletion
        );
      }
    }
  }

  /**
   * Normalize so that 1.0 means the strings are entirely different and
   * 0.0 means they are exactly the same.
   */
  const editsNeeded = matrix[b.length][a.length];
  return editsNeeded / Math.max(a.length, b.length);
};


const substringDistance = (a, b) => {
  let lcs = [];
  for (let i = 0; i < a.length; i++) {
    lcs.push([]);
    for (let j = 0; j < b.length; j++) {
      lcs[i].push(1);
    }
  }

  for (let i = 1; i < a.length; i++) {
    for (let j = 1; j < b.length; j++) {
      if (a.charAt(i - 1) === b.charAt(j - 1)) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = 0;
      }
    }
  }

  let result = -1;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (lcs[i][j] > result) {
        result = lcs[i][j];
      }    
    }
  }

  /**
   * Normalize so that 1 means one string contains the other and
   * that 0 means they share nothing in common.
   */
  result = result / Math.max(a.length, b.length);

  /**
   * Because we want 1.0 to be the maximum difference, subtract the
   * result from 1.0 so that 0 reflects the most similarity.
   */
  return 1.0 - result;
};

const mean = numbers => numbers.reduce(
  (sum, val) => sum + val
) / numbers.length;


const similarity = (a, b) => mean(
  [editDistance, substringDistance].map(
    distFunc => distFunc(a, b)
  )
);

const collectionSimilarity = (targetValues, value) => mean(
  targetValues.map(targetValue => similarity(targetValue, value))
);

const mostSimilar = (targetValues, collection) => {
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

const leastSimilar = (targetValues, collection) => {
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

module.exports = {
  similarity, mostSimilar, leastSimilar
}

