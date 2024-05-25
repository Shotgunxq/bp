// Define interface for exercise
export interface geometricExercise {
  n: number;
  k: number;
  p: number;
  probability: number;
  description: string;
}

// Function to generate exercises with random values
export function geometricProbabilityRandom(): geometricExercise[] {
  // Generate multiple exercises based on geometric distribution
  const exercises: geometricExercise[] = [];
  // Adjust the number of exercises as needed
  const numberOfExercises = 1;

  for (let i = 0; i < numberOfExercises; i++) {
    // Randomly generate values
    const p: number = Math.round(Math.random() * 100) / 100; // Random probability between 0 and 1
    const k: number = Math.floor(Math.random() * 3) + 2; // Random integer between 2 and 4 for k

    // Generate description
    const description: string = generateDescription(k, p);

    // Calculate the number of trials needed to achieve first success
    const numberOfTrials = geometricDistribution(p);

    // Calculate probability
    const probability = geometricProbabilityMoreThanOrEqual(k, p);

    // Push exercise to exercises array
    exercises.push({ n: numberOfTrials, k, p, probability, description });
  }

  // Return array of exercises
  return exercises;
}

// Function to generate description
function generateDescription(k: number, p: number): string {
  return `Aká je pravdepodobnosť potreby aspoň ${k} pokusov na dosiahnutie prvého úspechu v experimente s pravdepodobnosťou úspechu ${p}?`;
}

// Function to generate geometric distribution
function geometricDistribution(p: number): number {
  return Math.ceil(Math.log(Math.random()) / Math.log(1 - p));
}

// Function to calculate geometric probability
function geometricProbabilityMoreThanOrEqual(k: number, p: number): number {
  return 1 - Math.pow(1 - p, k);
}
