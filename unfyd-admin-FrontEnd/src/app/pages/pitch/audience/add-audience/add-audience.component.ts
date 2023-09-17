import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-audience',
  templateUrl: './add-audience.component.html',
  styleUrls: ['./add-audience.component.scss']
})
export class AddAudienceComponent implements OnInit {
  loader: boolean = false;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) {  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      firstName: ['',Validators.nullValidator],
      middleName: ['',Validators.nullValidator],
      lastName: ['',Validators.nullValidator],
      email: ['',Validators.nullValidator],
      phoneNumber: ['',Validators.nullValidator],
      whatsAppNumber: ['',Validators.nullValidator],
      customerAttribute1: ['',Validators.nullValidator],
      customerAttribute2: ['',Validators.nullValidator],
      customerAttribute3: ['',Validators.nullValidator],
      customerAttribute4: ['',Validators.nullValidator],
      customerAttribute5: ['',Validators.nullValidator],
      customerAttribute6: ['',Validators.nullValidator],
      customerAttribute7: ['',Validators.nullValidator],
      customerAttribute8: ['',Validators.nullValidator],
      customerAttribute9: ['',Validators.nullValidator],
      customerAttribute10: ['',Validators.nullValidator]
    })
  }

  back(): void {
  //   this.common.hubControlEvent('Skills','click','back','','','back');
  //   if(this.isDialog == true){
  //     this.dialogRef.close(true);
  //   }
  //   else{
  //   this.router.navigate(['masters/skills']);}
  // }
  }
  SaveContact(){
    console.log('Save Contact');
  }
}
