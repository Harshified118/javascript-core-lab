/**
 * 04_number_math_utils.js
 * Category: Basic
 *
 * Description:
 * Foundational mathematical routines:
 * - Prime checking & Sieve of Eratosthenes
 * - Fibonacci sequences (Iterative & Generator)
 * - Greatest Common Divisor (GCD) & Least Common Multiple (LCM)
 * - Factorials with BigInt support for large numbers
 */

/**
 * Checks if a number n is prime: O(sqrt(n))
 */
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Returns all primes up to limit using Sieve of Eratosthenes: O(n log log n)
 */
function sieveOfEratosthenes(limit) {
  if (limit < 2) return [];
  const sieve = new Uint8Array(limit + 1);
  sieve.fill(1);
  sieve[0] = 0;
  sieve[1] = 0;

  for (let p = 2; p * p <= limit; p++) {
    if (sieve[p] === 1) {
      for (let multiple = p * p; multiple <= limit; multiple += p) {
        sieve[multiple] = 0;
      }
    }
  }

  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (sieve[i] === 1) primes.push(i);
  }
  return primes;
}

/**
 * Generator that produces Fibonacci numbers lazily.
 */
function* fibonacciGenerator(count) {
  let [a, b] = [0n, 1n];
  for (let i = 0; i < count; i++) {
    yield a;
    [a, b] = [b, a + b];
  }
}

/**
 * Greatest Common Divisor via Euclidean algorithm
 */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Least Common Multiple
 */
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Factorial supporting BigInt
 */
function factorial(n) {
  if (n < 0) throw new Error("Factorial is not defined for negative numbers.");
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

function runDemo() {
  console.log("=== 04: Number & Math Utilities Demo ===");

  console.log("Is 29 prime?", isPrime(29));
  console.log("Is 91 prime?", isPrime(91)); // 7 * 13

  const primesUpTo50 = sieveOfEratosthenes(50);
  console.log("Primes up to 50:", primesUpTo50);

  const first10Fibs = Array.from(fibonacciGenerator(10)).map(Number);
  console.log("First 10 Fibonacci numbers:", first10Fibs);

  console.log("GCD(48, 18):", gcd(48, 18)); // 6
  console.log("LCM(12, 18):", lcm(12, 18)); // 36

  console.log("Factorial(5):", factorial(5).toString());
  console.log("Factorial(20):", factorial(20).toString());
}

if (require.main === module) {
  runDemo();
}

module.exports = { isPrime, sieveOfEratosthenes, fibonacciGenerator, gcd, lcm, factorial };
