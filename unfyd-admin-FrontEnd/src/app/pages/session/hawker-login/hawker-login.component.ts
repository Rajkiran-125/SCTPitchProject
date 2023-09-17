import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { slides } from 'src/app/global/json-data';
@Component({
  selector: 'app-hawker-login',
  templateUrl: './hawker-login.component.html',
  styleUrls: ['./hawker-login.component.scss']
})
export class HawkerLoginComponent implements OnInit {
  loader: boolean = false;
  form: FormGroup;
  userMsg: string;
  submittedForm = false;
  hide = true;
  slides: any = [];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows : false,
    dots : true,
    autoplay : true
  };


  constructor(
    private router: Router,
    private common: CommonService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    ) {
    Object.assign(this, { slides });
  }

  ngOnInit(): void {
    this.slides = slides;
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if(this.auth.isLoggedIn()){
      this.router.navigate(['dashboard']) 
    }

    this.auth.user$.subscribe(res=>{
      this.loader = false;
      this.userMsg = res;
      if(this.userMsg == 'Password Changed Sucessfully'){
        this.common.snackbar(this.userMsg,'success');
      } else if(this.userMsg == ''){

      } else{
      this.common.snackbar(this.userMsg,'error');
      }
    })

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  submit() {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.loader = false;
      return;
    }

    var obj = {
      data: {   
          flag: 'AUTHENTICATE', 
          username: this.form.value.username,    
          password: this.common.setEncrypted('123456$#@$^@1ERF', this.form.value.password)
      }    
    }
    this.auth.login(obj, "hawkerlogin")
    this.auth.hawker = true;
  }


}
