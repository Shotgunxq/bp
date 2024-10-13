// Define interface for exercise
export interface hypergeometricExercises {
  N: number;
  K: number;
  n: number;
  k: number;
  probability: number;
  description: string;
  answer: number;
  points: number;
}

// Function to generate exercises with random values
export function hypergeometricProbabilityRandom(): hypergeometricExercises[] {
  // Generate multiple exercises based on hypergeometric distribution
  const exercises: hypergeometricExercises[] = [];
  const numberOfExercises = 1; // Adjust the number of exercises as needed

  for (let i = 0; i < numberOfExercises; i++) {
    // Randomly generate values
    const { N, K, n, k } = generateRandomValues();

    // Calculate probability
    const probability: number = calculateHypergeometricProbability(K, N, n, k);

    // Generate description
    const description: string = generateDescription(N, K, n, k);

    // Calculate answer
    const answer = probability;

    // Push exercise to exercises array
    exercises.push({ N, K, n, k, probability, description, answer, points: 1 });
  }

  // Return array of exercises
  return exercises;
}

function generateRandomValues(): { N: number; K: number; n: number; k: number } {
  const N = Math.floor(Math.random() * 100) + 50; // Population size
  const K = Math.floor(Math.random() * Math.floor(N / 2)) + 10; // Number of successes in population
  const n = Math.floor(Math.random() * Math.floor(N / 5)) + 5; // Sample size
  const k = Math.floor(Math.random() * Math.min(n, K)) + 1; // Number of successes in sample
  return { N, K, n, k };
}

function calculateHypergeometricProbability(K: number, N: number, n: number, k: number): number {
  // Function to calculate combination
  function calculateCombination(n: number, k: number): number {
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= (n - i + 1) / i;
    }
    return result;
  }

  const numerator = calculateCombination(K, k) * calculateCombination(N - K, n - k);
  const denominator = calculateCombination(N, n);
  const probability = numerator / denominator;
  return probability;
}

// Function to generate description
function generateDescription(N: number, K: number, n: number, k: number): string {
  return `Aká je pravdepodobnosť vybrať presne ${k} úspechov zo vzorky veľkosti ${n} z populácie s ${N} položkami, z ktorých ${K} sú úspechy?\nZaokrúhlte na 3 desatinné miesta.`;
}
