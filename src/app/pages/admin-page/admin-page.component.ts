import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/apiServices';
import { adminService } from '../../services/adminServices';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  themes: {
    theme_id: number;
    theme_name: string;
    selected: boolean;
    exercises?: MatTableDataSource<any>; // Use MatTableDataSource for sorting and pagination
  }[] = [];
  displayedColumns: string[] = ['description', 'correct_answer', 'points'];

  @ViewChildren(MatSort) sorts!: QueryList<MatSort>; // Access all MatSort instances

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
          // Convert the exercises to MatTableDataSource for sorting
          theme.exercises = new MatTableDataSource(response.exercises);

          // Dynamically assign MatSort to the exercises data source
          setTimeout(() => {
            const sort = this.sorts.toArray()[index];
            if (sort) {
              theme.exercises!.sort = sort;
            }
          });
        },
        error => console.error('Error fetching all exercises:', error)
      );
    }
  }
}
