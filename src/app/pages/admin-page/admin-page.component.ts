import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiServices';
import { adminService } from '../../services/adminServices';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  themes: { theme_id: number; theme_name: string; selected: boolean; exercises?: any[] }[] = [];

  constructor(
    private apiService: ApiService,
    private adminService: adminService
  ) {}

  ngOnInit(): void {
    this.fetchThemes();
  }

  fetchThemes(): void {
    this.apiService.getThemes().subscribe(
      response => {
        this.themes = response.map(theme => ({
          ...theme,
          selected: false,
          exercises: undefined, // Initialize exercises as undefined
        }));
      },
      error => console.error('Error fetching themes:', error)
    );
  }

  onTabChange(index: number): void {
    const theme = this.themes[index];
    if (theme && !theme.exercises) {
      // Fetch all exercises for the selected theme
      this.adminService.getAllExercisesByTheme(theme.theme_id).subscribe(
        response => {
          theme.exercises = response.exercises; // Store fetched exercises in the theme object
        },
        error => console.error('Error fetching all exercises:', error)
      );
    }
  }
}
