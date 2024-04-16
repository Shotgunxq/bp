import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise, binomialProbabilityRandom } from '../../services/binomialProbability';
@Component({
  selector: 'app-test-writing',
  templateUrl: './test-writing.component.html',
  styleUrls: ['./test-writing.component.scss'],
})
export class TestWritingComponent implements OnInit {
  data: any;
  currentExerciseIndex: number = 0;
  currentExercise: any;
  userAnswer: string = '';
  answerChecked: boolean = false;
  answerMessage: string = '';

  // generatedExercises: Exercise[] = []; // Property to hold generated exercises
  // currentGeneratedExerciseIndex: number = 0;
  // currentGeneratedExercise: Exercise | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.data = this.route.snapshot.data["data"];
    this.data = history.state.data;

    const generatedExercises: Exercise[] = binomialProbabilityRandom();
    console.log('Generated exercises:', generatedExercises);

    if (this.data && this.data.easy && this.data.easy.length > 0) {
      // Combine existing exercises with generated exercises using the spread operator
      this.data.easy = [...this.data.easy, ...generatedExercises];
      this.currentExercise = this.data.easy[0];
    } else {
      // If there are no fetched exercises, use only the generated exercises
      this.data = { easy: generatedExercises };
      this.currentExercise = this.data.easy[0];
    }

    console.log('Data writing concated:', this.data);
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
      // Save the user's answer to the current exercise
      this.currentExercise.userAnswer = this.userAnswer;

      // Set answer checked status and message
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
