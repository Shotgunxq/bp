export interface binomialExercise {
  n: number;
  k: number;
  p: number;
  probability: number;
  description: string;
  correct_answer: number;
  points: number;
  hints?: string[];
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

    // Calculate correct_answer
    const correct_answer: number = calculateAnswer(n, k, p);

    const hints: string[] = [
      'Úloha sa riadi binomickým rozdelením – opakuje sa pevný počet nezávislých pokusov s rovnakou pravdepodobnosťou úspechu.',
      'Použi vzorec: C(n, k) × p^k × (1 - p)^(n - k).',
      'Dosad konkrétne hodnoty za n, k a p a výsledok zaokrúhli na 3 desatinné miesta.',
    ];
    // Push exercise to exercises array
    exercises.push({ n, k, p, probability, description, correct_answer, points: 3, hints });
  }

  // Return array of exercises
  return exercises;
}

// Function to calculate the correct_answer
function calculateAnswer(n: number, k: number, p: number): number {
  // Calculate correct_answer using the formula
  const correct_answer = calculateProbability(n, k, p);
  return correct_answer;
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
  return `\begin{aligned}
&\text{Softvérový tester vykonáva } ${n} \text{ automatizovaných testov softvéru.} \\
&\text{Pravdepodobnosť úspešného prebehnutia jedného testu je } ${p} \text{.} \\
&\text{Nech } X \text{ je počet testov, ktoré sa skončia úspešne.} \\
&\text{Aká je pravdepodobnosť, že } X = ${k} \text{? Zaokrúhlite na 3 desatinné miesta.}
\end{aligned}
`;
}
