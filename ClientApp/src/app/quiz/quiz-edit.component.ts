import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isDefaultChangeDetectionStrategy } from '@angular/core/src/change_detection/constants';

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.css']
})
export class QuizEditComponent implements OnInit {

  title: string;
  quiz: Quiz;
  form: FormGroup;

  // this will be TRUE when editing an existing quiz,
  // FALSE when creating a new one.

  editMode: boolean;



  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string,
              private fb: FormBuilder) {
                this.quiz = <Quiz>{};
                // initialize the form
                this.createForm();
                const id = +this.activatedRoute.snapshot.params['id'];
                if (id) {
                  this.editMode = true;
                  // fetch the quiz from the server
                  const url = this.baseUrl + 'api/quiz/' + id;
                  this.http.get<Quiz>(url).subscribe(res => {
                    this.quiz = res;
                    this.title = 'Edit - ' + this.quiz.Title;
                    // update the form with the quiz value
                    this.updateForm();
                  // tslint:disable-next-line: no-shadowed-variable
                  }, error => console.error(error));
                } else {
                  this.editMode = false;
                  this.title = 'Create a new Quiz';
                }
               }
onSubmit() {
  // build a temporary quiz object from form values
  const tempQuiz = <Quiz>{};
  tempQuiz.Title = this.form.value.Title;
  tempQuiz.Description = this.form.value.Description;
  tempQuiz.Text = this.form.value.Text;

  const url = this.baseUrl + 'api/quiz';

  if (this.editMode) {
    // don't forget to set the tempQuiz Id,
    // otherwise the EDIT would fail!
    tempQuiz.Id = this.quiz.Id;
    this.http.post<Quiz>(url, tempQuiz).subscribe(res => {
      const v = res;
      console.log('Quiz ' + v.Id + ' has been updated.');
      this.router.navigate(['home']);
    // tslint:disable-next-line: no-shadowed-variable
    }, error => console.error(error));
  } else {
    this.http.put<Quiz>(url, tempQuiz).subscribe(res => {
      const q = res;
      console.log('Quiz ' + q.Id + ' has been created.');
      this.router.navigate(['home']);
    // tslint:disable-next-line: no-shadowed-variable
    }, error => console.error(error));
  }
}

createForm() {
  this.form = this.fb.group({
    Title: ['', Validators.required],
    Description: '',
    Text: ''
  });
}

updateForm() {
  this.form.setValue({
    Title: this.quiz.Title,
    Description: this.quiz.Description || '',
    Text: this.quiz.Title || ''
  });
}

// retrieve a FormControl
getFormControl(name: string) {
  return this.form.get(name);
}

// returns TRUE if the FormControl is valid
isValid(name: string) {
  const e = this.getFormControl(name);
  return e && e.valid;
}

// returns TRUE if the FormControl has been changed
inChanged(name: string) {
  const e = this.getFormControl(name);
  return e && (e.dirty || e.touched);
}

// returns TRUE if the FormControl is invalid after user changes
hasError(name: string) {
  const e = this.getFormControl(name);
  return e && (e.dirty || e.touched) && !e.valid;
}

onBack() {
  this.router.navigate(['home']);
}

  ngOnInit() {
  }

}
