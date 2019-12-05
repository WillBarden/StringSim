"use strict";
var editDistance = function (a, b) {
    if (Math.min(a.length, b.length) === 0) {
        if (Math.max(a.length, b.length) === 0) {
            // Empty strings are equivalent
            return 0.0;
        }
        else {
            // An empty string is completely different than a non-empty string
            return 1.0;
        }
    }
    var matrix = [];
    // Increment along the first column of each row
    for (var i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    // Increment each column in the first row
    for (var j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (var i = 1; i <= b.length; i++) {
        for (var j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // Substitution
                matrix[i][j - 1] + 1, // Insertion
                matrix[i - 1][j] + 1 // Deletion
                );
            }
        }
    }
    /**
     * Normalize so that 1.0 means the strings are entirely different and
     * 0.0 means they are exactly the same.
     */
    var editsNeeded = matrix[b.length][a.length];
    return editsNeeded / Math.max(a.length, b.length);
};
function substringDistance(string1, string2) {
    var longestCommonSubstring = 0;
    var table = Array(string1.length + 1).fill(Array(string2.length + 1).fill(0));
    for (var i = 0; i < string1.length; i++) {
        for (var j = 0; j < string2.length; j++) {
            if (string1[i] === string2[j]) {
                var substringLength = table[i][j] + 1;
                table[i + 1][j + 1] = substringLength;
                // Update the result if it is a new maximum
                if (substringLength > longestCommonSubstring) {
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
    var amountShared = longestCommonSubstring / Math.max(string1.length, string2.length);
    return 1.0 - amountShared;
}
var mean = function (numbers) { return numbers.reduce(function (sum, val) { return sum + val; }) / numbers.length; };
var similarity = function (a, b) { return mean([editDistance, substringDistance].map(function (distFunc) { return distFunc(a, b); })); };
var collectionSimilarity = function (targetValues, value) { return mean(targetValues.map(function (targetValue) { return similarity(targetValue, value); })); };
var mostSimilar = function (targetValues, collection) {
    if (!Array.isArray(targetValues)) {
        targetValues = [targetValues];
    }
    if (!Array.isArray(collection)) {
        collection = [collection];
    }
    // Get the value that minimizes the objective function
    var bestValue = null;
    var minDiff = 1.0;
    for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
        var item = collection_1[_i];
        var diff = collectionSimilarity(targetValues, item);
        if (diff < minDiff) {
            minDiff = diff;
            bestValue = item;
        }
    }
    return bestValue;
};
var leastSimilar = function (targetValues, collection) {
    if (!Array.isArray(targetValues)) {
        targetValues = [targetValues];
    }
    if (!Array.isArray(collection)) {
        collection = [collection];
    }
    // Get the value that minimizes the objective function
    var bestValue = null;
    var maxDiff = 0.0;
    for (var _i = 0, collection_2 = collection; _i < collection_2.length; _i++) {
        var item = collection_2[_i];
        var diff = collectionSimilarity(targetValues, item);
        if (diff > maxDiff) {
            maxDiff = diff;
            bestValue = item;
        }
    }
    return bestValue;
};
module.exports = {
    similarity: similarity, mostSimilar: mostSimilar, leastSimilar: leastSimilar
};
