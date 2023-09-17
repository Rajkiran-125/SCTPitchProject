import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { AuthService } from 'src/app/global/auth.service';

@Component({
  selector: 'app-hawker-payment',
  templateUrl: './hawker-payment.component.html',
  styleUrls: ['./hawker-payment.component.scss']
})
export class HawkerPaymentComponent implements OnInit {
  loader: boolean = false;
  data:any=[];
  contactId = 'HAW22042200891'
  @ViewChild(MatAccordion) accordion: MatAccordion;
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  options: FormGroup;
  cvvLen=0
  floatLabelControl = new FormControl(undefined);
  cardSequenceNumber = 0;
  hawkerInfo:any
  cards = [
    {
      bank_name: 'RBL Credit Card',
      card_number:'XXXX XXXX XXXX 3456'
    },
    {
      bank_name: 'SBI Credit Card',
      card_number:'XXXX XXXX XXXX 3456'
    },
    {
      bank_name: 'PNB Credit Card',
      card_number:'XXXX XXXX XXXX 3456'
    }]
  ProcessId: any;
  ProductId: any;

  constructor(private router:Router, private api: ApiService,fb: FormBuilder, private auth: AuthService) {
    this.options = fb.group({
      floatLabel: this.floatLabelControl,
    });
    
   }

  ngOnInit(): void {
    this.loader = true
    this.get();
  }

  async get() {
    this.hawkerInfo = await this.auth.getUser();
    this.contactId = this.hawkerInfo.EmployeeId;
    this.loader = true;
    let endPoint = "index";

    let data1 = {
      data: {
        parameters: {
          flag: "EDIT",
          hawkerid: this.contactId,
        },
        spname: 'usp_unfyd_haw_personal',
      },
    };

    this.api
      .post("index", data1)
      .subscribe(res => {
        if (res.error == false) {
          var temp = res.results.data[0];
          this.ProcessId = temp.ProcessId;
          this.ProductId = temp.ProductId;
        }
      })
      .add(()=>{
    this.paymentHistory()
  })
  }

  cardSelected(index:any){
    if(this.cardSequenceNumber != index){
      this.cvvLen = 0
    }
    this.cardSequenceNumber = index;
  }

  enablePayButton(type:any,event:any){
    this.cvvLen = event.toString().length;
    
  }

  back(){
    this.router.navigateByUrl('beneficiary-home')
  }

  paymentHistory(){
    this.loader =true
    let data1= {
      "data": {
          "spname": 'usp_unfyd_haw_finance',
          "parameters": {
              "flag": 'GET_FOR_PAYMENT',
              'contactid': this.contactId, 
              "processid": this.ProcessId,
              "productid": this.ProductId
          }
        }
    }
    this.api.post('index',data1).subscribe(res=>{
      if(res.error == false){
        this.loader = false;
        this.data = res.results.data
      }
    })
  }
}
