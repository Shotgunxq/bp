// Define interface for Poisson distribution exercise
export interface PoissonDistributionExercise {
  lambda: number;
  k: number;
  probability: number;
  description: string;
  correct_answer: number;
  points: number;
  hints: string[];
}

// Function to generate Poisson distribution exercises
export function poissonDistributionRandom(): PoissonDistributionExercise[] {
  const exercises: PoissonDistributionExercise[] = [];
  const numberOfExercises = 1; // Change this if you want more exercises

  for (let i = 0; i < numberOfExercises; i++) {
    const { lambda, k } = generateRandomPoissonValues();
    const probability = calculatePoissonProbability(lambda, k);
    const description = generatePoissonDescription(lambda, k);
    const correct_answer = parseFloat(probability.toFixed(3));

    const hints = [
      `Priemerný počet výskytov za jednotku času (λ) je ${lambda}.`,
      `Počet výskytov, ktorý nás zaujíma, je ${k}.`,
      `Použite vzorec P(k; λ) = (e^{-λ} * λ^k) / k!`,
    ];

    exercises.push({ lambda, k, probability, description, correct_answer, points: 2, hints });
  }

  return exercises;
}

function generateRandomPoissonValues(): { lambda: number; k: number } {
  // k between 5 and 9 inclusive
  const k = Math.floor(Math.random() * 5) + 5;

  // λ must be > k; we pick it between k + 0.1 and 10.0
  const minLambda = k + 0.1;
  const maxLambda = 10.0;
  const lambda = parseFloat((Math.random() * (maxLambda - minLambda) + minLambda).toFixed(1));

  return { lambda, k };
}

function calculatePoissonProbability(lambda: number, k: number): number {
  const eToMinusLambda = Math.exp(-lambda);
  const lambdaPowerK = Math.pow(lambda, k);
  const factorialK = factorial(k);
  return (eToMinusLambda * lambdaPowerK) / factorialK;
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function generatePoissonDescription(lambda: number, k: number): string {
  return `\begin{aligned}
    \\text{Do serverovne prichádzajú v priemere } ${lambda} \\text{ požiadavky na minútu. } \\\\
    \\text{Aká je pravdepodobnosť, že v nasledujúcej minúte dorazí presne } ${k} \\text{ požiadaviek?} \\\\
    \\text{Zaokrúhlite výsledok na 3 desatinné miesta.}
    \end{aligned}`;
}
