import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss',
  // providers: [MatGridListModule],
  // standalone: true,
  // imports: [MatGridListModule, MatButtonModule ,MatIconModule, MatDividerModule],
})
export class MenuPageComponent {
  // Default to 3 columns for larger screens
  gridCols: number = 3;

  // Define the menu items
  menuItems = [
    { imgSrc: '/assets/pictures/test_writing.png', text: 'Pisat test', link: '../test' },
    { imgSrc: '/assets/pictures/done_tests.png', text: 'Napisane testy', link: '../done' },
    { imgSrc: '/assets/pictures/statistics.png', text: 'Statistika', link: '../stats' },
    { imgSrc: '/assets/pictures/export.png', text: 'Export', link: '../export' },
    { imgSrc: '/assets/pictures/materials.png', text: 'Materialy', link: '../mats' },
    { imgSrc: '/assets/pictures/settings.png', text: 'Nastavenia', link: '' }
  ];

  // Detect window resize to adjust grid column count
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustGridColumns(window.innerWidth);
  }

  // Adjust the number of columns based on screen width
  ngOnInit() {
    this.adjustGridColumns(window.innerWidth);
    localStorage.clear();
  }

  adjustGridColumns(width: number) {
    if (width > 1200) {
      this.gridCols = 3; // 3 columns for wide screens
    } else if (width > 768) {
      this.gridCols = 2; // 2 columns for medium screens
    } else {
      this.gridCols = 1; // 1 column for small screens
    }
  }
}
