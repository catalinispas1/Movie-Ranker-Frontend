import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})

export class LoginViewComponent implements OnInit{
  
  loginForm: FormGroup = new FormGroup({})
  errorMessage: string | null = null
  displaySpinner: boolean = false

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router) {}

    private isTokenExpired(token: string): boolean {
      const decodedToken = jwtDecode(token) as { exp: number };
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate < new Date();
    }

  ngOnInit(): void {
    const token = localStorage.getItem('movie_ranker_auth');
    if (token && !this.isTokenExpired(token)) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    })
  }

  onLogin() {
    console.log("am primit cererea de login");    
    this.displaySpinner = true;
    const { username, password } = this.loginForm.value;
    this.errorMessage = ""
    this.loginService.loginUser(username, password).subscribe({
      next: (tokens) => {
        console.log("am primit cererea de login");
        console.log(tokens);
        console.log(tokens.accessToken);
        
        localStorage.setItem("movie_ranker_auth", tokens.accessToken)
        localStorage.setItem("movie_ranker_refresh", tokens.refreshToken)
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = "Invalid credentials. Please try again."
        } else {
          this.errorMessage = "An error occurred. Please try again."
        }
        this.displaySpinner = false
      }
    });
  }
  navigateToAuth() {
    this.router.navigate(['/authenticate'])
  }
}
