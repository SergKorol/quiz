import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { error } from 'util';

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.css']
})
export class QuizEditComponent implements OnInit {

  title: string;
  quiz: Quiz;

  // this will be TRUE when editing an existing quiz,
  // FALSE when creating a new one.

  editMode: boolean;



  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string) {
                this.quiz = <Quiz>{};
                const id = +this.activatedRoute.snapshot.params['id'];
                if (id) {
                  this.editMode = true;
                  // fetch the quiz from the server
                  const url = this.baseUrl + 'api/quiz/' + id;
                  this.http.get<Quiz>(url).subscribe(res => {
                    this.quiz = res;
                    this.title = 'Edit - ' + this.quiz.Title;
                  // tslint:disable-next-line: no-shadowed-variable
                  }, error => console.error(error));
                } else {
                  this.editMode = false;
                  this.title = 'Create a new Quiz';
                }
               }
onSubmit(quiz: Quiz) {
  const url = this.baseUrl + 'api/quiz';

  if (this.editMode) {
    this.http.post<Quiz>(url, quiz).subscribe(res => {
      const v = res;
      console.log('Quiz ' + v.Id + ' has been updated.');
      this.router.navigate(['home']);
    // tslint:disable-next-line: no-shadowed-variable
    }, error => console.error(error));
  } else {
    this.http.put<Quiz>(url, quiz).subscribe(res => {
      const q = res;
      console.log('Quiz ' + q.Id + ' has been created.');
      this.router.navigate(['home']);
    // tslint:disable-next-line: no-shadowed-variable
    }, error => console.error(error));
  }
}

onBack() {
  this.router.navigate(['home']);
}

  ngOnInit() {
  }

}
