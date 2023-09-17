import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-structure-view',
  templateUrl: './structure-view.component.html',
  styleUrls: ['./structure-view.component.scss']
})
export class StructureViewComponent implements OnInit {
  userDetails :any = this.auth?.getUser() || {};
  loader = false
  data = []
  labelName:any
  userConfig:any
  subscription : Subscription[]= []
  subscriptionBulkDelete: Subscription[] = [];
  constructor(private auth: AuthService, private api: ApiService, private common: CommonService) { }

  ngOnInit(): void {
    this.common.setUserConfig(this.userDetails.ProfileType, 'structure');
    this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
    }))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getData()
  }

  setLabelByLanguage(data) {
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'structure', data)

  }

  getData(){
    this.loader = true
    let obj = {
      data: {
        spname: "usp_unfyd_form_structure",
        parameters: {
          FLAG :'GET',
          PROCESSID: this.userDetails?.Processid
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if(res.results.data.length > 0){
            this.data = res.results.data
          }else{
            this.data = []
          }
        }
    })
  }

  delete(id){
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) {
        this.loader = true
        let obj = {
          data: {
            spname: "usp_unfyd_form_structure",
            parameters: {
              FLAG :'delete',
              DELETEDBY: this.userDetails?.Id,
              ID: id
            }
          }
        }
        this.api.post('index',obj).subscribe((res: any) => {
          if (res.code == 200) {
            this.loader = false;
            if(res.results.data.length > 0){
                if(res.results.data[0].result.toLowerCase().includes('success')){
                  this.common.snackbar("Delete Record");
                    this.getData()
                }
              }
            }
        })
      }
      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }))

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
