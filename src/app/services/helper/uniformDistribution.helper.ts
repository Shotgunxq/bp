export interface UniformDistributionExercise {
  a: number;
  b: number;
  x1: number;
  x2: number;
  probability: number;
  description: string;
  correct_answer: number;
  points: number;
  hints: string[];
}

export function uniformDistributionRandom(): UniformDistributionExercise[] {
  const exercises: UniformDistributionExercise[] = [];
  const numberOfExercises = 1;

  for (let i = 0; i < numberOfExercises; i++) {
    // Fix a = 0, b = 1023 to match ADC range
    const a = 0;
    const b = 1023;

    // Generate x1, x2 within [a, b]
    const x1 = parseFloat((Math.random() * (b - a) + a).toFixed(0));
    const x2 = parseFloat((Math.random() * (b - a) + a).toFixed(0));

    const lower = Math.min(x1, x2);
    const upper = Math.max(x1, x2);

    const probability = parseFloat(((upper - lower) / (b - a)).toFixed(3));

    const description = generateFixedUniformDescription(a, b, lower, upper);

    const hints: string[] = [
      `Rozsah výstupu prevodníka je \\([${a}, ${b}]\\), čiže ide o rovnomerné rozdelenie.`,
      `Použi vzorec: \\( P(x_1 \\leq X \\leq x_2) = \\frac{x_2 - x_1}{b - a} \\).`,
    ];

    exercises.push({
      a,
      b,
      x1: lower,
      x2: upper,
      probability,
      correct_answer: probability,
      description,
      points: 2,
      hints,
    });
  }

  return exercises;
}

function generateFixedUniformDescription(a: number, b: number, x1: number, x2: number): string {
  return `\\begin{aligned}
    \\text{ADC prevodník v mikrokontroléri digitalizuje analógový signál na hodnotu od } ${a} \\text{ do } ${b} \\text{ s rovnomerným rozdelením.} \\\\
    \\text{Aká je pravdepodobnosť, že náhodne nameraná hodnota bude medzi } ${x1} \\text{ a } ${x2}? \\\\
    \\text{Zaokrúhlite na 3 desatinné miesta.}
    \\end{aligned}`;
}
