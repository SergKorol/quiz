import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Login.ExternalprovidersComponent } from './login.externalproviders.component';

describe('Login.ExternalprovidersComponent', () => {
  let component: Login.ExternalprovidersComponent;
  let fixture: ComponentFixture<Login.ExternalprovidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Login.ExternalprovidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Login.ExternalprovidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
