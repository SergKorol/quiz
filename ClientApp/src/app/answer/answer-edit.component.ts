import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-answer-edit',
  templateUrl: './answer-edit.component.html',
  styleUrls: ['./answer-edit.component.css']
})
export class AnswerEditComponent {
  title: string;
  answer: Answer;

  // this will be TRUE when editing an existing question,
  //   FALSE when creating a new one.
  editMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      @Inject('BASE_URL') private baseUrl: string) {

      // create an empty object from the Quiz interface
      this.answer = <Answer>{};

      const id = +this.activatedRoute.snapshot.params['id'];

      // quick & dirty way to check if we're in edit mode or not
      this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

      if (this.editMode) {

          // fetch the answer from the server
          const url = this.baseUrl + 'api/answer/' + id;
          this.http.get<Answer>(url).subscribe(result => {
              this.answer = result;
              this.title = 'Edit - ' + this.answer.Text;
          }, error => console.error(error));
      } else {
          this.answer.QuestionId = id;
          this.title = 'Create a new Answer';
      }
  }

  onSubmit(answer: Answer) {
      const url = this.baseUrl + 'api/answer';

      if (this.editMode) {
          this.http
              .post<Answer>(url, answer)
              .subscribe(res => {
                  const v = res;
                  console.log('Answer ' + v.Id + ' has been updated.');
                  this.router.navigate(['question/edit', v.QuestionId]);
              }, error => console.log(error));
      } else {
          this.http
              .put<Answer>(url, answer)
              .subscribe(res => {
                  const v = res;
                  console.log('Answer ' + v.Id + ' has been created.');
                  this.router.navigate(['question/edit', v.QuestionId]);
              }, error => console.log(error));
      }
  }

  onBack() {
      this.router.navigate(['question/edit', this.answer.QuestionId]);
  }

}
