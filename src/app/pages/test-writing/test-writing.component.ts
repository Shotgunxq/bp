import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/apiServices';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const stateData = history.state.data;
    this.data = stateData || [];

    this.timeLimit = history.state.timeLimit || '00:30:00'; // Default time limit
    const savedTimeLeft = localStorage.getItem(this.timerKey);

    if (savedTimeLeft) {
      this.timeLeft = parseInt(savedTimeLeft, 10);
    } else {
      this.timeLeft = this.convertTimeToSeconds(this.timeLimit);
    }

    if (this.data.length > 0) {
      this.data.forEach((exercise) => {
        exercise.answerLocked = exercise.answerLocked || false;
        exercise.points = exercise.points || 0; // Default points if missing
      });

      const savedExercises = localStorage.getItem(this.exercisesKey);
      if (savedExercises) {
        this.data = JSON.parse(savedExercises);
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
        alert('Time is up! The test has been cleared.');
        this.resetTestState();
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

  toggleAnswerLock(): void {
    if (this.currentExercise) {
      this.currentExercise.answerLocked = !this.currentExercise.answerLocked;
      this.saveUserAnswers();
    }
  }

  checkAnswer(): void {
    if (this.currentExercise) {
      this.currentExercise.userAnswer = this.userAnswer;

      if (this.userAnswer.trim() === this.currentExercise.answer.trim()) {
        this.answerMessage = 'Correct!';
      } else {
        this.answerMessage = 'Incorrect. Try again.';
      }
      this.answerChecked = true;
      this.saveUserAnswers();
    }
  }

  submitTest(): void {
    let totalPoints = 0;

    this.data.forEach((exercise) => {
      if (exercise.userAnswer === exercise.answer) {
        totalPoints += exercise.points || 0; // Add points for correct answers
      }
    });

    const body = {
      user_id: this.userId,
      test_id: this.testId,
      points: totalPoints,
      timestamp: new Date().toISOString(),
    };

    console.log('Submitting test score with body:', body);

    this.apiService.submitTestScore(this.userId, this.testId, totalPoints).subscribe(
      (response) => {
        console.log('Test submitted successfully:', response);
        this.resetTestState();
        this.router.navigate(['/result'], { state: { points: totalPoints } });
      },
      (error) => {
        console.error('Error submitting test:', error);
      }
    );
  }
}
