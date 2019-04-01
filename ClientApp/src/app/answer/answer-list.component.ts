import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, Input, Inject, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-answer-list',
  templateUrl: './answer-list.component.html',
  styleUrls: ['./answer-list.component.css']
})
export class AnswerListComponent implements OnChanges {

  @Input() question: Question;
  answers: Answer[];
  title: string;

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private router: Router) {
    this.answers = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['question'] !== 'undefined') {
      // retrieve the question variable change info
      const change = changes['question'];
      // only perform the task if the value has been changed
      if (!change.isFirstChange()) {
        // execute the Http request and retrieve the result
        this.loadData();
      }

    }
  }
  loadData() {
    const url = this.baseUrl + 'api/answer/All/' + this.question.Id;
    this.http.get<Answer[]>(url).subscribe(res => {
      this.answers = res;
    }, error => console.log(error));
  }

  onCreate() {
    this.router.navigate(['/answer/create', this.question.Id]);
  }

  onEdit(answer: Answer) {
    this.router.navigate(['/answer/edit', answer.Id]);
  }

  onDelete(answer: Answer) {
    if (confirm('Do you really want to delete this answer?')) {
      const url = this.baseUrl + 'api/answer/' + answer.Id;
      this.http.delete(url).subscribe(res => {
        console.log('Answer ' + answer.Id + ' has been deleted');
        // refresh the question list
        this.loadData();
      }, error => console.log(error));
    }
  }
}
