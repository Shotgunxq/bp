import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { ApiService } from '../../services/apiServices';
import { TimeUpDialogComponent } from '../../components/Modals/Dialog/time-up-dialog/time-up-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-test-writing',
  templateUrl: './test-writing.component.html',
  styleUrls: ['./test-writing.component.scss'],
})
export class TestWritingComponent implements OnInit, OnDestroy {
  data: any[] = [];
  currentExerciseIndex: number = 0;
  currentExercise: any = null;
  userAnswer: string = '';
  answerChecked: boolean = false;
  answerMessage: string = '';

  timeLimit: string = '00:00:00'; // HH:MM:SS
  timeLeft: number = 0; // in seconds
  timer: any;
  timerKey: string = 'test-writing-timer';
  exercisesKey: string = 'test-writing-exercises';

  userId: number = 1; // Replace with actual user ID from authentication
  testId: number = 1; // Replace with actual test ID

  gamificationEnabled: boolean = false;
  currentScore: number = 0;
  animateScore: boolean = false; // Used to trigger score animation

  // New property to track how many hints have been revealed
  hintsRevealed: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar, // Inject MatSnackBar
    private dialog: MatDialog // <-- Inject MatDialog
  ) {}

  ngOnInit(): void {
    const stateData = history.state.data;
    this.data = stateData || [];
    this.gamificationEnabled = history.state.gamification || false;

    if (!this.gamificationEnabled) {
      // Disable gamification effects:
      // - Skip playing sounds
      // - Skip visual animations (or use static styles)
      // - Set points calculation to zero if desired
    }
    this.timeLimit = history.state.timeLimit || '00:30:00';
    const savedTimeLeft = localStorage.getItem(this.timerKey);

    if (savedTimeLeft) {
      this.timeLeft = parseInt(savedTimeLeft, 10);
    } else {
      this.timeLeft = this.convertTimeToSeconds(this.timeLimit);
    }

    if (this.data.length > 0) {
      // Initialize each exercise
      this.data.forEach(exercise => {
        exercise.answerLocked = exercise.answerLocked || false;
        exercise.points = exercise.points || 0;
        exercise.scoreAwarded = exercise.scoreAwarded || false; // New flag for scoring

        // Initialize hintsRevealed if not present
        if (exercise.hintsRevealed === undefined) {
          exercise.hintsRevealed = 0;
        }
      });

      const savedExercises = localStorage.getItem(this.exercisesKey);
      if (savedExercises) {
        this.data = JSON.parse(savedExercises);

        // Ensure we still have hintsRevealed even after reloading from local storage
        this.data.forEach(exercise => {
          if (exercise.hintsRevealed === undefined) {
            exercise.hintsRevealed = 0;
          }
        });
      }

      this.currentExercise = this.data[0];
      this.loadUserAnswer();
    } else {
      console.warn('No exercises available to initialize.');
    }

    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.saveUserAnswers();
  }

  convertTimeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        localStorage.setItem(this.timerKey, this.timeLeft.toString());
      } else {
        this.timeLeft = 0;
        this.stopTimer();
        localStorage.removeItem(this.timerKey);

        // Open the time-up modal dialog
        const dialogRef = this.dialog.open(TimeUpDialogComponent);

        dialogRef.afterClosed().subscribe(() => {
          // Once the user clicks OK, reset test state and redirect to the menu
          this.resetTestState();
          this.router.navigate(['/menu']); // Update route if needed
        });
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  resetTestState(): void {
    this.stopTimer();
    this.data = [];
    this.currentExerciseIndex = 0;
    this.currentExercise = null;
    this.userAnswer = '';
    this.answerChecked = false;
    this.answerMessage = '';
    this.timeLeft = 0;

    localStorage.removeItem(this.timerKey);
    localStorage.removeItem(this.exercisesKey);
  }

  saveUserAnswers(): void {
    if (this.currentExercise) {
      this.data[this.currentExerciseIndex].userAnswer = this.userAnswer;
      // Make sure we keep the updated hintsRevealed
      this.data[this.currentExerciseIndex].hintsRevealed = this.currentExercise.hintsRevealed;
      localStorage.setItem(this.exercisesKey, JSON.stringify(this.data));
    }
  }

  loadUserAnswer(): void {
    if (this.currentExercise && this.currentExercise.userAnswer) {
      this.userAnswer = this.currentExercise.userAnswer;
    } else {
      this.userAnswer = '';
    }
    this.answerChecked = false;
    this.answerMessage = '';
  }

  prevExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.saveUserAnswers();
      this.currentExerciseIndex--;
      this.currentExercise = this.data[this.currentExerciseIndex];
      // DO NOT reset hintsRevealed here
      this.loadUserAnswer();
    }
  }

  nextExercise(): void {
    if (this.currentExerciseIndex < this.data.length - 1) {
      this.saveUserAnswers();
      this.currentExerciseIndex++;
      this.currentExercise = this.data[this.currentExerciseIndex];
      // DO NOT reset hintsRevealed here
      this.loadUserAnswer();
    }
  }

  jumpToExercise(index: number): void {
    if (index >= 0 && index < this.data.length) {
      this.saveUserAnswers();
      this.currentExerciseIndex = index;
      this.currentExercise = this.data[index];
      // DO NOT reset hintsRevealed here
      this.loadUserAnswer();
    }
  }

  toggleAnswerLock(): void {
    if (this.currentExercise) {
      // Toggle the answer lock state
      this.currentExercise.answerLocked = !this.currentExercise.answerLocked;

      if (this.currentExercise.answerLocked) {
        const userAns = String(this.userAnswer || '').trim();
        const correctAns = String(this.currentExercise.answer || this.currentExercise.correct_answer || '').trim();

        if (this.gamificationEnabled) {
          if (userAns === correctAns && userAns !== '') {
            this.currentExercise.isCorrect = true;
            this.currentExercise.isWrong = false;
            this.answerMessage = 'Correct!';
            // Only add points if they haven't been awarded already
            if (!this.currentExercise.scoreAwarded) {
              const exerciseScore = this.calculateExerciseScore(this.currentExercise);
              this.currentScore += exerciseScore;
              this.currentExercise.scoreAwarded = true; // Mark as scored
              this.playCorrectSound();
            }
          } else {
            this.currentExercise.isCorrect = false;
            this.currentExercise.isWrong = true;
            this.answerMessage = 'Incorrect. Try again.';
          }
        } else {
          this.currentExercise.isCorrect = false;
          this.currentExercise.isWrong = false;
          this.answerMessage = '';
        }
      } else {
        // When unlocking, reset flags and message but do not reset scoreAwarded
        this.currentExercise.isCorrect = false;
        this.currentExercise.isWrong = false;
        this.answerMessage = '';
      }

      this.saveUserAnswers();
    }
  }

  // New method to reveal the next hint
  revealHint(): void {
    if (this.currentExercise && this.currentExercise.hints) {
      const totalHints = this.currentExercise.hints.length;
      if (this.currentExercise.hintsRevealed < totalHints) {
        this.currentExercise.hintsRevealed++;
        // Save to localStorage so it’s remembered
        localStorage.setItem(this.exercisesKey, JSON.stringify(this.data));
      }
    }
  }

  checkAnswer(): void {
    if (this.currentExercise) {
      this.currentExercise.userAnswer = this.userAnswer;

      if (this.userAnswer.trim() === this.currentExercise.answer.trim()) {
        this.answerMessage = 'Correct!';

        if (this.gamificationEnabled) {
          this.currentExercise.isCorrect = true;
          // Only add points if they haven't been awarded already
          if (!this.currentExercise.scoreAwarded) {
            const exerciseScore = this.calculateExerciseScore(this.currentExercise);
            this.currentScore += exerciseScore;
            this.currentExercise.scoreAwarded = true; // Mark as scored
            this.animateScore = true;
            setTimeout(() => (this.animateScore = false), 1000);
            this.playCorrectSound();
          }
        } else {
          this.currentExercise.isCorrect = false;
        }
      } else {
        this.answerMessage = 'Incorrect. Try again.';
        this.currentExercise.isCorrect = false;
      }
      this.answerChecked = true;
      this.saveUserAnswers();
    }
  }

  submitTest(): void {
    let totalPoints = 0;
    let totalHintsUsed = 0;
    this.data.forEach(exercise => {
      if (exercise.userAnswer === exercise.answer) {
        const exerciseScore = this.calculateExerciseScore(exercise);
        totalPoints += exerciseScore;
      }
      totalHintsUsed += exercise.hintsRevealed || 0;
    });

    const submissionBody = {
      user_id: this.userId,
      test_id: this.testId,
      points: totalPoints,
      total_hints_used: totalHintsUsed, // additional info for gamification
      timestamp: new Date().toISOString(),
    };

    console.log('Submitting test score with body:', submissionBody);

    this.apiService.submitTestScore(this.userId, this.testId, totalPoints, totalHintsUsed).subscribe(
      response => {
        console.log('Test submitted successfully:', response);
        this.snackBar.open('Test odovzdaný úspešne!', 'Close', { duration: 7000 });
        this.resetTestState();
        this.router.navigate(['/test'], { state: { points: totalPoints } });
      },
      error => {
        console.error('Error submitting test:', error);
        this.snackBar.open('Failed to submit the test. Please try again.', 'Close', { duration: 7000 });
      }
    );
  }

  calculateExerciseScore(exercise: any): number {
    const basePoints = exercise.points;
    const hintPenalty = 2; // points to deduct per hint used
    const hintsUsed = exercise.hintsRevealed || 0;
    const bonusPoints = this.gamificationEnabled ? (this.timeLeft / this.convertTimeToSeconds(this.timeLimit)) * 5 : 0;
    return Math.max(0, Math.round(basePoints - hintsUsed * hintPenalty + bonusPoints));
  }

  playCorrectSound(): void {
    const audio = new Audio();
    audio.src = '../../assets/sounds/correct.mp3';
    audio.load();
    audio.play();
  }
}
