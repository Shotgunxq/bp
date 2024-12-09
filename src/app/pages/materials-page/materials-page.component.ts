import { Component } from '@angular/core';
import ApexCharts from 'apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexAnnotations,
  ApexDataLabels,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations?: ApexAnnotations;
  // Add this line
  dataLabels: ApexDataLabels; // Add this line
  // regions?: ApexAnnotations;
};
@Component({
  selector: 'app-materials-page',
  templateUrl: './materials-page.component.html',
  styleUrl: './materials-page.component.scss',
})
export class MaterialsPageComponent {
  content =
    '<strong>Podmienená pravdepodobnosť:</strong> Vyjadruje pravdepodobnosť udalosti $A$ za predpokladu, že nastala udalosť $B$, vypočítaná ako $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{ak } P(B) > 0$';
  content2: string = `<strong>Veta o úplnej pravdepodobnosti:</strong> Používa sa na výpočet pravdepodobnosti udalosti $B$ s využitím rozkladu na množiny $A_i$, kde $P(B) = \sum_{i} P(A_i) \\cdot P(B \mid A_i)$`;
  content3: string = `<strong>Veta Bayesovej pravdepodobnosti:</strong> Používa sa na výpočet pravdepodobnosti udalosti $A_k$ za predpokladu, že nastala udalosť $B$, vypočítaná ako $P(A_k \\mid B) = \\frac{P(B \\mid A_k) \\cdot P(A_k)}{\\sum_{i} P(B \\mid A_i) \\cdot P(A_i)}$`;
  content4: string = `<strong>Nezávislosť náhodných udalostí:</strong> Dve udalosti $A$ a $B$ sú nezávislé, ak $P(A \\cap B) = P(A) \\cdot P(B)$, t.j., výskyt jednej nemá vplyv na výskyt druhej.`;

  distribucnaFun: string = `<strong>Distribučná funkcia $F_X(x)$ :</strong> Určuje pravdepodobnosť, že náhodná premenná nadobudne hodnotu menšiu alebo rovnú 𝑥: $F_X(x) = P(X \\leq x)$`;
  hustotaPravde: string = `<strong>Hustota pravdepodobnosti</strong> (pre spojitú premennú) <strong>$f_X(x)$</strong>: Derivácia distribučnej funkcie. Určuje pravdepodobnosť, že náhodná premenná padne do určitého intervalu.`;
  strednaHodnota: string = `<strong>Stredná hodnota $E(X)$:</strong> Očakávaná hodnota náhodnej premennej:<ul><li>Pre diskrétnu premennú: $E(X) = \\sum x_i \\cdot p(x_i)$</li><li>Pre spojitú premennú: $E(X) = \\int_{-\\infty}^{\\infty} x \\cdot f_X(x) \, dx$</li></ul>`;
  rozptyl: string = `<strong>Rozptyl $Var(X)$:</strong> Miera rozptylu okolo strednej hodnoty: $\\operatorname{Var}(X) = E[(X - E(X))^2]$`;

  strednaHodnota2: string = `<strong>Stredná hodnota: </strong> <ul>
  <li>Pre diskrétnu náhodnú premennú $X$ s pravdepodobnostným rozdelením $ {(x_i, p_i); i= 1,2, ...}: $ $E(X) = \\sum_{i} x_i p_i$</li>
  <li>Pre spojitú náhodnú premennú $X$ s hustotou $f_X(t):$ $E(X) = \\int_{-\\infty}^{\\infty} t \cdot f_X(t) \, dt$</li>
  </ul> `;
  momenty: string = `<strong>Momenty:</strong> 
  <ul>
  <li>Začiatočný moment $k$-tého rádu: $\\nu_k = E(X^k)$</li>
  <li>Centrálne momenty $k$-tého rádu: $\\mu_k = E((X - E(X))^k)$</li>
  </ul>`;
  rozptyl2: string = `<strong>Rozptyl</strong> (disperzia) a smerodajná odchýlka: $D(X) = E((X - E(X))^2)$ $\\sqrt{D(X)}$ je smerodajná odchýlka.`;
  cebysevovaNerov: string = `<strong>Čebyševova nerovnosť:</strong> $P\\left( \\left| X - E(X) \\right| > \\lambda \\cdot \\sqrt{D(X)} \\right) \\leq \\frac{1}{\\lambda^2} \\quad \\text{pre } \\lambda > 0$`;
  koeficienty: string = `<strong>Koeficienty:</strong> 
  <ul>
  <li> Šikmosť: $\\alpha_3 = \\frac{\\mu_3}{\\sigma^3}$ </li>
  <li> Špicatosť: $\\alpha_4 = \\frac{\\mu_4}{\\sigma^4}$ </li>
  <li> Centrovaná špicatosť: $\\gamma_4 = \\alpha_4 - 3$</li>
  </ul>`;
  vlastnosti: string = `<strong>Vlastnosti strednej hodnoty a rozptylu:</strong>
  <ul>
  <li>Lineárna kombinácia: $E(u \\cdot X + v) = u \\cdot E(X) + v$</li>
  <li>Rozptyl: $D(X) = E(X^2) - (E(X))^2$</li>
  </ul>`;

