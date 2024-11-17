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
  //TODO:
  testId: number = 1; // Replace with actual test ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const stateData = history.state.data;
    this.data = stateData || [];

    // Initialize each exercise with answerLocked property
    this.data.forEach(exercise => {
      exercise.answerLocked = exercise.answerLocked || false;
      if (typeof exercise.points === 'undefined') {
        console.error('Missing points in exercise:', exercise);
        exercise.points = 0; // Assign a default value, or handle as an error
      }
    });
    

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
      this.loadUserAnswer();
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

  checkAnswer(): void {
    if (this.currentExercise) {
      this.currentExercise.userAnswer = this.userAnswer;

      if (this.userAnswer === this.currentExercise.answer) {
        this.answerMessage = 'Correct!';
      } else {
        this.answerMessage = 'Incorrect. Try again.';
      }
      this.answerChecked = true;
      this.saveUserAnswers();
    }
  }

  resetAnswer(): void {
    this.userAnswer = '';
    this.answerChecked = false;
    this.answerMessage = '';
  }

  saveUserAnswers(): void {
    if (this.currentExercise) {
      this.data[this.currentExerciseIndex].userAnswer = this.userAnswer;
      // Ensure all necessary fields, including 'points', are stored
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

  toggleAnswerLock(): void {
    if (this.currentExercise) {
      this.currentExercise.answerLocked = !this.currentExercise.answerLocked;
      this.saveUserAnswers();
    }
  }

  submitTest(): void {
    let totalPoints = 0;
  
    const savedExercises = localStorage.getItem(this.exercisesKey);
    if (savedExercises) {
      this.data = JSON.parse(savedExercises);
    }
  
    for (const exercise of this.data) {
      console.log('Exercise:', exercise); // Debug log
      if (exercise.userAnswer === exercise.answer) {
        const exercisePoints = exercise.points || 0; // Fallback to 0 if points is missing
        totalPoints += exercisePoints;
        console.log(`Added ${exercisePoints} points for exercise`, exercise);
      }
    }
  
    // Log the payload before posting
    const body = {
      user_id: this.userId,
      test_id: this.testId,
      points: totalPoints,
      timestamp: new Date().toISOString(),
    };
  
    console.log('Submitting test score with body:', body);
  
    this.apiService.submitTestScore(this.userId, this.testId, totalPoints).subscribe(
      response => {
        console.log('Test submitted successfully:', response);
      },
      error => {
        console.error('Error submitting test:', error);
        if (error.error) {
          console.error('Error details:', error.error); // Log server-provided details
        }
      }
    );
  }
  
}
