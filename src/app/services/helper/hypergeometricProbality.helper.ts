// Define interface for exercise
export interface hypergeometricExercises {
  N: number;
  K: number;
  n: number;
  k: number;
  probability: number;
  description: string;
  correct_answer: number;
  points: number;
  hints: string[];
}

// Function to generate exercises with random values
export function hypergeometricProbabilityRandom(): hypergeometricExercises[] {
  const exercises: hypergeometricExercises[] = [];
  const numberOfExercises = 1;

  for (let i = 0; i < numberOfExercises; i++) {
    let N: number, K: number, n: number, k: number;
    let rawProb: number;

    // keep sampling until the raw probability will round nicely
    do {
      ({ N, K, n, k } = generateRandomValues());
      rawProb = calculateHypergeometricProbability(K, N, n, k);
    } while (rawProb < 0.0005 || rawProb > 0.9995);

    // now round to 3 decimals
    const roundedProb = Number(rawProb.toFixed(3));

    const description = generateDescription(N, K, n, k);
    const hints: string[] = [
      'Ide o výber bez vrátenia, preto použite hypergeometrické rozdelenie.',
      `Počet úspešných možností je počet výberov ${k} poškodených zo ${K} a ${n - k} nepoškodených zo ${N - K}.`,
      `Celkový počet možností je počet všetkých výberov ${n} súčiastok zo ${N}. Výslednú pravdepodobnosť dostanete ako podiel týchto dvoch hodnôt.`,
    ];

    exercises.push({
      N,
      K,
      n,
      k,
      probability: roundedProb,
      description,
      correct_answer: roundedProb,
      points: 3,
      hints,
    });
  }

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
  return `\\begin{aligned}
\\text{V škatuli sa nachádza } ${N} \\text{ súčiastok, z ktorých je } ${K} \\text{ poškodených.}\\\\
\\text{Technik náhodne vyberie } ${n} \\text{ súčiastok na kontrolu, postupne bez vrátenia.}\\\\
\\text{Nech } X \\text{ je počet poškodených vo výbere. Určte pravdepodobnosť, že } X = ${k}.\\\\
\\text{Zaokrúhlite na 3 desatinné miesta.}
\\end{aligned}`;
}
