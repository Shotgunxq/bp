import { Component, OnInit, AfterViewInit, QueryList, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/apiServices';
import { AdminService } from '../../services/adminServices';
import { ConfirmDialogComponent } from './adminDialog/confirm-dialog.component';
import { EditDialogComponent } from './adminDialog/edit-dialog.component';

import * as $ from 'jquery';

interface Theme {
  theme_id: number;
  theme_name: string;
  selected: boolean;
  exercises?: MatTableDataSource<any>;
  isLoading?: boolean;
  errorMessage?: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit, AfterViewInit {
  themes: Theme[] = [];
  // Added 'actions' to displayedColumns.
  displayedColumns: string[] = ['description', 'correct_answer', 'points', 'actions'];

  @ViewChildren(MatSort) sorts!: QueryList<MatSort>;

  @ViewChild('testFuck', { static: true }) testFuck?: ElementRef;

  constructor(
    private apiService: ApiService,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchThemes();
  }

  ngAfterViewInit(): void {
    // Subscribe to changes in the MatSort QueryList to reassign sorting
    this.sorts.changes.subscribe((sorts: QueryList<MatSort>) => {
      this.assignSorts(sorts);
    });

    $.default(this.testFuck?.nativeElement).on('click', () => {
      alert('click');
    });
  }

  assignSorts(sorts: QueryList<MatSort>): void {
    this.themes.forEach((theme, index) => {
      if (theme.exercises) {
        const sortInstance = sorts.toArray()[index];
        if (sortInstance) {
          theme.exercises.sort = sortInstance;
        }
      }
    });
  }

  fetchThemes(): void {
    this.apiService.getThemes().subscribe(
      (response: any[]) => {
        this.themes = response.map(theme => ({
          ...theme,
          selected: false,
          exercises: undefined,
          isLoading: false,
          errorMessage: '',
        }));
      },
      error => console.error('Error fetching themes:', error)
    );
  }

  onTabChange(index: number): void {
    const theme = this.themes[index];
    if (theme && !theme.exercises && !theme.isLoading) {
      theme.isLoading = true;
      this.adminService.getAllExercisesByTheme(theme.theme_id).subscribe(
        response => {
          theme.exercises = new MatTableDataSource(response.exercises);
          theme.isLoading = false;
          const sortInstance = this.sorts.toArray()[index];
          if (sortInstance) {
            theme.exercises.sort = sortInstance;
          }
        },
        error => {
          console.error('Error fetching exercises:', error);
          theme.errorMessage = 'Error fetching exercises. Please try again later.';
          theme.isLoading = false;
        }
      );
    }
  }

  onEdit(exercise: any, theme: Theme): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '500px',
      data: { exercise },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the exercise in the table's data using the correct identifier
        const data = theme.exercises?.data;
        if (data) {
          const index = data.findIndex((ex: any) => ex.exercise_id === result.exercise_id);
          if (index !== -1) {
            data[index] = result;
            theme.exercises!.data = data;
            // Refresh the table display
            theme.exercises!._updateChangeSubscription();
          }
        }
      }
    });
  }

  onDelete(exercise: any, theme: Theme): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this exercise?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Use exercise.exercise_id instead of exercise.id
        this.adminService.deleteExercise(exercise.exercise_id).subscribe(
          () => {
            // Remove the exercise from the table's data
            const data = theme.exercises?.data;
            if (data) {
              const index = data.findIndex((ex: any) => ex.exercise_id === exercise.exercise_id);
              if (index > -1) {
                data.splice(index, 1);
                theme.exercises!.data = data;
                // Refresh the table display
                theme.exercises!._updateChangeSubscription();
              }
            }
          },
          error => {
            console.error('Error deleting exercise:', error);
          }
        );
      }
    });
  }

  trackByThemeId(index: number, theme: Theme): number {
    return theme.theme_id;
  }
}
