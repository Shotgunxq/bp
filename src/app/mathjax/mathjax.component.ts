import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

declare var MathJax: any; // ✅ Declare MathJax globally

@Component({
  selector: 'app-mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss'],
})
export class MathjaxComponent implements OnInit, OnChanges {
  @Input() content: string = ''; // ✅ Prevent undefined errors

  constructor() {}

  ngOnInit() {
    this.loadMathConfig(); // ✅ Load MathJax Configuration
    this.renderMath(); // ✅ Ensure MathJax is rendered at startup
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && changes['content'].currentValue) {
      this.renderMath(); // ✅ Re-render when content updates
    }
  }

  /** ✅ Load MathJax Config (Supports MathJax 2.x & 3.x) **/
  loadMathConfig() {
    console.log('Loading MathJax Config...');
    if (typeof MathJax !== 'undefined') {
      if (MathJax.version && MathJax.version.startsWith('3')) {
        MathJax.config = {
          tex: {
            inlineMath: [
              ['$', '$'],
              ['\\(', '\\)'],
            ],
            displayMath: [
              ['$$', '$$'],
              ['\\[', '\\]'],
            ],
          },
          svg: {
            fontCache: 'global',
          },
        };
        MathJax.startup.defaultReady();
      } else {
        MathJax.Hub.Config({
          showMathMenu: false,
          tex2jax: {
            inlineMath: [
              ['$', '$'],
              ['\\(', '\\)'],
            ],
            processEscapes: true,
          },
          'HTML-CSS': { linebreaks: { automatic: true } },
          SVG: { linebreaks: { automatic: true } },
        });
      }
    } else {
      console.error('MathJax is not loaded!');
    }
  }

  /** ✅ Render MathJax (Supports MathJax 2.x & 3.x) **/
  renderMath() {
    if (typeof MathJax !== 'undefined') {
      setTimeout(() => {
        console.log('Rendering MathJax Content...');
        if (MathJax.version && MathJax.version.startsWith('3')) {
          MathJax.typesetPromise()
            .then(() => console.log('MathJax 3.x: Rendered!'))
            .catch((err: any) => console.error('MathJax 3.x Error:', err));
        } else {
          MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'mathContent']);
        }
      }, 500); // Slight delay for rendering
    } else {
      console.error('MathJax is not available!');
    }
  }
}
