"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var editDistance = function (string1, string2) {
    if (Math.min(string1.length, string2.length) === 0) {
        if (Math.max(string1.length, string2.length) === 0) {
            // Empty strings are equivalent
            return 0.0;
        }
        else {
            // An empty string is completely different than a non-empty string
            return 1.0;
        }
    }
    var table = [];
    // Increment along the first column of each row
    for (var i = 0; i <= string2.length; i++) {
        table[i] = [i];
    }
    // Increment each column in the first row
    for (var j = 0; j <= string1.length; j++) {
        table[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (var i = 1; i <= string2.length; i++) {
        for (var j = 1; j <= string1.length; j++) {
            if (string2.charAt(i - 1) == string1.charAt(j - 1)) {
                table[i][j] = table[i - 1][j - 1];
            }
            else {
                table[i][j] = Math.min(table[i - 1][j - 1] + 1, // Substitution
                table[i][j - 1] + 1, // Insertion
                table[i - 1][j] + 1 // Deletion
                );
            }
        }
    }
    /**
     * Normalize so that 1.0 means the strings are entirely different and
     * 0.0 means they are exactly the same.
     */
    var editsNeeded = table[string2.length][string1.length];
    return editsNeeded / Math.max(string1.length, string2.length);
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
exports.similarity = function (string1, string2) { return lodash_1.mean([editDistance, substringDistance].map(function (distFunc) { return distFunc(string1, string2); })); };
var collectionSimilarity = function (targetValues, value) { return lodash_1.mean(targetValues.map(function (targetValue) { return exports.similarity(targetValue, value); })); };
exports.mostSimilar = function (targetValues, collection) {
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
exports.leastSimilar = function (targetValues, collection) {
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
