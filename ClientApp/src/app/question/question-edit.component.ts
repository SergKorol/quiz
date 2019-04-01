import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit {

  title: string;
  question: Question;
  // this will be TRUE when editing an existing question,
  // FALSE when creating a new one.
  editMode: boolean;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string ) {
                // create an empty object from the Quiz interface
                this.question = <Question>{};
                const id = +this.activatedRoute.params['id'];
                // check if we're in edit mode or not
                this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');

                if (this.editMode) {
                  // fetch the quiz from the server
                  const url = this.baseUrl + 'api/question/' + id;
                  this.http.get<Question>(url).subscribe(res => {
                    this.question = res;
                    this.title = 'Edit - ' + this.question.Text;
                  }, error => console.log(error));
                } else {
                  this.question.QuizId = id;
                  this.title = 'Create new Question';
                }
               }
onSubmit(question: Question) {
  const url = this.baseUrl + 'api/question';
  if (this.editMode) {
    this.http.post<Question>(url, question).subscribe(res => {
      const v = res;
      console.log('Question ' + v.Id + ' has been updated');
      this.router.navigate(['quiz/edit', v.QuizId]);
    }, error => console.log(error));
  } else {
    this.http.put<Question>(url, question).subscribe(res => {
      const v = res;
      console.log('Question ' + v.Id + ' has been created.');
      this.router.navigate(['quiz/edit', v.QuizId]);
    }, error => console.log(error));
  }
}

onBack() {
  this.router.navigate(['quiz/edit', this.question.QuizId]);
}

  ngOnInit() {
  }

}
