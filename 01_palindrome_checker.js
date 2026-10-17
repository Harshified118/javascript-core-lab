/**
 * 01_palindrome_checker.js
 * Category: Basic
 *
 * Description:
 * Validates whether given strings, phrases, and numbers are palindromes.
 * Ignores casing, punctuation, and whitespace for alphanumeric phrases.
 * Includes both two-pointer and reversal approaches.
 */

function isAlphanumeric(char) {
  const code = char.charCodeAt(0);
  return (
    (code >= 48 && code <= 57) || // 0-9
    (code >= 65 && code <= 90) || // A-Z
    (code >= 97 && code <= 122)   // a-z
  );
}

/**
 * Two-pointer approach: O(n) time, O(1) auxiliary space
 */
function isPalindromeTwoPointer(str) {
  if (typeof str !== "string") {
    str = String(str);
  }

  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    while (left < right && !isAlphanumeric(str[left])) {
      left++;
    }
    while (left < right && !isAlphanumeric(str[right])) {
      right--;
    }

    if (str[left].toLowerCase() !== str[right].toLowerCase()) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}

/**
 * Clean & reverse approach: concise and idiomatic
 */
function isPalindromeClean(str) {
  if (typeof str !== "string") {
    str = String(str);
  }
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}

// Interactive & Demonstration Driver
function runDemo() {
  console.log("=== 01: Palindrome Checker Demo ===");
  const testCases = [
    "racecar",
    "A man, a plan, a canal: Panama",
    "Was it a car or a cat I saw?",
    "hello world",
    "12321",
    "123456",
    "No 'x' in Nixon",
    "",
  ];

  for (const text of testCases) {
    const resTwoPointer = isPalindromeTwoPointer(text);
    const resClean = isPalindromeClean(text);
    console.log(
      `"${text}" -> TwoPointer: ${resTwoPointer ? "PASS (true)" : "FAIL (false)"} | Clean: ${resClean}`
    );
  }
}

if (require.main === module) {
  runDemo();
}

module.exports = { isPalindromeTwoPointer, isPalindromeClean };
