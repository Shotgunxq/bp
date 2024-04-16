// Define interface for binomial result
export interface BinomialResult {
  n: number;
  k: number;
  p: number;
  probability: number;
}

// Function to calculate binomial probability with random values
export function binomialProbabilityRandom(): BinomialResult {
  // Randomly generate values
  const n: number = Math.floor(Math.random() * 10) + 1;
  const k: number = Math.floor(Math.random() * (n + 1));
  const p: number = Math.round(Math.random() * 10000) / 10000;

  // Calculate probability
  const probability: number = calculateProbability(n, k, p);

  // Return result object
  return { n, k, p, probability };
}

// Function to calculate binomial probability
function calculateProbability(n: number, k: number, p: number): number {
  // Function to calculate factorial
  function factorial(num: number): number {
    if (num === 0 || num === 1) {
      return 1;
    } else {
      return num * factorial(num - 1);
    }
  }

  // Function to calculate combination
  function combination(n: number, k: number): number {
    return factorial(n) / (factorial(k) * factorial(n - k));
  }

  // Calculate probability
  let probability: number =
    combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  // Round probability to 3 decimal places
  probability = Math.round(probability * 1000) / 1000;
  return probability;
}
