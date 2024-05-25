import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { binomialExercise, binomialProbabilityRandom } from '../../services/binomialProbability';
import { hypergeometricExercises, hypergeometricProbabilityRandom } from '../../services/hypergeometricProbality';
import { geometricExercise, geometricProbabilityRandom } from '../../services/geometricProbability';

@Component({
  selector: 'app-test-writing',
  templateUrl: './test-writing.component.html',
  styleUrls: ['./test-writing.component.scss'],
})
export class TestWritingComponent implements OnInit, OnDestroy {
  data: any;
  currentExerciseIndex: number = 0;
  currentExercise: any;
  userAnswer: string = '';
  answerChecked: boolean = false;
  answerMessage: string = '';

  timeLimit: string = '00:00:00'; // HH:MM:SS
  timeLeft: number = 0; // in seconds
  timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.data = history.state.data;
    this.timeLimit = history.state.timeLimit; // time limit as string

    this.timeLeft = this.convertTimeToSeconds(this.timeLimit);
    this.startTimer();

    const generatedExercisesBinominal: binomialExercise[] = binomialProbabilityRandom();
    const generatedExercisesHypergeometric: hypergeometricExercises[] = hypergeometricProbabilityRandom();
    const generatedExercisesGeometric: geometricExercise[] = geometricProbabilityRandom();

    console.log('Binominal exercises:', generatedExercisesBinominal);
    console.log('Hypergeometric exercises:', generatedExercisesHypergeometric);
    console.log('Geometric exercises:', generatedExercisesGeometric);

    if (this.data && this.data.easy && this.data.easy.length > 0) {
      this.data.easy = [...this.data.easy, ...generatedExercisesBinominal, ...generatedExercisesHypergeometric, ...generatedExercisesGeometric];
      this.currentExercise = this.data.easy[0];
    } else {
      this.data = { easy: [...generatedExercisesBinominal, ...generatedExercisesHypergeometric, ...generatedExercisesGeometric] };
      this.currentExercise = this.data.easy[0];
    }

    console.log('Data writing concated:', this.data);
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
      } else {
        this.timeLeft = 0;
        this.stopTimer();
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
      this.currentExercise = this.data.easy[this.currentExerciseIndex];
      this.resetAnswer();
    }
  }

  nextExercise(): void {
    if (this.currentExerciseIndex < this.data.easy.length - 1 && this.data.easy.length > 1) {
      this.currentExerciseIndex++;
      this.currentExercise = this.data.easy[this.currentExerciseIndex];
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

  jumpToExercise(index: number): void {
    if (index >= 0 && index < this.data.easy.length) {
      this.currentExerciseIndex = index;
      this.currentExercise = this.data.easy[index];
      this.resetAnswer();
    }
  }
}