  modus: string = `<strong>Modus:</strong> <ul>
  <li>Definícia pre diskrétnu náhodnú premennú: Modus je hodnota $x_Mo$ s maximálnou pravdepodobnosťou: $P(X = x_{\\text{Mo}}) = \\max(p_1, p_2, \\dots)$</li>
  <li>Definícia pre spojitú náhodnú premennú: Módus je hodnota $x_Mo$ pre ktorú platí $f_X(x_{\\text{Mo}}) = \\max_x f_X(x)$, kde $f_X$ je hustota pravdepodobnosti.</li>
  </ul>`;

  kvantily: string = `<strong>Kvantily:</strong> Definícia p-kvantilu: Kvantyl $x_p$ je hodnota, pre ktorú platí: $P(X < x_p) \\leq p \\quad \\text{a} \\quad P(X > x_p) \\leq 1 - p$`;

  medHorDolKval: string = `<strong>Medián, horný a dolný kvantil: </strong> 
  <ul>
  <li>Median $x_0.5$ je 50. percentil a označuje sa $x_Me$.</li>
  <li>Dolný kvartil $x_0.25$ je 25. percentil, označuje sa $x_L$</li>
  <li>Horný kvartil $x_0.75$ je 75. percentil, označuje sa $x_U$</li>
  <ul>`;

  alterRozdel: string = `<strong>Alternatívne rozdelenie: </strong> 
  <ul>
  <li><strong>Definícia: </strong> Pre dve možnosti (napr. úspech alebo neúspech) s pravdepodobnosťou $p$  pre úspech: $P(A) = p, \\quad P(X = x_1) = p, \\quad P(X = x_2) = 1 - p.$</li>
  <li><strong>Očakávaná hodnota: </strong> $E(X) = x_1 p + x_2 (1 - p) = p$.</li>
  <li><strong>Rozptyl: </strong> $D(X) = (x_1 - x_2)^2 p(1 - p) = p(1 - p)$.</li>
  </ul>`;

  binomickeRozdel: string = `<strong>Binomické rozdelenie: </strong>
  <ul>
  <li>Pre nezávislé pokusy s pravdepodobnosťou úspechu $p$: $P(X = k) = \\binom{n}{k} p^k (1 - p)^{n-k}.$ </li>
  <li><strong>Očakávaná hodnota: </strong>$E(X) = np.$</li>
  <li><strong>Rozptyl: </strong>$D(X) = np(1 - p).$</li>
  </ul>`;

  poisson: string = `<strong>Poissonovo rozdelenie: </strong>
  <ul>
  <li><strong>Poissonova veta: </strong>Pre binomické rozdelenie, kde $n \\rightarrow -\\infty$ a $p \\rightarrow 0$, platí: $\\lim_{n \\to \\infty} P(X_n = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad \\text{pre } k = 0, 1, 2, \\dots.$</li>
  <li><strong>Distribučná funkcia: </strong>$P(X \\leq n) = \\sum_{k=0}^{n} \\frac{\\lambda^k e^{-\\lambda}}{k!}.$</li>
  <li><strong>Očakávaná hodnota a rozptyl: </strong>$E(X) = D(X) = \\lambda.$</li>
  </ul>
  `;

  geometrickeRozdelenie: string = `<strong>Geometrické rozdelenie: </strong>
  <ul>
  <li><strong>Definícia: </strong>Ak $X$ je počet neúspešných pokusov pred úspechom: $P(X = k) = (1 - p)^k p.$</li>
  <li><strong>Očakávaná hodnota: </strong> $E(X) = \\frac{1 - p}{p}.$</li>
  <li><strong>Rozptyl: </strong> $D(X) = \\frac{1 - p}{p^2}.$</li>
  </ul>`;

