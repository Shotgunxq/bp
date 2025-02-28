import { Component, OnInit, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/apiServices';
import { AdminService } from '../../services/adminServices';
import { ConfirmDialogComponent } from './adminDialog/confirm-dialog.component';
import { EditDialogComponent } from './adminDialog/edit-dialog.component';
import { AdminNewExerciseComponent } from './adminDialog/admin-new-exercise/admin-new-exercise.component';
import { AdminExerciseDialogService } from '../../services/adminExerciseDialog.service'; // <-- Import the service

declare var MathJax: any;

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
  displayedColumns: string[] = ['description', 'correct_answer', 'points', 'actions'];

  @ViewChildren(MatSort) sorts!: QueryList<MatSort>;

  constructor(
    private apiService: ApiService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private adminExerciseDialogService: AdminExerciseDialogService // <-- Inject here
  ) {}

  ngOnInit(): void {
    this.fetchThemes();

    // Subscribe to the dialog trigger event from the service
    this.adminExerciseDialogService.adminDialogTriggered$.subscribe(() => {
      this.openExerciseDialog();
    });
  }

  ngAfterViewInit(): void {
    this.sorts.changes.subscribe((sorts: QueryList<MatSort>) => {
      this.assignSorts(sorts);
    });

    MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)'],
        ],
      },
      CommonHTML: { linebreaks: { automatic: true } },
      'HTML-CSS': { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } },
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
    setTimeout(() => {
      const container = document.querySelector('.description-col');
      MathJax.typesetPromise([container]).catch((err: any) => console.error(err));
    }, 100);
  }

  onEdit(exercise: any, theme: Theme): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { exercise },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = theme.exercises?.data;
        if (data) {
          const index = data.findIndex((ex: any) => ex.exercise_id === result.exercise_id);
          if (index !== -1) {
            data[index] = result;
            theme.exercises!.data = data;
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
        this.adminService.deleteExercise(exercise.exercise_id).subscribe(
          () => {
            const data = theme.exercises?.data;
            if (data) {
              const index = data.findIndex((ex: any) => ex.exercise_id === exercise.exercise_id);
              if (index > -1) {
                data.splice(index, 1);
                theme.exercises!.data = data;
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

  openExerciseDialog(): void {
    const dialogRef = this.dialog.open(AdminNewExerciseComponent, {
      width: '400px',
      data: { inputValue: '' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Admin Dialog Result:', result);
      }
    });
  }
}
