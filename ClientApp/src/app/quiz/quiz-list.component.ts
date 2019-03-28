import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {

  title: string;
  selectedQuiz: Quiz;
  quizzes: Quiz[];


  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.title = 'Latest Quizzes';
    const url = baseUrl + 'api/quiz/Latest/';
    this.http.get<Quiz[]>(url).subscribe(result => {
      this.quizzes = result;
    }, error => console.error(error));
   }

   onSelect(quiz: Quiz) {
    this.selectedQuiz = quiz;
    console.log('quiz with id ' + this.selectedQuiz.Id + ' has been selected');
   }

  ngOnInit() {
  }

}
