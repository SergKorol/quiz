import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-result-edit',
  templateUrl: './result-edit.component.html',
  styleUrls: ['./result-edit.component.css']
})
export class ResultEditComponent {
  title: string;
  result: Result;
  form: FormGroup;

  // this will be TRUE when editing an existing result,
  //   FALSE when creating a new one.
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private fb: FormBuilder) {

    // create an empty object from the Quiz interface
    this.result = <Result>{};

    this.createForm();

    const id = +this.activatedRoute.snapshot.params['id'];

    // quick & dirty way to check if we're in edit mode or not
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

    if (this.editMode) {

      // fetch the result from the server
      const url = this.baseUrl + 'api/result/' + id;
      this.http.get<Result>(url).subscribe(res => {
        this.result = res;
        this.title = 'Edit - ' + this.result.Text;

        this.updateForm();
      }, error => console.error(error));
    } else {
      this.result.QuizId = id;
      this.title = 'Create a new Result';
    }
  }

  createForm() {
    this.form = this.fb.group({
      Text: ['', Validators.required],
      MinValue: ['', Validators.pattern(/^\d*$/)],
      MaxValue: ['', Validators.pattern(/^\d*$/)]
    });
  }

  updateForm() {
    this.form.setValue({
      Text: this.result.Text,
      MinValue: this.result.MinValue,
      MaxValue: this.result.MaxValue
    });
  }

  onSubmit() {
    const url = this.baseUrl + 'api/result';

    const tempResult = <Result>{};
    tempResult.Text = this.form.value.Text;
    tempResult.MinValue = this.form.value.MinValue;
    tempResult.MaxValue = this.form.value.MaxValue;
    tempResult.QuizId = this.result.QuizId;

    if (this.editMode) {
      tempResult.Id = this.result.Id;

      this.http
        .post<Result>(url, tempResult)
        .subscribe(res => {
          const v = res;
          console.log('Result ' + v.Id + ' has been updated.');
          this.router.navigate(['quiz/edit', v.QuizId]);
        }, error => console.log(error));
    } else {
      this.http
        .put<Result>(url, tempResult)
        .subscribe(res => {
          const v = res;
          console.log('Result ' + v.Id + ' has been created.');
          this.router.navigate(['quiz/edit', v.QuizId]);
        }, error => console.log(error));
    }
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
isChanged(name: string) {
    const e = this.getFormControl(name);
    return e && (e.dirty || e.touched);
}

// returns TRUE if the FormControl is invalid after user changes
hasError(name: string) {
    const e = this.getFormControl(name);
    return e && (e.dirty || e.touched) && !e.valid;
}

  onBack() {
    this.router.navigate(['quiz/edit', this.result.QuizId]);
  }
}
