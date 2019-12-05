"use strict";
var _ = require('lodash');
var substringDistance = function (a, b) {
    var lcs = [];
    for (var i = 0; i < a.length; i++) {
        lcs.push([]);
        for (var j = 0; j < b.length; j++) {
            lcs[i].push(0);
        }
    }
    // for (let i = 0; i < a.length; i++) {
    //   if (a.charAt(i) === b.charAt(0)) {
    //     lcs[i][0] = 1;
    //   }
    // }
    // for (let j = 0; j < b.length; j++) {
    //   if (b.charAt(j) === a.charAt(0)) {
    //     lcs[0][j] = 1;
    //   }
    // }
    for (var i = 1; i < a.length; i++) {
        for (var j = 1; j < b.length; j++) {
            if (a.charAt(i - 1) === b.charAt(j - 1)) {
                lcs[i][j] = lcs[i - 1][j - 1] + 1;
            }
            else {
                lcs[i][j] = 0;
            }
        }
    }
    var result = -1;
    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
            if (lcs[i][j] > result) {
                result = lcs[i][j];
            }
        }
    }
    return result;
};
function longestCommonSubstring(string1, string2) {
    var longestCommonSubstring = 0;
    var table = Array(string1.length).fill(Array(string2.length).fill(0));
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
    return longestCommonSubstring;
}
var log = console.log;
log(longestCommonSubstring('mnbvbjfk', 'pxyzbvbj'));
