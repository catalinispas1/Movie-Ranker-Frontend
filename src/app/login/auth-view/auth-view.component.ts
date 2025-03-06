import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.css']
})
export class AuthViewComponent implements OnInit{

  authForm: FormGroup = new FormGroup({})
  errorMessage: string | null = null
  displaySpinner: boolean = false

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    })
  }

  onAuth() {
    const { username, password } = this.authForm.value;    
    this.displaySpinner = true;
    this.loginService.authUser(username, password).subscribe({
      next: (tokenResponse: any) => {
        
        const parsedResponse = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;

        const authToken = parsedResponse.accessToken;
        const refreshTOiken = parsedResponse.refreshToken;
        localStorage.setItem("movie_ranker_refresh", refreshTOiken)
        localStorage.setItem("movie_ranker_auth", authToken)
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      },
      error: (error) => {
        try {
          const errorObj = error.error
          if (errorObj && errorObj.message) {
            this.errorMessage = errorObj.message;  
          } else {
            this.errorMessage = "An unknown error occurred.";
          }
          this.displaySpinner = false
        } catch (e) {
          this.errorMessage = "An error occurred while processing the error response.";
        }
      }
    })
  }

  navigateToLogin() {
    this.router.navigate(['/login'])
  }
}
