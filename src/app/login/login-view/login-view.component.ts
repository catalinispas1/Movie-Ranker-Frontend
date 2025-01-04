import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})

export class LoginViewComponent implements OnInit{
  
  loginForm: FormGroup = new FormGroup({})
  errorMessage: string | null = null

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    })
  }

  onLogin() {
    const { username, password } = this.loginForm.value;
    this.errorMessage = ""
    this.loginService.loginUser(username, password).subscribe({
      next: (token) => {
        localStorage.setItem("movie_ranker_auth", token)
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = "Invalid credentials. Please try again."
        } else {
          this.errorMessage = "An error occurred. Please try again."
        }
      }
    });
  }
  navigateToAuth() {
    this.router.navigate(['/authenticate'])
  }
}
