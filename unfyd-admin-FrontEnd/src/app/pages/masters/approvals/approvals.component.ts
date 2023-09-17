import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  loader:boolean = false
  id:any;
  editData:any
  allLabels = [];
  allLabelsCopy = [];
  userDetails:any;
  costing = [];
  labelsToTranslate = [];
  localizationData = [];
  defaultLanguage = {
    defaultLanguage:'English',
    defaultLanguageCode:'en'
  };
  // data = {
  //   ProductId:11
  // }
  method: any[] = ['GET', 'POST', 'PUT', 'DELETE'];
  remarks = [];
  languageToUpdate:any;
  hasChecked:any = [];
  allChecked:boolean = false;
  allSelected = false;
  itemsPerPage = 10;
  page = 1;
  changedLabels = []
  changedLabels2 = []
  ApprovalStatus = 'Pending'
  constructor(private router:Router,private activatedRoute: ActivatedRoute, private api: ApiService, private auth: AuthService,private common: CommonService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.getData()
    }
  }

  back(){
    let a = {}

    Object.assign(a,{productId:this.activatedRoute.snapshot.paramMap.get('productid')})
    Object.assign(a,{moduleName : this.editData.ModuleName})
    Object.assign(a,{tab : 'GET_PENDING'})
    this.common.selectedApprovalDetails.next(a)
    this.router.navigate(['masters/approvals']);
  }

  getData(){
    this.loader = true;
    var Obj = {
      data: {
        spname: "usp_unfyd_approvals",
        parameters: {
          flag: "EDIT",
          Id: this.id
        }
      }
    }
    this.api.post('index', Obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.editData = res.results.data[0]
        // console.log(res.results.data);
        if(this.editData?.ModuleName == 'Localization' && (this.editData?.ActivateType == 'API' || this.editData?.ActivateType == 'MANUAL')){
          this.getAllLocalizationData()
        }
      }
    })
  }

  getLabelsToCompareInApprovals(defaultLang,newLang){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          FLAG: "GET_UNAPPROVED_DATA",
          "DEFAULTLANGCODE":defaultLang,
          "NEWLANGCODE":newLang,
          processid: this.userDetails.Processid,
          productid:this.editData?.ProductId,

        },
      },
    };
    if(this.editData?.ActivateType == 'MANUAL'){
      Object.assign(obj.data.parameters,{Id:this.editData.Id})
      Object.assign(obj.data.parameters,{ApprovalStatus:this.editData.ApprovalStatus})
      Object.assign(obj.data.parameters,{ActivateType:this.editData.ActivateType})
    }
    this.api.post("index", obj).subscribe((res) => {
      // this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          this.loader = false
          // if(this.editData?.ActivateType == 'MANUAL'){
          //   res.results.data.map(v => Object.assign(v, {remark: ''}))
          // }
          this.allLabels = JSON.parse(JSON.stringify(res.results.data))
          this.allLabelsCopy = JSON.parse(JSON.stringify(res.results.data))
          this.countLabelCostToTranslate()
        }else{ this.countLabelCostToTranslate();this.loader = false}
      }else {this.countLabelCostToTranslate();this.loader = false}
    },error => {
        this.loader = false;
        this.countLabelCostToTranslate()
      });
  }

  getCostingToCompareInApprovals(){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_common_api_details",
        parameters: {
          FLAG: "GET_DEFAULT_API",
          productid:this.editData.ProductId,
          processid:this.userDetails.Processid
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      // this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          this.costing = res.results.data;
          // console.log("cost:",this.costing);
          this.countLabelCostToTranslate()
        }else this.countLabelCostToTranslate()
      }else this.countLabelCostToTranslate()
    },error => {
      this.loader = false;
      this.countLabelCostToTranslate()
    });
  }

  countLabelCostToTranslate(){
    if(this.allLabels.length > 0 && this.costing.length > 0){
          this.allLabels.forEach(element => {
            // if(element.TranslatedLabelName && !(element.TranslatedLabelName.trim().length === 0) && !this.labelsToTranslate.includes(element.TranslatedLabelName)){
            //   this.labelsToTranslate.push(element.TranslatedLabelName)
            // }
            // if(element.DefaultLabelName && !(element.DefaultLabelName.trim().length === 0) && !this.labelsToTranslate2.includes(element.DefaultLabelName)){
            //   this.labelsToTranslate2.push(element.DefaultLabelName)
            // }

            if((!element.TranslatedLabelName || element.TranslatedLabelName.trim().length === 0) && !this.labelsToTranslate.includes(element.DefaultLabelName)){
              this.labelsToTranslate.push(element.DefaultLabelName)
            }
          });

          if(this.labelsToTranslate.length > 0){
            let charCount = 0;
            let charCountCopy = 0;
            let costForAll = 0
            this.labelsToTranslate.forEach(res=>{
              charCount += res.length
            })
            charCountCopy = JSON.parse(JSON.stringify(charCount))
            let costingData = JSON.parse(this.costing[0].PricingDetails)
            costingData.forEach(element => {
              if(charCount > element.to){
                let c = element.to - element.from;
                charCount = charCount - c;
                costForAll = costForAll + (c/1000)*element.perThousandChar
              } else if(charCount < element.from){
                let c = charCount;
                charCount = charCount - c;
                costForAll = costForAll + (c/1000)*element.perThousandChar
              } else if(element.from <= charCount && charCount <= element.to){
                let c = charCount;
                charCount = charCount - c;
                costForAll = costForAll + (c/1000)*element.perThousandChar
              }
            });
            Object.assign(this.editData,{CharactersCount:charCountCopy})
            Object.assign(this.editData,{TotalAmount:Math.round(costForAll)})
            this.loader = false
            // let reqObj = {
            //   language : '',
            //   CharactersCount : '',
            //   TotalAmount : '',
            //   pricingDetails : ''
            // }
            // console.log("costForAll:",Math.round(costForAll));
            // console.log("joinedString:",charCount);
            // console.log("joinedString Copy:",charCountCopy);
            // console.log("this.labelsToTranslate2:",this.labelsToTranslate);
          }
    } else{
      Object.assign(this.editData,{CharactersCount:0})
      Object.assign(this.editData,{TotalAmount:0})
      // this.localizationData[i].Status = this.localizationData[i].Status;
    }
  }

  getAllLocalizationData(){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_localization",
        parameters: {
          FLAG: "GET_MODULE",
          PRODUCTID: this.editData.ProductId,
        },
      },
    };

    this.api.post("index", obj).subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          this.localizationData = []
          if(res.results.data.length > 0){
            res.results.data.forEach((element) => {
              if (element.ParentModuleName == "Language") {
                if(element.AssignedValue == 'false'){
                  element.AssignedValue = false
                }
                if(element.AdditionalPropertyValue == 'false'){
                  element.AdditionalPropertyValue = false
                }
                if(element.AdditionalPropertyValue){
                  this.defaultLanguage.defaultLanguage = element.ModuleName
                  this.defaultLanguage.defaultLanguageCode = element.LanguageCode
                }

                if(element.Status == 'false'){
                  element.Status = false
                }
                this.localizationData.push(element)
              }
              if(element.LanguageCode == this.editData?.LanguageCode) this.languageToUpdate = element
            })
            this.getLabelsToCompareInApprovals(this.defaultLanguage.defaultLanguageCode,this.editData?.LanguageCode);
            if(this.editData?.ActivateType == 'API') this.getCostingToCompareInApprovals()
          }
          // console.log("localizationData:",this.localizationData);
          // console.log("languageToUpdate:",this.languageToUpdate);

        } else{
          this.loader = false;
          this.common.snackbar('General Error');
        }
      }, error => {
          this.loader = false;
          this.common.snackbar('General Error');
        })
  }

  approveReject(status){
    if(status){
      // this.translate('hi')
      if(this.editData?.ActivateType == 'MANUAL'){
        let approved = []
        let rejected = []
        this.allLabels.forEach(res => {
          if(this.hasChecked.includes(res.Id)){
            res.remark = status;
            res.ApprovalStatus = 'Approved';
            if(res.ApprovalStatus == 'Approved'){
              approved.push(res)
            } else if(res.ApprovalStatus == 'Rejected'){
              rejected.push(res)
            }
            this.changedLabels2.push(res)
          }
        })
        this.ApprovalStatus = approved.length == this.allLabels.length ? 'Approved' : rejected.length == this.allLabels.length ? 'Rejected':'Pending'
        this.updateManualLabels('hasChecked')
      }else{
        this.approveAPIForLanguage(status)
      }
    } else{
      this.rejectRemarks()
    }
  }

  rejectRemarks(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'rejectRemark'
      },
      width: "25vw",
      height:"37vh",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((status) => {
      if(status){
        this.remarks = []
        this.remarks.push({remarks:status})
        if(this.editData?.ActivateType == 'MANUAL'){
          this.changedLabels2 = []
          let approved = []
          let rejected = []
          this.allLabels.forEach(res => {
            if(this.hasChecked.includes(res.Id)){
              res.remark = status;
              res.ApprovalStatus = 'Rejected';
              this.changedLabels2.push(res)
            }
            if(res.ApprovalStatus == 'Approved'){
              approved.push(res)
            } else if(res.ApprovalStatus == 'Rejected'){
              rejected.push(res)
            }
          })
          this.ApprovalStatus = approved.length == this.allLabels.length ? 'Approved' : rejected.length == this.allLabels.length ? 'Rejected':'Pending'
          this.updateManualLabels('hasChecked')
        }else{
          this.approveAPIForLanguage(false)
        }
      }

    })
  }

  approveAPIForLanguage(status){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_approvals",
        parameters: {
          FLAG: "UPDATE_APPROVAL_STATUS",
          APPROVALSTATUS: status ? 'Approved' : 'Rejected',
          // REMARKS:this.remarks[0].remark,
          REMARKS: status ? '' : this.remarks[0].remarks,
          MODIFIEDBY:this.userDetails?.Id,
          languageCode:this.editData?.LanguageCode,
          id:this.id,
          PROCESSID: this.editData?.ProcessId ,
          PRODUCTID: this.editData?.ProductId,
        },
      },
    };

    this.api.post("index", obj).subscribe((res) => {
        if (res.code == 200) {
          // if(res.results.data.result)
          if((Object.keys(res.results.data[0])).includes('result')){
            if(res.results.data[0].result.includes("success")){
              if(status){
                this.translate(obj.data.parameters.languageCode)
              }else{
                this.activateLanguageStatus(false)
              }
            } else{
              this.loader = false;
              this.common.snackbar("General Error");
            }
          } else{
            this.loader = false;
            this.common.snackbar("General Error");
          }
        }  else{
          this.loader = false;
          this.common.snackbar("General Error");
        }
      }, error =>{
        this.loader = false
      })
  }

  async translate(langCode){
    let request = await this.common.createRequest(JSON.parse(this.costing[0].RequestParam).customer_profile,langCode)
    // let a =['test data','test information','test case']
    let data = []

    let b = [];
    for(let i=0; i<this.labelsToTranslate.length; i++){
      // this.checkApi(request).subscribe(res => console.log('abcd:',res))
      b.push({Text:this.labelsToTranslate[i]})
      if(b.length == 500 || i == this.labelsToTranslate.length-1){
      request['body'] = b
      let c = await this.checkApi(request).subscribe(res => {
        b.forEach((e:any,ii)=>{
          data.push({[e.Text]:res[ii]?.translations[0]?.text})
        })
        // if(i == a.length-1){
          // console.log(data);
        // }
        b= []
        if(i == this.labelsToTranslate.length-1){
          // console.log(data);
          this.updateLabels(data)
        }
      })

      }
    }
    // console.log(data);
  }


  checkApi(request):Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(request.header !== undefined ? { ...request.header } : {})
    };
    let bodyObject =
    // (request.body !== '' && request.body !== undefined) ? request.body.split('\n').join('') :
     request.body;

    if (request.method == this.method[0]) {
      return this.api.getPostmanMethod(request.url, bodyObject)
      // .subscribe(res => {console.log("res:",res);return res}, error => {return error})
    } else if (request.method == this.method[1]) {
      return  this.api.postPostmanMethod(request.url, bodyObject, httpOptions)
      // .subscribe(res => {return res}, error => {return error})
    } else if (request.method == this.method[2]) {
      return  this.api.putPostmanMethod(request.url, 2, bodyObject, httpOptions)
      // .subscribe(res => {return res}, error => {return error})
    } else if (request.method == this.method[3]) {
      return  this.api.deletePostmanMethod(request.url, 2)
      // .subscribe(res => {return res}, error => {return error})
    }
  }


  updateLabels(data){
   let reqObj = []
   let count = 0
   data.forEach((element,index) => {
    let data1 = {
        APPROVALSTATUS: 'Approved',
        LANGUAGE:this.editData?.LanguageCode,
        LABELNAME:Object.keys(element)[0],
        TRANSLATEDLABEL:Object.values(element)[0],
        PROCESSID: this.editData?.ProcessId,
        PRODUCTID: this.editData?.ProductId
    }

    reqObj.push(data1)
    if(reqObj.length == 50 || index == data.length-1){
      count++;
      let obj = {
        data: {
          spname: "usp_unfyd_form_validation",
          parameters: {
            FLAG: "UPDATE_TRANSLATED_LABEL",
            TranslatedJSON : JSON.stringify(reqObj)
          },
        },
      };

      this.api.post("index", obj).subscribe((res:any) => {
        if (res.code == 200) {
          count--;
          if(count == 0){
            // this.common.snackbar('Language Activated')
            this.activateLanguageStatus(true)
          }
        }
      }, error =>{
        this.loader = false
      })

      reqObj = []
    }


   });
  }

  activateLanguageStatus(status){
    let obj = {
      data: {
        spname: "usp_unfyd_localization",
        parameters: {
          FLAG: "UPDATE_MODULE",
          ASSIGNEDVALUE: this.languageToUpdate?.AssignedValue,
          ASSIGNEDPROPERTY: this.languageToUpdate?.AssignedProperty == 'left' ? 'left' : 'right',
          ADDITIONALPROPERTY: this.languageToUpdate?.AdditionalProperty,
          AdditionalPropertyValue: this.languageToUpdate?.AdditionalPropertyValue,
          STATUS: status,
          PROCESSID: this.userDetails.Processid,
          PRODUCTID: this.languageToUpdate.ProductId,
          PRODUCTNAME: this.languageToUpdate?.ProductName,
          LANGUAGECODE: this.languageToUpdate?.LanguageCode,
          MODULENAME: this.languageToUpdate.ModuleName,
          PARENTCONTROLID: this.languageToUpdate.ParentControlId,
          Id: this.languageToUpdate.Id,
        },
      },
    };

    this.api.post("index", obj).subscribe((res:any) => {
      if (res.code == 200) {
        if((Object.keys(res.results.data[0])).includes('result')){
          if(res.results.data[0].result.includes("success")){
            this.loader = false
            if(status) {
              this.common.snackbar('Language Activated')
              if(this.activatedRoute.snapshot.paramMap.get('productid').toString() == '11') this.common.getLabelsFromDB(this.activatedRoute.snapshot.paramMap.get('productid').toString(),this.languageToUpdate?.LanguageCode)
            }
            else this.common.snackbar('Translation Rejected')
            this.back()
          }
        } else{
          this.loader = false;
          this.common.snackbar("General Error");
        }
      } else{
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error =>{
      this.loader = false;
      this.common.snackbar("General Error");
    })
  }

  bulkCheckboxCheck(event){
    // let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage
    //     let endingOfArray: any;
    //     if (this.itemsPerPage * this.page > this.allLabels.length) {
    //         endingOfArray = this.allLabels.length
    //     } else {
    //         endingOfArray = this.page * this.itemsPerPage
    //     }
    //     for (let i = startingOfArray; i < endingOfArray; i++) {
    //         if (event) {
    //             if (this.allLabels[i] != undefined)
    //                 this.allLabels[i].CHECKBOX = true
    //             this.allSelected = true;
    //         } else if (!event) {
    //             if (this.allLabels[i] != undefined)
    //                 this.allLabels[i].CHECKBOX = false
    //             this.allSelected = false
    //         }
    //     }

    this.allLabels.forEach(element => {
              if (event) {
                element.CHECKBOX = true
              }else{
                element.CHECKBOX = false
              }
    });
                // allChecked = event
                this.checkChecks()
  }

  checkChecks(){
    this.hasChecked = []
    this.allLabels.forEach(element => {
       if(element.CHECKBOX){
        this.hasChecked.push(element.Id)
       }
    })
    if(this.hasChecked.length == this.allLabels.length) this.allSelected = true;
    else this.allSelected = false;
  }

  resetLabels(){
    this.loader = true
    this.allLabels = JSON.parse(JSON.stringify(this.allLabelsCopy));
    this.loader = false
  }


  updateManualLabels(source){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_approvals",
        parameters: {
          FLAG: "UPDATE_APPROVAL_STATUS",
          APPROVALSTATUS: this.ApprovalStatus,
          // REMARKS:this.remarks[0].remark,
          REMARKS: '',
          MODIFIEDBY:this.userDetails?.Id,
          languageCode:this.editData?.LanguageCode,
          id:this.id,
          PROCESSID: this.editData?.ProcessId ,
          PRODUCTID: this.editData?.ProductId,
        },
      },
    };

    this.api.post("index", obj).subscribe((res) => {
        if (res.code == 200) {
          // if(res.results.data.result)
          if((Object.keys(res.results.data[0])).includes('result')){
            if(res.results.data[0].result.includes("success")){
              if(source == 'update') this.updateLabelsStatusChanged(this.changedLabels)
              if(source == 'hasChecked') this.updateLabelsStatusChanged(this.changedLabels2)
            } else{
              this.loader = false;
              this.common.snackbar("General Error");
            }
          } else{
            this.loader = false;
            this.common.snackbar("General Error");
          }
        }  else{
          this.loader = false;
          this.common.snackbar("General Error");
        }
      }, error =>{
        this.loader = false
      })
  }


  isLabelChanged():boolean{
    let a = []
    let b = false
    let approved = [];
    let rejected = []
    this.allLabels.forEach((e,i)=>{
      if(this.allLabels[i].ApprovalStatus != this.allLabelsCopy[i].ApprovalStatus){
        a.push(e)
      }
      // console.log(((this.allLabels[i].remark).trim()).length);

      if(this.allLabels[i].ApprovalStatus == 'Rejected' && (!this.allLabels[i].remark || ((this.allLabels[i].remark).trim()).length === 0)){
        b = true
      }
      if(this.allLabels[i].ApprovalStatus == 'Approved'){
        approved.push(this.allLabels[i])
      } else if(this.allLabels[i].ApprovalStatus == 'Rejected'){
        rejected.push(this.allLabels[i])
      }

    })

    this.ApprovalStatus = approved.length == this.allLabels.length ? 'Approved' : rejected.length == this.allLabels.length ? 'Rejected':'Pending'
    if(a.length > 0){
      this.changedLabels = JSON.parse(JSON.stringify(a))
    }
    return b ? true : a.length>0 ? false : true
  }


  updateLabelsStatusChanged(data){
    let reqObj = []
    let count = 0
    data.forEach((element,index) => {
     let data1 = {
         APPROVALSTATUS: element.ApprovalStatus,
         LANGUAGE:this.editData?.LanguageCode,
         LABELNAME:element.OldLabelName ,
         TRANSLATEDLABEL: element.ApprovalStatus == 'Rejected' ? element.OldLabelName : element.TranslatedLabelName,
         PROCESSID: this.editData?.ProcessId,
         PRODUCTID: this.editData?.ProductId,
         ID: element.Id,
         REMARKS: element.remark
     }

     reqObj.push(data1)
     if(reqObj.length == 50 || index == data.length-1){
       count++;
       let obj = {
         data: {
           spname: "usp_unfyd_form_validation",
           parameters: {
             FLAG: "UPDATE_TRANSLATED_LABEL",
             TranslatedJSON : JSON.stringify(reqObj)
           },
         },
       };

       this.api.post("index", obj).subscribe((res:any) => {
         if (res.code == 200) {
           count--;
           if(count == 0){
            this.loader = false
             this.common.snackbar('Update Success');
             if(this.activatedRoute.snapshot.paramMap.get('productid').toString() == '11') this.common.getLabelsFromDB(this.activatedRoute.snapshot.paramMap.get('productid').toString(),this.languageToUpdate?.LanguageCode)
             this.back()
            //  this.activateLanguageStatus(true)
           }
         }
       }, error =>{
         this.loader = false
       })

       reqObj = []
     }
    });
  }
}
