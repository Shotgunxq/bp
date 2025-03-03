import { Component, ViewChild } from '@angular/core';
import { MathjaxComponent } from './mathjax.component';

@Component({
  selector: 'test-app',
  templateUrl: './test.component.html',
})
export class TestComponent {
  @ViewChild(MathjaxComponent) childView: MathjaxComponent | undefined;

  name = 'Mathjax ';
  mathContent = `When $ a \\ne 0 $, there are two solutions to \\(ax^2 + bx + c = 0 \\) and they are
$$ x = \\ {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$`;
}
