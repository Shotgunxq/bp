import { state } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  answerLocked: boolean = false;
  answerChecked: boolean = false;
  answerMessage: string = '';

  timeLimit: string = '00:00:00'; // HH:MM:SS
  timeLeft: number = 0; // in seconds
  timer: any;
  timerKey: string = 'test-writing-timer';
  exercisesKey: string = 'test-writing-exercises';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stateData = history.state.data;
    console.log(stateData);
    this.data = stateData;
    // if (stateData && stateData.exercises) {
    //   this.data = stateData.exercises;
    // } else {
    //   this.data = [];
    // }

    this.timeLimit = history.state.timeLimit;
    const savedTimeLeft = localStorage.getItem(this.timerKey);
    if (savedTimeLeft) {
      this.timeLeft = parseInt(savedTimeLeft, 10);
    } else {
      this.timeLeft = this.convertTimeToSeconds(this.timeLimit);
    }

    const savedExercises = localStorage.getItem(this.exercisesKey);
    if (savedExercises) {
      this.data = JSON.parse(savedExercises);
    }

    if (this.data.length > 0) {
      this.currentExercise = this.data[0];
    }

    this.startTimer();
    console.log('Data after initialization:', this.data);
  }

  ngOnDestroy(): void {
    this.stopTimer();
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
        alert('Time is up!');
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  prevExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
      this.currentExercise = this.data[this.currentExerciseIndex];
      console.log('Current Exercise after prev:', this.currentExercise);
      this.resetAnswer();
    }
  }

  nextExercise(): void {
    if (this.currentExerciseIndex < this.data.length - 1) {
      this.currentExerciseIndex++;
      this.currentExercise = this.data[this.currentExerciseIndex];
      console.log('Current Exercise after next:', this.currentExercise);
      this.resetAnswer();
    }
  }

  jumpToExercise(index: number): void {
    if (index >= 0 && index < this.data.length) {
      this.currentExerciseIndex = index;
      this.currentExercise = this.data[index];
      console.log('Current Exercise after jump:', this.currentExercise);
      this.resetAnswer();
    }
  }

  checkAnswer(): void {
    if (this.currentExercise) {
      this.currentExercise.userAnswer = this.userAnswer;

      if (this.userAnswer === this.currentExercise.answer) {
        this.answerMessage = 'Correct!';
      } else {
        this.answerMessage = 'Incorrect. Try again.';
      }
      this.answerChecked = true;
    }
  }

  resetAnswer(): void {
    this.userAnswer = '';
    this.answerChecked = false;
    this.answerMessage = '';
  }
}
