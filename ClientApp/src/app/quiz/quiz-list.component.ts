import { Router } from '@angular/router';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  @Input() class: string;
  title: string;
  selectedQuiz: Quiz;
  quizzes: Quiz[];
  // http: HttpClient;
  // baseUrl: string;


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private router: Router) {

    this.http = http;
    this.baseUrl = baseUrl;
   }

   onSelect(quiz: Quiz) {
    this.selectedQuiz = quiz;
    console.log('quiz with id ' + this.selectedQuiz.Id + ' has been selected');
    this.router.navigate(['quiz', this.selectedQuiz.Id]);
   }

  ngOnInit() {
    console.log('QuizListComponent' + ' instantiated with the following class: ' + this.class);
    let url = this.baseUrl + 'api/quiz/';

    switch (this.class) {
        case 'latest':
        default:
        this.title = 'Latest Quizzes';
        url += 'Latest/';
        break;
        case 'byTytle':
        this.title = 'Quizzes by Ttile';
        url += 'ByTitle/';
        break;
        case 'Random':
        this.title = 'Random Quizzes';
        url += 'Random/';
        break;
      }

      this.http.get<Quiz[]>(url).subscribe(result => {
          this.quizzes = result;
        }, error => console.error(error));
  }

}
