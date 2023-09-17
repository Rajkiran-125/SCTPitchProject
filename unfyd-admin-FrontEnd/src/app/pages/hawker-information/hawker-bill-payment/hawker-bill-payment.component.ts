import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';

@Component({
  selector: 'app-hawker-bill-payment',
  templateUrl: './hawker-bill-payment.component.html',
  styleUrls: ['./hawker-bill-payment.component.scss']
})
export class HawkerBillPaymentComponent implements OnInit {
  loader: boolean = false;
  data:any=[];
  contactId = 'HAW22042200891'
  hawkerInfo:any

  constructor(private router:Router,private api: ApiService,private auth: AuthService) { }

  ngOnInit(): void {
    this.get()
  }

  async get(){
    this.hawkerInfo = await this.auth.getUser() 
    this.contactId = this.hawkerInfo.EmployeeId
    this.paymentHistory()
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
              "processid": 1,
              "productid": 1
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

  goTo(url:any){
    this.router.navigateByUrl(url);
  }
}
