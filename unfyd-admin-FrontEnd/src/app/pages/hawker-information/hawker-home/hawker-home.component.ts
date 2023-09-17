import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { masters, hawkerDetailsSteps, regex } from "src/app/global/json-data";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";

@Component({
  selector: "app-hawker-home",
  templateUrl: "./hawker-home.component.html",
  styleUrls: ["./hawker-home.component.scss"],
})
export class HawkerHomeComponent implements OnInit {
  isActive = '';
  hawkerInfo: any;
  loader: boolean = false;
  mouseOvered = false;
  moreDetails = true;
  path: any = "";
  hawkerDetailsSteps: string[] = [];
  @Input() steps: any;
  @Input() id: any;
  @Input() tab: any = "tab-steps";
  tabSelected = "Personal Details";
  data: any;
  keys: any;
  contactId: any = "";
  userDetails: string;
  flag = "EDIT";
  spname = "usp_unfyd_haw_personal";
  myGrievances:any= [];
  documentData: any;
  photograph: any;
  contactInfo: any;
  personalName: any;
  loaded = false;
  payments: any;
  tabValue: any = [];
  tabKey = [];
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  ProcessId = 0;
  ProductId = 0;
  myTraining = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private auth: AuthService,
    private common: CommonService,
    public dialog: MatDialog,
    private api: ApiService
  ) {
    Object.assign(this, { masters, hawkerDetailsSteps, regex });
  }

  ngOnInit(): void {
    this.get();
  }

  async get() {
    this.hawkerInfo = await this.auth.getUser();
    this.contactId = this.hawkerInfo.EmployeeId;

    this.getBasicInfo();
  }

  getPayments() {
    this.loader = true;
    let endPoint = "index";

    let doc = {
      data: {
        parameters: {
          contactid: this.contactId,
          flag: "GET_FOR_PAYMENT",
          processid: this.ProcessId,
              productid: this.ProductId,
        },
        spname: "usp_unfyd_haw_finance",
      },
    };

    this.api.post(endPoint, doc).subscribe(res => {
      if (res.error == false) {
        this.loader = false;
        this.payments = res.results.data;
      }
    });
  }

  getBasicInfo() {
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
          this.isActive = temp.RegistrationStatus;
          this.personalName = `${temp?.Salutation} ${temp?.FirstName} ${temp?.MiddleName} ${temp?.LastName}`;
          this.ProcessId = temp.ProcessId;
          this.ProductId = temp.ProductId;
        }
      })
      .add(() => {

        let doc = {
          data: {
            parameters: {
              contactid: this.contactId,
              flag: "GET",
              processid: this.ProcessId,
              productid: this.ProductId,
            },
            spname: "usp_unfyd_contact_kyc_fileurl",
          },
        };

        this.api.post(endPoint, doc).subscribe((res) => {
          if (res.error == false) {
            this.documentData = res.results.data;
            this.documentData?.forEach(element => {
              if (element?.Category == "Photograph") {
                this.photograph = element?.AttachmentUrl;
              }
            });
          }
        });
      })
      .add(() => {
        let data1 = {
          data: {
                "spname": 'usp_unfyd_haw_contact',
                "parameters": {
                    "flag": 'EDIT',
                    "hawkerid": this.contactId
                  }
                }
          }
        this.api.post('index',data1).subscribe(res=>{
          if(res.error == false){
            this.contactInfo = res.results.data[0]
          }
        })
      })
      .add(() => {
        let doc = {
          data: {
            parameters: {
              contactid: this.contactId,
              flag: "GET_FOR_PAYMENT",
              processid: this.ProcessId,
              productid: this.ProductId,
            },
            spname: "usp_unfyd_haw_finance",
          },
        };
    
        this.api.post(endPoint, doc).subscribe(res => {
          if (res.error == false) {
            this.payments = res.results.data;
          }
        });
      })
      .add(() => {
        
        let doc = {
          data: {
            parameters: {
              HAWKERID: this.contactId,
              flag: "TRAINING"
            },
            spname: "unfyd_haw_dashboard",
          },
        };
    
        this.api.post(endPoint, doc).subscribe(res => {
          if (res.error == false) {
            this.myTraining = res.results.data;
          }
        });
      })
      .add(() => {
        
        let doc = {
          data: {
            parameters: {
              HAWKERID: this.contactId,
              flag: "GRIEVANCE"
            },
            spname: "unfyd_haw_dashboard",
          },
        };
    
        this.api.post(endPoint, doc).subscribe(res => {
          if (res.error == false) {
            this.myGrievances = res.results.data;
          }
        });
      })
      .add(() => {
        this.getData();
      });
  }

  changeMoreDetails() {
    this.moreDetails = !this.moreDetails;
  }

  route(url: any) {
    this.router.navigateByUrl(url);
  }

  tabData(data: any) {
    this.tabSelected = data;
    this.getData();
  }

  keepOrder = (a) => {
    return a;
  };

  getData() {
    this.tabKey = [];
    this.tabValue = [];
    this.userDetails = this.auth.getUser();
    this.loader = true;
    let endPoint = "index";
    this.spname =
      this.tabSelected == "Personal Details"
        ? "usp_unfyd_haw_personal"
        : this.tabSelected == "Contact Details"
        ? "usp_unfyd_haw_contact"
        : this.tabSelected == "PCC Details"
        ? "usp_unfyd_haw_pcc"
        : this.tabSelected == "Medical Details"
        ? "usp_unfyd_haw_medical"
        : this.tabSelected == "Training Details"
        ? "usp_unfyd_haw_training"
        : this.tabSelected == "Documents"
        ? "usp_unfyd_contact_kyc_fileurl"
        : this.tabSelected == "Other"
        ? "usp_unfyd_haw_other"
        : this.tabSelected == "Payment"
        ? "usp_unfyd_haw_finance"
        : "";
    this.flag =
      this.tabSelected == "Documents"
        ? "GET"
        : this.tabSelected == "Payment"
        ? "GET"
        : "EDIT";
    let data1: any;
    if (this.tabSelected == "Documents") {
      data1 = {
        data: {
          spname: this.spname,
          parameters: {
            flag: this.flag,
            processid: this.ProcessId,
              productid: this.ProductId,
            contactid: this.contactId,
          },
        },
      };
    } else if (this.tabSelected == "Payment") {
      data1 = {
        data: {
          spname: this.spname,
          parameters: {
            flag: "GET_FOR_PAYMENT",
            contactid: this.contactId,
            processid: this.ProcessId,
            productid: this.ProductId,
          },
        },
      };
    } else {
      data1 = {
        data: {
          spname: this.spname,
          parameters: {
            flag: this.flag,
            hawkerid: this.contactId,
          },
        },
      };
    }

    this.data = [];
    this.api.post(endPoint, data1).subscribe(res => {
      if (res.error == false) {
        this.loader = false;
        var temp = res.results.data[0];
        if(res.results.data[0] != undefined) 
          {this.hawkerInfo = temp}
        
        if (this.tabSelected == "Personal Details") {
          this.data = [
            {
              Salutation: temp.Salutation,
              "First Name": temp.FirstName,
              "Middle Name": temp.MiddleName,
              "Last Name": temp.LastName,
              "Application Date": temp.ApplicationDate,
              Gender: temp.Gender,
              "Date of Birth": temp.DOB,
              "Son / Daughter / Wife of": temp.RelativeOf,
              Nationality: temp.Nationality,
              Religion: temp.Religion,
              Caste: temp.Caste,
              "Education Qualification": temp.EducationQual,
              "Blood Group": temp.BloodGroup,
              "Languages Known": temp.LanguagesKnown,
              "Marital Status": temp.MaritalStatus,
              "Specially Abled": temp.SpeciallyAbled,
              "Availability of covid vaccination certificate":
                temp.CovidVaxCertificateStatus,
            },
          ];
          this.documentData?.forEach(element => {
            if (element?.Category == "Signature") {
              this.data[2].Signature = element?.AttachmentUrl;
            }
          });
        } else if (this.tabSelected == "Contact Details") {
          this.data = [
            {
              "Mobile Number": temp.MobileNo,
              "Alternate Mobile No.": temp.AlternateNumber,
              "Emergency Contact Name": temp.EmergencyContactName,
              "Emergency Contact No.": temp.EmergencyContactNumber,
              "Email ID": temp.EmailId,
              "Mobile handset model": temp.HandsetModel,
              "Data Enabled": temp.MobiledataStatus,
            },
            {
              "Do you use WhatsApp?": temp.EnableWhatsapp,
              whatsappnumber: temp.WhatsappNumber,
            },
            {
              "Present Address": {
                "House no./ Flat no. / Building name": temp.PresentAddress,
                "Street name": temp.PresentAddressStreetName,
                "Area / Locality": temp.PresentAddressArea,
                Country: temp.PresentAddressCountry,
                State: temp.PresentAddressState,
                District: temp.PresentAddressDistrict,
                "City / Village / Ward / Municipality": temp.PresentAddressCity,
                "Post Office": temp.PostOfficePresentAddress,
                Block: temp.BlockPresentAddress,
                "Pin Code": temp.PresentAddressPincode,
                "Police Station": temp.PoliceStationPresentAddress,
              },
            },
            {
              "Permanent Address": {
                "House no./ Flat no. / Building name": temp.PermanentAddress,
                "Street name": temp.PermanentAddressStreetName,
                "Area / Locality": temp.PermanentAddressArea,
                Country: temp.PermanentAddressCountry,
                State: temp.PermanentAddressState,
                District: temp.PermanentAddressDistrict,
                "City / Village / Ward / Municipality":
                  temp.PermanentAddressCity,
                "Post Office": temp.PostOfficePermanentAddress,
                Block: temp.BlockPermanentAddress,
                "Pin Code": temp.PermanentAddressPincode,
                "Police Station": temp.PoliceStationPermanentAddress,
              },
            },
            {
              "Photo ID proof type": temp.PhotoIDProofType,
              "Photo ID proof no.": temp.PhotoIDProofNum,
              "Address proof type": temp.AddressProofType,
            },
          ];
        } else if (this.tabSelected == "Finance Details") {
          this.data = [
            {
              "Bank Name": temp?.bankName,
              Branch: temp?.branch,
            },
            {
              "IFSC Code": temp?.ifsc,
              "Account Number": temp.accountNumber,
            },
            {
              "Nominee Name": temp?.nominee,
              "Nominee DOB": temp?.nomineeDOB,
              "Relationship with nominee": temp?.relationWithNominee,
            },
            {
              "Cancel Cheque": "",
            },
          ];

          this.documentData.forEach(element => {
            if (element.Category == "Cancel Cheque") {
              this.data[3]["Cancel Cheque"] = element?.AttachmentUrl;
            }
          });
        } else if (this.tabSelected == "PCC Details") {
          this.data = [
            {
              "PCC Initiaiton Date": temp.PCCInitiaitonDate,
              "PCC Application Reference Number": temp.PCCAppRefNo,
              "Police Station Name": temp.PoliceStationName,
              "Police Verification status": temp.PoliceVerificationStatus,
              "PCC Valid From Date": temp.PCCValidFromDate,
              "PCC Valid to Date": temp.PCCValidToDate,
            },
          ];

          this.documentData.forEach(element => {
            if (element.Category == "Police Clearance Report") {
              this.data[2]["Police Clearance Certificate"] =
                element?.AttachmentUrl;
            }
          });
        } else if (this.tabSelected == "Medical Details") {
          this.data = [
            {
              "Medical Test Initiation Date": temp.MedicalTestInitiationDate,
              "Medical Test Status": temp.MedicalTestStatus,
              "Medical Test Result Date": temp.MedicalTestResultDate,
            },
          ];

          this.documentData.forEach(element => {
            if (element.Category == "Medical Clearance Report") {
              this.data[2]["Medical Test Report"] = element?.AttachmentUrl;
            }
            if (element.Category == "Covid Vaccination Certificate") {
              this.data[2]["Covid Vaccination Certificate"] =
                element?.AttachmentUrl;
            }
          });
        } else if (this.tabSelected == "Training Details") {
          this.data = [
            {
              "Training Initiation date": temp.TrainingInitiationDateTime,
              "Training completion status": temp.TrainingCompletionStatus,
              "Training completion date": temp.TrainingCompletionDateTime,
            },
          ];
        } else if (this.tab == "Other") {
          this.data = [
            {
              "Products Services": temp?.ProductsServices,
              "CoachTrainOperating Station": temp?.CoachTrainOperatingStn,
              "Application Submitted To Contact": temp?.AppSubmittedToContact,
              "Application submission date to Admin":
                temp?.appsubmissiondatetoadmin,
              "Application Approval Status From Admin":
                temp?.AppApprovalStatusFromAdmin,
              "Application approval date by Admin":
                temp?.AppApprovalDateByAdmin,
              "Registration Location": temp?.RegistrationLocation,
              "Registration No": temp?.RegistrationNo,
              "Life insurance(status)": temp?.LifeInsuranceStatus,
              "Receipt of id card": temp?.IdCardReceipt,
              "Receipt of  uniform": temp?.UniformReceipt,
              "Is Emergency": temp?.BGVerificationStatus,
              "Policy Number": temp?.PolicyNumber,
              "Policy Provider": temp?.PolicyProvider,
              "Cover Details": temp?.CoverDetails,
              "From Date": temp?.FromDate,
              "To Date": temp?.ToDate,
            },
          ];
        } else if (this.tabSelected == "Payment") {
          this.payments = res.results.data
          for (let data of res.results.data) {
            var paymentObj = {
              "Sr No": "",
              "Fee Type": data.FeeType,
              "Due For": data.DueFor,
              "Payment mode": data.PaymentMode,
              "Transaction Reference No.": data.TransactionReferenceNumber,
              "Amount to be Paid": data.AmountToBePaid,
              "Payment Received By": data.PaymentReceivedBy,
              "Transaction Date Time": this.datepipe.transform(
                data.TransactionDateTime,
                regex.dateTimeFormat
              ),
              "Transaction Date": this.datepipe.transform(
                data.TransactionDateTime,
                regex.dateFormat
              ),
              Print: "",
            };
            this.tabValue.push(paymentObj);
          }
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
        } else if (this.tabSelected == "Documents") {
          for (let data of res.results.data) {
            var kycObj = {
              "Sr No": "",
              Action: data.AttachmentUrl,
              "Document Type": data.Category,
              "Created On": data.CreatedOn,
            };
            this.tabValue.push(kycObj);
          }
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
        }
      }
    });
  }

  view(title, document) {
    var obj = {
      title: title,
      document: document,
    };
    this.openDialog("fileView", obj);
  }

  openDialog(type, data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
      width: "748px",
    });
    dialogRef.afterClosed().subscribe(status => {
    });
  }

  printObj: any = [];
  print(data) {
    var tempData = {
      "Registration No": this.contactId,
      Name: this.personalName,
      ...data,
    };

    this.common.setPrint("receipt", tempData);
    setTimeout(() => {
      window.print();
    }, 100);
  }

  goTo(url: any) {
    this.router.navigateByUrl(url);
  }
}
