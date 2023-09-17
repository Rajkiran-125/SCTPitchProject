import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';

@Component({
  selector: 'app-hsm-preview',
  templateUrl: './hsm-preview.component.html',
  styleUrls: ['./hsm-preview.component.scss']
})
export class HsmPreviewComponent implements OnInit , OnChanges{
  @Input() hsmBody : any;
  isShow: boolean =true;
  @Output() preview=new EventEmitter<any>();
  hsmid: any;
  hsmObj: any;
  img: any;
  loader: boolean = false;
  filter: any;
  form: FormGroup;
  submittedForm: boolean = false;
  msgImg: any;
  labelname: any;
  docfileext: any;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,) { }

  ngOnInit(){
    if (this.hsmBody !== null) {
      var obj = {
        data: {
          spname: "usp_unfyd_hsm_template",
          parameters: {
            FlAG: "EDIT",
            Id: this.hsmBody
          }
        }
      }
      this.api.post('index', obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          this.hsmObj = res.results.data[0];
          
          this.labelname = res.results.data[0].MsgHeader;
          this.msgImg = res.results.data[0].MsgHeaderVal;
          if(  this.labelname == 'Document' ){
            this.docfileext =  this.msgImg.split('.').pop();
          }
        }
      });
    }
  }
  ngOnChanges(changes: SimpleChanges){
  }

  featureHide() {
    this.preview.emit(false);   
  };
  
}
