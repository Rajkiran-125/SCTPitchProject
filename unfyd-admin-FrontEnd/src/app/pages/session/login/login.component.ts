import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import {Md5} from 'ts-md5';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/global/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  md5 = new Md5();
  loader: boolean = false;
  form: FormGroup;
  UserForm: FormGroup;
  userMsg: string;
  submittedForm = false;
  hide = true;
  urlParam : any = {};
  branding: any;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows : false,
    dots : true,
    autoplay : true
  };
  IsForgotPassword: boolean = false;
  SendOtpToEmail: boolean = false;
  maskedEmailId: any;
  VerifyOtp: boolean = false;
  LoginForm: boolean = true;
  CloseForgetPassword: boolean  = false;
  FinalResetPassword: boolean = false;
  formChangePassword: FormGroup;
  passwordPolicyapi: any;
  securitycomplainceresponse: boolean = false;
  PasswordHistoryArr: any = [];
  decrptedPassHistoryArr: any= [];
  passwordmatch: boolean= false;
  passwordNotMatchval: boolean= false;
  PasswordStrength: any;
  PasswordStrengthval: boolean= false;
  passwordHistoryMatch: boolean= false;
  hide1 = true;
  hide2 = true;
  UserProcessId: any;
  UserId: any;
  EmailId: any;
  otpcount: number = 120;
  counter
  clearInterval: any
  counterIncrement: number

  constructor(
    private router: Router,
    private common: CommonService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private api: ApiService,
    ) {
    this.activatedRoute.queryParams.subscribe(filter => {
      this.urlParam = filter
    })
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.UserForm = this.formBuilder.group({
      username: ['', [Validators.required]]
    });
    if(this.auth.isLoggedIn()){
      this.router.navigate(['dashboard'])
    }

    this.auth.user$.subscribe(res=>{

      if(res == 'PasswordResetSuccess')
      {
        this.loader = true;
      }
      else{
      this.loader = false;
      this.userMsg = res;
      this.common.snackbar(this.userMsg,'error');
        }


    })

    if(Object.keys(this.urlParam).length > 0){
      this.form.get('username').setValue(this.urlParam.user);
      this.form.get('password').setValue(this.common.getDecrypted('123456$#@$^@1ERF', this.urlParam.pass));
      this.submit()
    }
    this.auth.setBranding()
    this.auth.getBranding$.subscribe(data => {
      if (data.code == 200) {
        this.branding = JSON.parse(data.results.data);
        // console.log(this.branding, 'asdasd')
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get uf(): { [key: string]: AbstractControl } {
    return this.UserForm.controls;
  }

  get fcp(): { [key: string]: AbstractControl } {
    return this.formChangePassword.controls;
  }

  passwordStrength(e) {
    this.PasswordStrengthval = e;
  }

  submit() {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.loader = false;
      return;
    }
    if((this.form.value.password.trim()).length <= 0 || (this.form.value.username.trim()).length <= 0){
      this.loader = false;
      return;
    }
    if(this.form.value.username == '' || this.form.value.password == '' )
    {
      this.loader = false;
      return;
    }
    var obj = {
      data: {
          username: this.form.value.username,
          password: this.common.setEncrypted('123456$#@$^@1ERF', (this.form.value.password).trim())
          //workspaceserver
            // UserName: this.form.value.username,
            // Password: Md5.hashStr(this.form.value.password)
      }
    }
      this.auth.login(obj, "userlogin")
      //workspaceserver
      // this.auth.login(obj, "LoginForm")
  }


  resetpassfunc(){
    const dialogRef = this. dialog.open(DialogComponent,{
      data: {
        type: 'ChangePassword',
      },
      disableClose: true
    });

  }


  Forgotpassword()
  {
    this.LoginForm = false;
    this.IsForgotPassword = true;
    this.CloseForgetPassword = true;
  }
  CancelForgotPass()
  {   
    this.IsForgotPassword = false;
    this.SendOtpToEmail = false;
    this.VerifyOtp = false;
    this.UserForm.reset();
    this.CloseForgetPassword = false;
    this.FinalResetPassword = false;
    this.securitycomplainceresponse  = false;
    this.LoginForm = true;  
    this.form.reset();
    if (this.otpcount =this.counterIncrement =120) {
      clearInterval(this.counter)
    }
  }

  SubmitForgotPassUsername()
  {
    this.loader = true;
    this.submittedForm = true;
   

    console.log('UserForm',this.UserForm);


    this.loader = true;
    this.submittedForm = true;
    if (this.UserForm.invalid) {
      this.loader = false;
      return;
    }
    if((this.UserForm.value.username.trim()).length <= 0 ){
      this.loader = false;
      return;
    }
    if(this.UserForm.value.username == ''  )
    {
      this.loader = false;
      return;
    }
    
      var Obj = {
        username : this.UserForm.value.username
      }
      this.api.ForgotPassword('otpverification/verifyusername', Obj).subscribe(res => {  
        if (res.results?.statuscode == 200) {
          if(res.results.data && res.results.data.length > 0)
          {
            this.loader = false;
            console.log('res.results',res.results);            
            this.common.snackbar('UsernameMatched');
            this.SendOtpToEmail = true;            
            this.UserId = res.results.data[0].Id
            this.UserProcessId = res.results.data[0].Processid
            this.EmailId = res.results.data[0].EmailId          
            let splitEmail = this.EmailId.split('@');
            const regex = /(?<!^).(?!$)/g;
            const censored = splitEmail[0].replace(regex, '*')
            splitEmail[0] = censored;
            this.maskedEmailId = splitEmail.join("@");
          } 
          else{
            this.loader = false;
            console.log('res',res);  
            this.common.snackbar('UsernameNotFound');
            this.SendOtpToEmail = false;
          }            
        }
        else{
          this.loader = false;
          console.log('res',res);  
          this.common.snackbar('UsernameNotFound');
          this.SendOtpToEmail = false;
        }
      })

    }
  
   
  tabChange(event: any) {
    try {
      let val = event
      let ele = document.querySelectorAll('input');
      if (ele[val - 1].value != '') {
        ele[val].focus()
      } else if (ele[val - 1].value == '') {
        ele[val - 2].focus()
      }
    } catch (e) {
      console.log("Error in tabchange otp confirm", e.message)
    }
  }

  
    SendOtpEmail(){

    var Obj = {
      Email : this.EmailId
        }
        this.api.ForgotPassword('otpverification/generateotp', Obj).subscribe(res => {  
          if (res.results?.statuscode == 200) {
            
            this.LoginForm = false;
            this.SendOtpToEmail = false;
            this.IsForgotPassword =false
            this.VerifyOtp = true;

            let counterIncremen: any = 1;
            clearInterval(this.counter)
    
            this.counter = setInterval(() => { this.OTPExpiryTimer(counterIncremen) }, 1000);
            // this.clearInterval.reset()
          }
        })
      
    }

     confirmOTP(otpnum)
    {

      var Obj = {
        Email : this.EmailId,
        otp : otpnum
          }
          this.api.ForgotPassword('otpverification/verifyotp', Obj).subscribe(res => {  
            if (res.results?.statuscode == 200) {
              this.common.snackbar('OtpVerified');
              clearInterval(this.counter)
              this.VerifyOtp = false;
              this.SendOtpToEmail = false;
              this.IsForgotPassword = false;
              this.FinalResetPassword = true;
              this.FinalResetPasswordFunc()
            }
            else{
              this.common.snackbar('IncorrectOtp');
  
            }
        })
    }


    FinalResetPasswordFunc(){
      // this.loader = true;
     var requestObj = {
        data: {
          spname: "usp_unfyd_security_compliance",
          parameters: {
            flag: "GET_FOR_ADMIN",
            processid: 1,
            productid: 11
          }
        }
      }

      this.api.post('index',requestObj).subscribe((res: any) => {
        this.loader = false
        this.formChangePassword = this.formBuilder.group({
          newPassword: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
        }
        );
        this.passwordPolicyapi = res.results.data;

        let minlengthapi = res.results.data[0].value;
        let maxLengthapi = res.results.data[1].value;
        this.securitycomplainceresponse = true;



      })


     let objpasslist  = {
              data: {
                  parameters: {
                    agentid :  this.UserId,
                    processid :  this.UserProcessId 
                  }
              }
           }

      this.api.post('PasswordHistory', objpasslist).subscribe((res: any) => {
        this.PasswordHistoryArr =[]
        this.PasswordHistoryArr = res.results.data;

        this.decrptedPassHistoryArr = []

        this.PasswordHistoryArr.forEach(element => {
          let decrptedpass = this.common.getDecrypted('123456$#@$^@1ERF', element)
          this.decrptedPassHistoryArr.push(decrptedpass);
        });

      })


    }




    errorMsg() {
      this.passwordHistoryMatch = false;
      if (this.fcp.confirmPassword.value == this.fcp.newPassword.value && this.fcp.confirmPassword.value.length > 0) {
        this.passwordmatch = true;
        this.passwordNotMatchval = false;
      }
      if (this.fcp.confirmPassword.value != this.fcp.newPassword.value) {
        this.passwordmatch = false;
        if (this.fcp.confirmPassword.value.length > 3) {
          this.passwordNotMatchval = true;
        }
      }
  
    }



    
  submitChangePassword() {
    this.errorMsg();
    let passhistorylen =  this.PasswordHistoryArr.length;

    if(this.fcp?.confirmPassword?.value != this.fcp?.newPassword?.value)
    {
      console.log('p?.confirmPassword?',this.fcp?.confirmPassword?.value ,this.fcp?.newPassword?.value);
      
      return;
    }
    if (this.PasswordStrengthval == false) {
      return;
    }

    if(passhistorylen == 0)
    {
          if (this.PasswordStrengthval == true) {
            var obj = {
              data: {
                spname: "USP_SWA_USER_CHANGEPASSWORD",
                parameters: {
                  agentid : this.UserId,
                  password : this.common.setEncrypted('123456$#@$^@1ERF', this.formChangePassword?.get('confirmPassword').value)
                }
              }
            }
            // this.common.hubControlEvent(this.data.type,'click','','',JSON.stringify(obj),'submitChangePassword');

            this.api.post('usercreate', obj).subscribe(res => {
              if (res.code == 200) {
                // this.dialogRef.close({
                //   event: true, data: {
                //     username: this.data.UserName,
                //     password: this.formChangePassword?.get('confirmPassword').value,
                //     id: this.data.Id
                //   }
                // });
                this.common.snackbar('Password Changed Successfully', 'success');
                this.VerifyOtp = false;
                this.SendOtpToEmail = false;
                this.IsForgotPassword = false;            
                this.FinalResetPassword = false;
                this.securitycomplainceresponse  = false;
                this.CloseForgetPassword = false;
                this.UserForm.reset();
                this.LoginForm = true;
                this.form.reset();
                
              } else if (res.code == 400) {
                this.common.snackbar("General Error");
              } else {
                this.common.snackbar("General Error");
              }
            }, (error) => {
              this.common.snackbar("General Error");
            })

          }
          else {

            this.common.snackbar('Password Policy Not Satisfied', 'error');
            return;
          }
    }
    else{

      this.decrptedPassHistoryArr.forEach(element => {

         if(element == this.formChangePassword?.get('confirmPassword').value)
         {
          // this.passwordHistoryMatch = true;
          this.common.snackbar('LastPasswordError');
          return;
         }
              passhistorylen--
              if(passhistorylen == 0)
              {
                  if (this.PasswordStrengthval == true) {


                      var obj = {
                        data: {
                          spname: "USP_SWA_USER_CHANGEPASSWORD",
                          parameters: {
                            agentid :  this.UserId,
                            password: this.common.setEncrypted('123456$#@$^@1ERF', this.formChangePassword?.get('confirmPassword').value)
                          }
                        }
                      }
                      // this.common.hubControlEvent(this.data.type,'click','','',JSON.stringify(obj),'submitChangePassword');

                      this.api.post('usercreate', obj).subscribe(res => {
                        if (res.code == 200) {
                          this.common.snackbar('Password Changed Successfully', 'success');
                          this.VerifyOtp = false;
                          this.SendOtpToEmail = false;
                          this.IsForgotPassword = false;            
                          this.FinalResetPassword = false;
                          this.securitycomplainceresponse  = false;
                          this.CloseForgetPassword = false;
                          this.UserForm.reset();
                          this.LoginForm = true;
                          this.form.reset();

                        } else if (res.code == 400) {
                          this.common.snackbar("General Error");
                        } else {
                          this.common.snackbar("General Error");
                        }
                      }, (error) => {
                        this.common.snackbar("General Error");
                      })

                  
                  
                    }
                    else {

                      this.common.snackbar('Password Policy Not Satisfied', 'error');
                      return;
                    }
              }

      });

    }
    

  }
  
  

  
  OTPExpiryTimer(counterIncrement) {

    this.otpcount = this.otpcount - counterIncrement;
    if (this.otpcount <= 0) {
      clearInterval(this.counter)      
        let objpasslist  = {
          data: {
             spname: "USP_UNFYD_OTPStored",
              parameters: {
                flag : "delete",
                Email :  this.EmailId,                
              }
          }
      } 
    }

    this.otpcount = this.otpcount
    if (this.otpcount == 0) {
      // this.resendOtpbtn = true;
      this.otpcount = 120;
    }

  }
  
  
  }