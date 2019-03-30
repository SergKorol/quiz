import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  quiz: Quiz;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string) {
    // this.quiz = <Quiz>{};
    const id = +this.activatedRoute.snapshot.params['id'];
    console.log(id);
    if (id) {
      const url = this.baseUrl + 'api/quiz/' + id;
      this.http.get<Quiz>(url).subscribe(result => {this.quiz = result; }, error => console.error(error));
    } else {
      console.log('Invalid id: routing back to home...');
      this.router.navigate(['home']);
    }
   }

   onEdit() {
    this.router.navigate(['quiz/edit', this.quiz.Id]);
}


onDelete() {
  if (confirm('Do you really want to delete this quiz?')) {
    const url = this.baseUrl + 'api/quiz/' + this.quiz.Id;
    this.http.delete(url).subscribe(res => {
      console.log('Quiz ' + this.quiz.Id + ' has been deleted');
      this.router.navigate(['home']);
    }, error => console.error(error));
  }
}

  ngOnInit() {
  }

}