  rovnomerneRozdelenie: string = `<strong>Rovnomerné rozdelenie: </strong>
  <ul>
  <li><strong>Definícia: </strong> Pre rovnomerne distribuovanú náhodnú premennú $X \\in {x_1,x_2,...x_n}$, s pravdepodobnosťou: $P(X = x_i) = \\frac{1}{n}, \\quad \\text{pre všetky } i.$</li>
  <li><strong>Očakávaná hodnota: </strong>$E(X) = \\frac{1}{n} \\sum_{i=1}^{n} x_i.$</li>
  <li><strong>Rozptyl: </strong>$D(X) = \\frac{1}{n} \\sum_{i=1}^{n} x_i^2 - E(X)^2.$</li>
  </ul>`;

  hypergeometrickeRozdelenie: string = `
  <strong>Hypergeometrické rozdelenie: </strong>
  <ul>
  <li><strong>Definícia: </strong>Ak máme $N$ prvkov a $k$ úspešných prvkov, vyberáme $n$ náhodných prvkov bez vrátenia: $P(X = i) = \\frac{\\binom{k}{i} \\binom{N-k}{n-i}}{\\binom{N}{n}}, \\quad \\text{pre } i = \\max(0, k + n - N) \\dots \\min(k, n).$</li>
  <li>Príklad: Pravdepodobnosť, že medzi 5 náhodne vybranými študentmi budú 3 absolventi: $P(X = 3) = \\frac{\\binom{15}{3} \\binom{10}{2}}{\\binom{25}{5}} = 0.3854.$</li>
  </ul>`;

  logNormalRozdelenie: string = `
<strong>Log-normálne rozdelenie: </strong>
<ul>
  <li><strong>Definícia: </strong> Ak $X$ má logaritmicko-normálne rozdelenie pravdepodobnosti s parametrami $\\mu$ a $\\sigma^2$, ak $\\ln X \\sim N(\\mu, \\sigma^2)$. Funkcia hustoty je: 
  $f_X(t) = \\begin{cases} 
  \\frac{1}{\\sigma t \\sqrt{2\\pi}} e^{\\frac{-(\\ln t - \\mu)^2}{2\\sigma^2}} & t > 0 \\
  0 & t \\leq 0
  \\end{cases}$
  </li>
  <li><strong>Momenty: </strong> Ak $\\ln X \\sim N(\\mu, \\sigma^2)$, potom:  
  $E(X) = e^{\\mu + \\frac{\\sigma^2}{2}}, \quad D(X) = (e^{\\sigma^2} - 1)e^{2\\mu + \\sigma^2}.$</li>
</ul>`;

  exponentialneRozdelenie: string = `
<strong>Exponenciálne rozdelenie: </strong>
<ul>
  <li><strong>Definícia: </strong> Ak $X$ má exponenciálne rozdelenie s parametrom $\\lambda > 0$, potom funkcia hustoty je:
  $f_X(t) = \\begin{cases} 
  \\lambda e^{-\\lambda t} & t \\geq 0 \\
  0 & t < 0
  \\end{cases}$
  </li>
  <li><strong>Distribučná funkcia: </strong> Pre $X \\sim Exp(\\lambda)$: 
  $F_X(a) = \\int_0^a \\lambda e^{-\\lambda t} dt = 1 - e^{-\\lambda a}.$</li>
  <li><strong>Očakávaná hodnota: </strong> 
  $E(X) = \\frac{1}{\\lambda}.$ </li>
  <li><strong>Rozptyl: </strong> 
  $D(X) = \\frac{1}{\\lambda^2}.$</li>
</ul>`;

