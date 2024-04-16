// Define interface for exercise
export interface Exercise {
  n: number;
  k: number;
  p: number;
  probability: number;
  description: string;
}

// Function to generate exercises with random values
export function binomialProbabilityRandom(): Exercise[] {
  // Generate multiple exercises based on binomial distribution
  const exercises: Exercise[] = [];
  //TODO: Adjust the number of exercises as needed
  const numberOfExercises = 1; // You can adjust this number as needed

  for (let i = 0; i < numberOfExercises; i++) {
    // Randomly generate values
    const n: number = Math.floor(Math.random() * 10) + 1;
    const k: number = Math.floor(Math.random() * (n + 1));
    const p: number = Math.round(Math.random() * 100) / 100; //zaokrúhlene na 2 desatinné miesta

    // Calculate probability
    const probability: number = calculateProbability(n, k, p);

    // Generate description
    const description: string = generateDescription(n, k, p);

    // Push exercise to exercises array
    exercises.push({ n, k, p, probability, description });
  }

  // Return array of exercises
  return exercises;
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
  let probability: number = combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  // Round probability to 3 decimal places
  probability = Math.round(probability * 1000) / 1000;
  return probability;
}

// Function to generate description
function generateDescription(n: number, k: number, p: number): string {
  // return `Binomial exercise: n=${n}, k=${k}, p=${p}`;
  console.log(`n=${n}, k=${k}, p=${p}`);

  return `Aká je pravdepodobnosť získania presne ${k} úspechov pri ${n} pokusoch experimentu s pravdepodobnosťou úspechu ${p}?\nZaokrúhlite na 3 desatinné miesta.`;
}
