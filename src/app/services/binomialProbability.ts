export interface binomialExercise {
  n: number;
  k: number;
  p: number;
  probability: number;
  description: string;
  answer: number;
  points: number;
}

// Function to generate exercises with random values
export function binomialProbabilityRandom(): binomialExercise[] {
  // Generate multiple exercises based on binomial distribution
  const exercises: binomialExercise[] = [];
  // Adjust the number of exercises as needed
  const numberOfExercises = 1; // You can adjust this number as needed

  for (let i = 0; i < numberOfExercises; i++) {
    // Randomly generate values
    const n: number = Math.floor(Math.random() * 10) + 1 + 2;
    const k: number = Math.floor(Math.random() * (n + 1)) + 2;
    const p: number = Math.round(Math.random() * 100) / 100; // zaokrúhlene na 2 desatinné miesta

    // Calculate probability
    const probability: number = calculateProbability(n, k, p);

    // Generate description
    const description: string = generateDescription(n, k, p);

    // Calculate answer
    const answer: number = calculateAnswer(n, k, p);

    // Push exercise to exercises array
    exercises.push({ n, k, p, probability, description, answer, points: 1 });
  }

  // Return array of exercises
  return exercises;
}

// Function to calculate the answer
function calculateAnswer(n: number, k: number, p: number): number {
  // Calculate answer using the formula
  const answer = calculateProbability(n, k, p);
  return answer;
}

// Function to calculate binomial probability
function calculateProbability(n: number, k: number, p: number): number {
  // Iterative factorial function to avoid deep recursion
  function factorial(num: number): number {
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
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
  // console.log(`n=${n}, k=${k}, p=${p}`);
  return `Aká je pravdepodobnosť získania presne ${k} úspechov pri ${n} pokusoch experimentu s pravdepodobnosťou úspechu ${p}?\nZaokrúhlite na 3 desatinné miesta.`;
}
