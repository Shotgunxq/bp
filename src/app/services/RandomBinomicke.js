// Funkcia na výpočet pravdepodobnosti pomocou binomického rozdelenia s náhodnými hodnotamiFunkce pro výpočet pravděpodobnosti pomocí binomického rozdělení s náhodnými hodnotami
function binomialProbabilityRandom() {
  // Náhodne generujeme počet opakovaní n (v rozmedzí od 1 do 10)
  const n = Math.floor(Math.random() * 10) + 1;

  // Náhodne generujeme počet úspechov k (v rozmedzí od 0 do n)
  const k = Math.floor(Math.random() * (n + 1));

  // Náhodne generujeme pravdepodobnosť úspechu p (v rozmedzí od 0 do 1) s maximálne 4 desatinnými miestami
  const p = Math.round(Math.random() * 10000) / 10000;

  // Funkcie pre výpočet faktoriálu
  function factorial(num) {
    if (num === 0 || num === 1) {
      return 1;
    } else {
      return num * factorial(num - 1);
    }
  }

  // Výpočet kombinačného čísla
  function combination(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
  }

  // Výpočet pravdepodobnosti
  let probability = combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  // Zaokrúhlenie pravdepodobnosti na 3 desatinné miesta
  probability = Math.round(probability * 1000) / 1000;
  return { n, k, p, probability };
}

// Příklad použití funkce
const result = binomialProbabilityRandom();
console.log(`Počet opakovaní: ${result.n}`);
console.log(`Počet úspechu: ${result.k}`);
console.log(`Pravdepodobnosť úspechu: ${result.p}`);
console.log(
  `Pravdepodobnosť získania presne ${result.k} hláv pri ${result.n} hodoch mincí je ${result.probability}`,
);
