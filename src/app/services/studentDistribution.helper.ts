// Define interface for Student's t-distribution exercise
export interface StudentsTDistributionExercise {
  degreesOfFreedom: number;
  tValue: number;
  description: string;
  correct_answer: number;
  points: number;
  hints: string[];
}

// Function to generate exercises with random values
export function studentsTDistributionRandom(): StudentsTDistributionExercise[] {
  const exercises: StudentsTDistributionExercise[] = [];
  const numberOfExercises = 1; // Adjust the number of exercises as needed

  for (let i = 0; i < numberOfExercises; i++) {
    // Generate random values
    const { degreesOfFreedom, tValue } = generateRandomStudentTValues();

    // Generate description
    const description: string = generateStudentTDescription(degreesOfFreedom, tValue);

    // Correct answer (would usually be looked up in t-distribution tables or computed)
    const correct_answer = NaN; // placeholder for actual calculation

    const hints: string[] = [
      `Počet stupňov voľnosti (degrees of freedom) je ${degreesOfFreedom}.`,
      `Hodnota testovacej štatistiky t je ${tValue.toFixed(2)}.`,
      `Použite tabuľku alebo softvér pre nájdenie pravdepodobnosti.`,
    ];

    // Push exercise to exercises array
    exercises.push({ degreesOfFreedom, tValue, description, correct_answer, points: 3, hints });
  }

  return exercises;
}

// Helper function to generate random values for Student's t-distribution
function generateRandomStudentTValues(): { degreesOfFreedom: number; tValue: number } {
  const degreesOfFreedom = Math.floor(Math.random() * 30) + 1; // usually df > 0
  const tValue = parseFloat((Math.random() * 4 - 2).toFixed(2)); // range [-2, 2] typical t-values
  return { degreesOfFreedom, tValue };
}

// Function to generate exercise description
function generateStudentTDescription(degreesOfFreedom: number, tValue: number): string {
  return `\\begin{aligned}
    \\text{Určte pravdepodobnosť } P(T > ${tValue.toFixed(2)}) \\text{ pre Studentovo rozdelenie s } ${degreesOfFreedom} \\text{ stupňami voľnosti.}\\\\
    \\text{Použite tabuľky alebo štatistický softvér a zaokrúhlite na 3 desatinné miesta.}
    \\end{aligned}`;
}