  limitneVety: string = `
<strong>Limitné vety: </strong>
<ul>
  <li><strong>Definícia: </strong> Nech $(\\Omega, S, P)$ je pravdepodobnostný priestor. Postupnosť náhodných premenných $X_1, X_2, \\dots$ konverguje podľa pravdepodobnosti k číslu $c \\in \\mathbb{R}$ (označujeme $X_n \\xrightarrow{P} c$), ak pre všetky $\\varepsilon > 0$:
  $\\lim_{n \\to \\infty} P\\left( \\{\\omega \\in \\Omega; |X_n(\\omega) - c| < \\varepsilon \\} \\right) = 1.$</li>
  <li><strong>Slabý zákon veľkých čísel: </strong> Nech $X_1, X_2, \\dots$ je postupnosť nezávislých náhodných premenných s $E(X_n) = \\mu_n$ a $D(X_n) = \\sigma^2_n$. Ak:
  $\\lim_{n \\to \\infty} \\frac{1}{n^2} \\sum_{i=1}^{n} \\sigma_i^2 = 0,$
  potom:  
  $X_n - \\frac{1}{n} \\sum_{i=1}^{n} \\mu_i \\xrightarrow{P} 0.$</li>
  <li><strong>Centrálna limitná veta (CLV): </strong> Nech $X_1, X_2, \\dots$ je postupnosť nezávislých náhodných premenných s rovnakým rozdelením pravdepodobnosti, pre ktoré existujú prvé dva momenty $E(X_n) = \\mu$ a $D(X_n) = \\sigma^2 > 0$. Potom platí:  
  $Y_n = \\frac{X_n - \\mu}{\\sqrt{n} \\sigma} \\xrightarrow{L} X,$ kde $X \\sim N(0,1)$. </li>
</ul>`;

  popisnaStatistika: string = `
<ul>
  <li><strong>Definícia: </strong> Štatistika je disciplína zaoberajúca sa analýzou údajov ovplyvnených náhodnými chybami alebo náhodnými javmi.</li>
  <li><strong>Dáta: </strong> Štatistické údaje sa rozdeľujú na kvantitatívne a kvalitatívne dáta.</li>
  <li><strong>Kvalitatívne dáta: </strong> Tieto dáta sa často prezentujú v textovej forme, napríklad: 
  pohlavie (muž, žena), typ auta, typ procesora. Frekvencia a modus sú dôležité pre analýzu kvalitatívnych dát. Najčastejšie používané grafy sú koláčové a stĺpcové grafy.</li>
  <li><strong>Kvantitatívne dáta: </strong> Tieto dáta sú namerané na numerickej stupnici. Môžeme ich rozdeliť na diskrétne (napr. počet detí) a spojité (napr. teplota, percentá).</li>
  <li><strong>Relatívna frekvencia: </strong> Empirické rozdelenie pravdepodobnosti sa dá vyjadriť pomocou relatívnych frekvencií:</li>
  
    $ f_i = \\frac{n_i}{n}, $  
    kde $n_i$ je počet výskytov pre danú vlastnosť a $n$ je celkový počet pozorovaní.

  <li><strong>Modus: </strong> Najčastejšie sa vyskytujúca hodnota v súbore dát.</li>
  <li><strong>Kvantily: </strong> p-kvantil je hodnota, ktorá rozdeľuje distribúciu na percentá. Pre p-kvantil platí:
  $ P(X < x_p) \\leq p \\quad \\text{a} \\quad P(X \\geq x_p) \\leq 1 - p. $</li>
  <li><strong>Usporiadanie dát: </strong> Pre usporiadané dáta ($x_1, x_2, \dots, x_n$) medián sa určuje nasledovne:
    - Ak $n$ je nepárne, medián je hodnota $x_{k+1}$, kde $k = \\frac{n-1}{2}$.
    - Ak $n$ je párne, medián je priemer dvoch stredných hodnôt:
    $ Me = \\frac{x_k + x_{k+1}}{2}. $</li>
  <li><strong>Krabicový graf (Box plot): </strong> Tento graf ukazuje kvartily, medián a extrémne hodnoty v dátach. 
    - Kumulatívna rel. frekvencia a kumulatívna frekvencia sú dôležité pri analýze a zobrazení dát.
  </li>
  <li><strong>Extrémne hodnoty: </strong> Hodnoty sa považujú za extrémne, ak:
    $ x < Q_L - 1.5 \\cdot R \\quad \\text{alebo} \\quad x > Q_U + 1.5 \\cdot R, $
    kde $Q_L$ je dolný kvartil, $Q_U$ je horný kvartil a $R$ je interkvartilové rozpätie.</li>
</ul>
`;

