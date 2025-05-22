// Define interface for exercise
export interface geometricExercise {
  n: number;
  k: number;
  p: number;
  probability: number;
  description: string;
  correct_answer: number;
  points: number;
  hints: string[];
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

    // Calculate correct_answer
    const correct_answer = 1 - Math.pow(1 - p, k);

    const hints: string[] = [
      `Pravdepodobnosť úspechu je ${p}.`,
      `Počet pokusov je ${k}.`,
      `Počet pokusov na dosiahnutie prvého úspechu je ${numberOfTrials}.`,
    ];

    // Push exercise to exercises array
    exercises.push({ n: numberOfTrials, k, p, probability, description, correct_answer, points: 3, hints });
  }

  // Return array of exercises
  return exercises;
}

// Function to generate description
function generateDescription(k: number, p: number): string {
  return `\\begin{aligned}
  \\text{Mikrokontrolér opakovane odosiela dátový paket cez sériovú linku, pričom pravdepodobnosť úspešného prenosu paketu je } ${k} \\
  \\text{. Aká je pravdepodobnosť, že prvý úspešný prenos nastane až na } ${p}\\text{. pokus?}
  \\end{aligned}`;
}

// Function to generate geometric distribution
function geometricDistribution(p: number): number {
  return Math.ceil(Math.log(Math.random()) / Math.log(1 - p));
}

// Function to calculate geometric probability
function geometricProbabilityMoreThanOrEqual(k: number, p: number): number {
  return 1 - Math.pow(1 - p, k);
}
