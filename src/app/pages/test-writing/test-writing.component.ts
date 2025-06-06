import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.services';
import { TimeUpDialogComponent } from '../../components/modals/dialogs/time-up-dialog/time-up-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InfoModalTestWritingComponent } from '../../components/modals/dialogs/info-modal-test-writing/info-modal-test-writing.component';
import { filter, take } from 'rxjs';

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

  userId: string = '1'; // Placeholder user ID
  gamificationEnabled: boolean = false;
  currentScore: number = 0;
  animateScore: boolean = false; // Used to trigger score animation

  testId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // 1) Fetch current user
    this.apiService
      .getCurrentUser()
      .pipe(
        filter(u => !!u),
        take(1)
      )
      .subscribe(u => (this.userId = u.userId));

    // 2) Grab testId, data array, and gamification flag from navigation state
    const nav = history.state || {};
    this.testId = nav.testId ?? 0;
    this.data = nav.data || [];
    this.gamificationEnabled = !!nav.gamification; // true/false

    // 3) Initialize timer
    this.timeLimit = nav.timeLimit || '00:30:00';
    const savedTimeLeft = localStorage.getItem(this.timerKey);
    if (savedTimeLeft) {
      this.timeLeft = parseInt(savedTimeLeft, 10);
    } else {
      this.timeLeft = this.convertTimeToSeconds(this.timeLimit);
    }

    // 4) Initialize each exercise object
    if (this.data.length > 0) {
      this.data.forEach(exercise => {
        exercise.answerLocked = exercise.answerLocked || false;
        exercise.points = exercise.points || 0;
        exercise.scoreAwarded = exercise.scoreAwarded || false;
        exercise.hintsRevealed = exercise.hintsRevealed || 0;
        exercise.timeLeftWhenAnswered = exercise.timeLeftWhenAnswered || 0;
        exercise.pointsAwardedSoFar = exercise.pointsAwardedSoFar || 0;
      });

      // 5) Restore from localStorage if present
      const savedExercises = localStorage.getItem(this.exercisesKey);
      if (savedExercises) {
        this.data = JSON.parse(savedExercises);
        // Ensure all needed fields still exist
        this.data.forEach(exercise => {
          exercise.hintsRevealed = exercise.hintsRevealed || 0;
          exercise.timeLeftWhenAnswered = exercise.timeLeftWhenAnswered || 0;
          exercise.pointsAwardedSoFar = exercise.pointsAwardedSoFar || 0;
          exercise.scoreAwarded = exercise.scoreAwarded || false;
          exercise.answerLocked = exercise.answerLocked || false;
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
    const [h, m, s] = time.split(':').map(Number);
    return h * 3600 + m * 60 + s;
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

        // Open “Time’s Up” dialog
        const dialogRef = this.dialog.open(TimeUpDialogComponent);
        dialogRef.afterClosed().subscribe(() => {
          this.resetTestState();
          this.router.navigate(['/menu']);
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    if (!this.currentExercise) return;
    const idx = this.currentExerciseIndex;

    this.data[idx].userAnswer = this.userAnswer;
    this.data[idx].hintsRevealed = this.currentExercise.hintsRevealed;
    this.data[idx].timeLeftWhenAnswered = this.currentExercise.timeLeftWhenAnswered;
    this.data[idx].pointsAwardedSoFar = this.currentExercise.pointsAwardedSoFar;
    this.data[idx].scoreAwarded = this.currentExercise.scoreAwarded;
    this.data[idx].answerLocked = this.currentExercise.answerLocked;

    localStorage.setItem(this.exercisesKey, JSON.stringify(this.data));
  }

  loadUserAnswer(): void {
    if (this.currentExercise && this.currentExercise.userAnswer != null) {
      this.userAnswer = this.currentExercise.userAnswer;
    } else {
      this.userAnswer = '';
    }
    // Always clear feedback on exercise switch
    this.answerChecked = false;
    this.answerMessage = '';
  }

  prevExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.saveUserAnswers();
      this.currentExerciseIndex--;
      this.currentExercise = this.data[this.currentExerciseIndex];
      this.loadUserAnswer();
    }
  }

  nextExercise(): void {
    if (this.currentExerciseIndex < this.data.length - 1) {
      this.saveUserAnswers();
      this.currentExerciseIndex++;
      this.currentExercise = this.data[this.currentExerciseIndex];
      this.loadUserAnswer();
    }
  }

  jumpToExercise(index: number): void {
    if (index >= 0 && index < this.data.length) {
      this.saveUserAnswers();
      this.currentExerciseIndex = index;
      this.currentExercise = this.data[index];
      this.loadUserAnswer();
    }
  }

  // --------------------------------------------------------------------------
  // HINTS (unchanged from your original):
  // --------------------------------------------------------------------------
  revealHint(): void {
    if (this.currentExercise && Array.isArray(this.currentExercise.hints) && this.currentExercise.hints.length > 0) {
      const totalHints = this.currentExercise.hints.length;
      if (this.currentExercise.hintsRevealed < totalHints) {
        this.currentExercise.hintsRevealed++;
        // Persist updated hintsRevealed
        localStorage.setItem(this.exercisesKey, JSON.stringify(this.data));
      }
    }
  }

  /**
   * Called when the user clicks “Odpovedať” or “Zmeniť odpoveď.”
   * • Always locks/unlocks the input.
   * • Always awards base points for a correct answer (once), regardless of gamification.
   * • Only shows “Correct!”/“Incorrect.” and sets isCorrect/isWrong when gamificationEnabled===true.
   */
  lockInAnswer(): void {
    if (!this.currentExercise) return;

    // If already locked, unlock so the user can edit again:
    if (this.currentExercise.answerLocked) {
      this.currentExercise.answerLocked = false;

      if (this.gamificationEnabled) {
        this.currentExercise.isCorrect = false;
        this.currentExercise.isWrong = false;
        this.answerMessage = '';
        this.answerChecked = false;
      }
      return;
    }

    // Otherwise, lock in the answer:
    this.currentExercise.answerLocked = true;
    this.currentExercise.userAnswer = (this.userAnswer || '').trim();

    const userAns = this.currentExercise.userAnswer;
    const correctAns = String(this.currentExercise.correct_answer || '').trim();
    const isActuallyCorrect = userAns !== '' && userAns === correctAns;

    // — Always award base points once if correct (regardless of gamification flag)
    if (isActuallyCorrect && !this.currentExercise.scoreAwarded) {
      const earnedBase = this.currentExercise.points || 0;
      this.currentScore += earnedBase;
      this.currentExercise.pointsAwardedSoFar = earnedBase;
      this.currentExercise.scoreAwarded = true;
    }

    // — If gamification is ON, also apply full scoring and show feedback:
    if (this.gamificationEnabled) {
      if (isActuallyCorrect) {
        // FULL gamified scoring: snapshot time, recalc with hints + bonus, replace basePoints
        this.currentExercise.timeLeftWhenAnswered = this.timeLeft;

        const fullScore = this.calculateAndStoreScore(this.currentExercise);
        const basePoints = this.currentExercise.points || 0;
        this.currentScore -= basePoints;
        this.currentScore += fullScore;
        this.currentExercise.scoreAwarded = true;

        // Visual feedback for correct
        this.currentExercise.isCorrect = true;
        this.currentExercise.isWrong = false;
        this.answerMessage = 'Správne!';

        // Only play sound & animate on correct
        this.playCorrectSound();
        this.animateScore = true;
        setTimeout(() => (this.animateScore = false), 1000);
      } else {
        // Incorrect: show “Nesprávne” but do NOT touch score or animate
        this.currentExercise.isCorrect = false;
        this.currentExercise.isWrong = true;
        this.answerMessage = 'Nesprávne. Skús znova.';
        // ← no animateScore here
      }

      this.answerChecked = true;
    }

    // If gamification is OFF, we already gave just the base points above, but we do NOT set
    // isCorrect/isWrong/answerMessage → the user sees no feedback either way.

    this.saveUserAnswers();
  }

  /**
   * Computes gamified score for one exercise:
   *  • basePoints   = exercise.points
   *  • hintPenalty  = 2 × hintsRevealed
   *  • time bonus   = (timeLeftWhenAnswered / totalTime) × 5
   * Rounds to nearest integer (floored at 0) and stores that in exercise.pointsAwardedSoFar.
   */
  calculateAndStoreScore(exercise: any): number {
    const basePoints = exercise.points || 0;
    const hintPenalty = 2 * (exercise.hintsRevealed || 0);
    const timeLeftSnap = exercise.timeLeftWhenAnswered || 0;
    const totalTimeSeconds = this.convertTimeToSeconds(this.timeLimit);
    const bonusFactor = (timeLeftSnap / totalTimeSeconds) * 5;

    const rawScore = basePoints - hintPenalty + bonusFactor;
    const finalScore = Math.max(0, Math.round(rawScore));

    exercise.pointsAwardedSoFar = finalScore;
    return finalScore;
  }

  submitTest(): void {
    // (unchanged) Summation logic simply sums pointsAwardedSoFar
    let totalPoints = 0;
    let totalHints = 0;

    this.data.forEach(ex => {
      totalPoints += ex.pointsAwardedSoFar || 0;
      totalHints += ex.hintsRevealed || 0;
    });

    const answers = this.data.map(ex => ({
      exercise_id: ex.exercise_id,
      user_answer: ex.userAnswer || '',
    }));

    const payload = {
      user_id: this.userId,
      test_id: this.testId,
      submitted_at: new Date().toISOString(),
      total_score: totalPoints,
      total_hints: totalHints,
      answers,
    };

    this.apiService.submitTestScore(payload).subscribe({
      next: () => {
        this.snackBar.open('Test odovzdaný úspešne! Výsledok môžete vidieť na stranke "Napísané testy".', 'Zavrieť', { duration: 13000 });
        this.resetTestState();
        this.router.navigate(['/menu'], { state: { points: totalPoints } });
      },
      error: err => {
        console.error('Error submitting test:', err);
        this.snackBar.open('Nepodarilo sa odovzdať test. Skús to znova.', 'Zavrieť', { duration: 7000 });
      },
    });
  }

  playCorrectSound(): void {
    const audio = new Audio();
    audio.src = '../../assets/sounds/correct.mp3';
    audio.load();
    audio.play();
  }

  openInfoDialog(): void {
    this.dialog.open(InfoModalTestWritingComponent, {
      width: '500px',
      data: {},
    });
  }
}
