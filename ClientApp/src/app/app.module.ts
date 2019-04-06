import { RegisterComponent } from './user/register.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { QuizSearchComponent } from './quiz/quiz-search.component';
import { ResultListComponent } from './result/result-list.component';
import { AnswerListComponent } from './answer/answer-list.component';
import { QuestionEditComponent } from './question/question-edit.component';
import { QuestionListComponent } from './question/question-list.component';
import { QuizEditComponent } from './quiz/quiz-edit.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizListComponent } from './quiz/quiz-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AnswerEditComponent } from './answer/answer-edit.component';
import { ResultEditComponent } from './result/result-edit.component';
import { AuthResponseInterceptor } from './services/auth.response.interceptor';
import { LoginFacebookComponent } from './login/login.facebook.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    QuizListComponent,
    QuizComponent,
    QuizEditComponent,
    AboutComponent,
    LoginComponent,
    PagenotfoundComponent,
    QuestionListComponent,
    QuestionEditComponent,
    AnswerListComponent,
    AnswerEditComponent,
    ResultListComponent,
    ResultEditComponent,
    QuizSearchComponent,
    RegisterComponent,
    LoginFacebookComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'quiz/create', component: QuizEditComponent },
      { path: 'quiz/edit/:id', component: QuizEditComponent },
      { path: 'quiz/:id', component: QuizComponent },
      { path: 'question/create/:id', component: QuestionEditComponent },
      { path: 'question/edit/:id', component: QuestionEditComponent },
      { path: 'answer/create/:id', component: AnswerEditComponent },
      { path: 'answer/edit/:id', component: AnswerEditComponent },
      { path: 'result/create/:id', component: ResultEditComponent },
      { path: 'result/edit/:id', component: ResultEditComponent },
      { path: 'about', component: AboutComponent },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '**', component: PagenotfoundComponent }
    ])
  ],
  providers: [AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthResponseInterceptor,
      multi: true

    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
