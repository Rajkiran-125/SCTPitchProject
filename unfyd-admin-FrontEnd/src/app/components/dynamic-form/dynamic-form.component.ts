import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormField } from '../../global/form-field';
import { FormfieldControlService } from '../../global/formfield-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() formFields: FormField<string>[] = [];
  @Input() button:any;
  form: FormGroup;
  payLoad = '';

  constructor(private formfieldService: FormfieldControlService, public router : Router) { }

  ngOnInit(): void {
    this.form = this.formfieldService.toFormGroup(this.formFields);

    

  }


  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    this.router.navigate(['/beneficiary/list']);
  }

}