  narodnyVektor: string = `
<strong>Náhodný vektor a združené rozdelenie pravdepodobnosti: </strong>
<ul>
  <li><strong>Združená pravdepodobnosť: </strong> Pre náhodné premenné $X$ a $Y$ je združená distribučná funkcia definovaná ako:
  $ F_{X,Y}(t, s) = P(X \\leq t, Y \\leq s). $</li>
  <li><strong>Funkcia hustoty: </strong> Ak je $F_{X,Y}(t, s)$ združená distribučná funkcia, potom jej 2. parciálna derivácia je združenou funkciou hustoty:
  $ f_{X,Y}(t, s) = \\frac{\\partial^2 F_{X,Y}(t, s)}{\\partial t \\partial s}. $</li>
  <li><strong>Vlastnosti združeného rozdelenia: </strong>
    <ul>
      <li>Je nezáporná a neklesajúca v každej premennej.</li>
      <li>Pre $t \\to -\\infty$ a $s \\to -\\infty$ platí: 
      $ \\lim_{t \\to -\\infty, s \\to -\\infty} F_{X,Y}(t, s) = 0. $</li>
      <li>Pre $t \\to \\infty$ a $s \\to \\infty$:
      $ \\lim_{(t,s) \\to (\\infty, \\infty)} F_{X,Y}(t, s) = 1. $</li>
      <li>Marginálne rozdelenia:  
      $ F_X(t) = \\lim_{s \\to \\infty} F_{X,Y}(t, s), \\quad F_Y(s) = \\lim_{t \\to \\infty} F_{X,Y}(t, s). $</li>
    </ul>
  </li>
  <li><strong>Nezávislosť náhodných premenných: </strong> Premenné $X$ a $Y$ sú nezávislé, ak:
    $ F_{X,Y}(t, s) = F_X(t)F_Y(s) \\quad \\text{pre každé } t, s. $</li>
  <li><strong>Funkcia hustoty pre nezávislé premenné: </strong> Ak sú $X$ a $Y$ nezávislé, platí:
    $ f_{X,Y}(t, s) = f_X(t)f_Y(s). $</li>
  <li><strong>Očakávaná hodnota pre funkciu $Z = g(X, Y)$:</strong>
    $ E(Z) = \\int \\int_{R \\times R} g(t, s) f_{X,Y}(t, s) dt ds. $</li>
</ul>`;

  kovarianciaKorelacnyKoeficient: string = `
<strong>Kovariancia a korelačný koeficient: </strong>
<ul>
  <li><strong>Kovariancia:</strong> Kovariancia medzi náhodnými premennými $X$ a $Y$ je definovaná ako:
    $ \\text{cov}(X, Y) = E[(X - E(X))(Y - E(Y))]. $</li>
  <li><strong>Korelačný koeficient:</strong> Korelačný koeficient medzi $X$ a $Y$ je:
    $ \\rho(X, Y) = \\frac{\\text{cov}(X, Y)}{\\sqrt{\\text{cov}(X, X) \\text{cov}(Y, Y)}}. $</li>
  <li><strong>Kovariancná matica:</strong> Pre n-rozmerný náhodný vektor $X = (X_1, \\dots, X_n)^T$ je kovariancná matica definovaná ako:
    $ \\Sigma_X = \\{ \\text{cov}(X_i, X_j) \\}_{i,j \\in \\{1, \\dots, n\\}}. $</li>
  <li><strong>Vlastnosti kovariancie:</strong>
    <ul>
      <li>Symetria: $ \\text{cov}(X, Y) = \\text{cov}(Y, X). $</li>
      <li>Lineárnosť: $ \\text{cov}(aX + b, Y) = a \\cdot \\text{cov}(X, Y). $</li>
      <li>Pre nezávislé premenné: $ \\text{cov}(X, Y) = 0. $</li>
      <li>Pre normálne rozdelené premenné: Ak $X$ a $Y$ majú združené normálne rozdelenie, potom:
        $ \\text{cov}(X, Y) = 0 \\quad \\text{implikuje nezávislosť.} $</li>
    </ul>
  </li>
  <li><strong>Kovariancia pre lineárne kombinácie:</strong>
    <ul>
      <li>Pre $Z = aX + bY$ platí: 
        $ E(Z) = a E(X) + b E(Y), $ 
        $ \\text{cov}(Z, Z) = a^2 \\text{cov}(X, X) + b^2 \\text{cov}(Y, Y) + 2ab \\cdot \\text{cov}(X, Y). $</li>
    </ul>
  </li>
</ul>`;
}
