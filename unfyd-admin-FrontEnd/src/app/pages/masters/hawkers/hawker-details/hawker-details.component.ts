import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { hawkerDetailsSteps, hawkerFormSteps, regex } from 'src/app/global/json-data';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common'

@Component({
  selector: 'app-hawker-details',
  templateUrl: './hawker-details.component.html',
  styleUrls: ['./hawker-details.component.scss']
})
export class HawkerDetailsComponent implements OnInit {
  loader: boolean = false;
  data: any = {};
  componentData: any = {};
  personalData: any = [];
  commonObj: any;
  userDetails: any;
  path: any;
  tab: any;
  tabKey: any = [];
  tabValue: any = [];
  editLink: any;
  hawkerDetailsSteps: string[] = [];
  hawkerFormSteps: string[] = [];
  regex: any;
  requestObj: any;
  search: any;
  page: number = 1;
  itemsPerPage: number = 10;
  form: FormGroup;
  userConfig: any;
  masterConfig: any;
  paymetBtn: boolean = false
  paymetFilter: any = {}
  Remarkstatus: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    public dialog: MatDialog,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    Object.assign(this, { hawkerDetailsSteps, hawkerFormSteps, regex });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      remarks: ['']
    })
    this.getSnapShot();
    
  }
  RegistrationStatus: any = '';

  getSnapShot() {
    this.activatedRoute.url.subscribe(url => {
      this.loader = true;
      this.userDetails = this.auth.getUser();
      this.data = {}
      this.tabKey = [];
      this.tabValue = [];
      this.path = this.activatedRoute.snapshot.paramMap.get('id');
      this.tab = this.activatedRoute.snapshot.paramMap.get('type');
      this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
      this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      });

      this.loadFinanace();


      this.common.setMasterConfig();
      this.common.getMasterConfig$.subscribe(data => {
        this.masterConfig = {
          dateformat: new Date(data.dateformat),
          datetimeformat: new Date(data.datetimeformat),
        }
      });

      this.activatedRoute.queryParams.subscribe(filter => {
        this.registrationStatus();

        this.paymetFilter = filter;

        if (Object.keys(filter).length === 0) {
          this.paymetBtn = false
        } else {
          this.paymetBtn = true
        }
      });

      if (this.path !== null) {
        var spname = this.tab == 'personal' || this.tab == 'payment' ? "usp_unfyd_haw_personal" : this.tab == 'contact' ? 'usp_unfyd_haw_contact' : this.tab == 'pcc' ? 'usp_unfyd_haw_pcc' : this.tab == 'medical' ? 'usp_unfyd_haw_medical' : this.tab == 'training' ? 'usp_unfyd_haw_training' : this.tab == 'other' ? 'usp_unfyd_haw_other' : this.tab == 'documents' ? 'usp_unfyd_contact_kyc_fileurl' : '';
        var flag = this.tab == 'documents' ? 'GET' : 'EDIT';
        this.editLink = this.tab == 'personal' ? "personal-details" : this.tab == 'contact' ? "contact-details" : this.tab == 'other' ? 'other-details' : this.tab == 'pcc' ? 'pcc-details' : this.tab == 'medical' ? 'medical-details' : this.tab == 'training' ? 'training-details' : this.tab == 'documents' ? 'documents' : '';
        if (this.tab == "documents") {
          this.requestObj = {
            data: {
              spname: spname,
              parameters: {
                flag: flag,
                productid: 1,
                processid: this.userDetails.Processid,
                contactid: this.path,
              }
            }
          }
        } else {
          this.requestObj = {
            data: {
              spname: spname,
              parameters: {
                flag: flag,
                hawkerid: this.path
              }
            }
          }
        }
        this.api.post('index', this.requestObj).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.loader = false;
            var temp = res.results.data[0];

            if (this.tab == 'personal') {
              this.data = {
                "Application Date": temp?.ApplicationDate,
                "id": temp?.Id,
                "Title": temp?.Salutation,
                "First Name": temp?.FirstName,
                "Middle Name": temp?.MiddleName,
                "Last Name": temp?.LastName,
                "Gender": temp?.Gender,
                "Date of Birth": temp?.DOB,
                "Relation": temp?.RelativeOf,
                "Care of": temp?.RelativeName,
                "Nationality": temp?.Nationality,
                "Religion": temp?.Religion,
                "Caste": temp?.Caste,
                "Qualification": temp?.EducationQual,
                "Blood Group": temp?.BloodGroup,
                "Mother Tongue": temp?.MotherTongue,
                "Languages Known": temp?.LanguagesKnown,
                "Marital Status": temp?.MaritalStatus,
                "Uniform Size": temp?.UniformSize,
                "Specially Abled": temp?.SpeciallyAbled,
                "Covid Vaccination Certificate": temp?.CovidVaxCertificateStatus,
              }
            } else if (this.tab == 'contact') {
              this.data = [
                {
                  "Mobile Number": temp?.MobileNo,
                  "Alternate Number": temp?.AlternateNumber,
                  "Emergency Contact Person Name": temp?.EmergencyContactName,
                  "Emergency Contact Number": temp?.EmergencyContactNumber,
                  "Email ID": temp?.EmailId,
                  "Mobile Handset Model": temp?.HandsetModel,
                  "Data Enabled": temp?.MobiledataStatus,
                },
                {
                  "Do you use WhatsApp?": temp?.EnableWhatsapp,
                  "WhatsaApp Number": temp?.WhatsappNumber,
                }, {
                  "Present Address": {
                    "House no./ Flat no. / Building name": temp?.PresentAddress,
                    "Street name": temp?.PresentAddressStreetName,
                    "Area / Locality": temp?.PresentAddressArea,
                    "Country": temp?.PresentAddressCountry,
                    "State": temp?.PresentAddressState,
                    "District": temp?.PresentAddressDistrict,
                    "City / Village / Ward / Municipality": temp?.PresentAddressCity,
                    "Post Office": temp?.PostOfficePresentAddress,
                    "Block/Municipality": temp?.BlockPresentAddress,
                    "Pin Code": temp?.PresentAddressPincode,
                    "Police Station": temp?.PoliceStationPresentAddress,
                  }
                }, {
                  "Permanent Address": {
                    "House no./ Flat no. / Building name": temp?.PermanentAddress,
                    "Street name": temp?.PermanentAddressStreetName,
                    "Area / Locality": temp?.PermanentAddressArea,
                    "Country": temp?.PermanentAddressCountry,
                    "State": temp?.PermanentAddressState,
                    "District": temp?.PermanentAddressDistrict,
                    "City / Village / Ward / Municipality": temp?.PermanentAddressCity,
                    "Post Office": temp?.PostOfficePermanentAddress,
                    "Block/Municipality": temp?.BlockPermanentAddress,
                    "Pin Code": temp?.PermanentAddressPincode,
                    "Police Station": temp?.PoliceStationPermanentAddress,
                  }
                }, {
                  "Photo ID Proof Type": temp?.PhotoIDProofType,
                  "Photo ID Number": temp?.PhotoIDProofNum,
                  "Photo ID" : temp?.IsPhotoIDAttachment,
                  "Address Proof Type": temp?.AddressProofType,
                  "Address Proof Number": temp?.AddressProofNum,
                  "Address Proof": temp?.IsAddressProofAttachment,
                  "Signature": temp?.SignatureStatus
                }
              ]
            } else if (this.tab == 'other') {

              if(temp?.LifeInsuranceStatus == 'Active'){
              this.data = {
                "Products": temp?.ProductsServices,
                "Operating Coach": temp?.CoachTrainOperatingStn,
                "Batch Id": temp?.BatchId,
                "Referred By" : temp?.RefferdBy,
                "ER Submission Date": temp?.AppSubmissionDateToAdmin,
                "Approval Status": temp?.AppApprovalStatusFromAdmin,
                "Approval Date": temp?.AppApprovalDateByAdmin,
                "Registration Location": temp?.RegistrationLocation,
                "Registration Number": temp?.RegistrationNo,
                "ID Card Issued": temp?.IdCardReceipt,
                "Uniform Issued": temp?.UniformReceipt,
                "Issued Date": temp?.ReceiptDate,
                "Life Insurance Status": temp?.LifeInsuranceStatus,
                "Policy Number": temp?.PolicyNumber,
                "Policy Provider": temp?.PolicyProvider,
                "Cover Details": temp?.CoverDetails,
                "From Date": temp?.FromDate,
                "To Date": temp?.ToDate,
              }
              } else {
                this.data = {
                  "Products": temp?.ProductsServices,
                  "Operating Coach": temp?.CoachTrainOperatingStn,
                  "Batch Id": temp?.BatchId,
                  "Referred By" : temp?.RefferdBy,
                  "ER Submission Date": temp?.AppSubmissionDateToAdmin,
                  "Approval Status": temp?.AppApprovalStatusFromAdmin,
                  "Approval Date": temp?.AppApprovalDateByAdmin,
                  "Registration Location": temp?.RegistrationLocation,
                  "Registration Number": temp?.RegistrationNo,
                  "ID Card Issued": temp?.ReceiptDate,
                  "Uniform Issued": temp?.UniformReceipt,
                  "Life Insurance Status": temp?.LifeInsuranceStatus,
                }
              }
            } else if (this.tab == 'pcc') {
              this.data = {
                "Initiaiton Date": temp?.PCCInitiaitonDate,
                "PCC Reference Number": temp?.PCCAppRefNo,
                "Police Station": temp?.PoliceStationName,
                "Verification Status": temp?.PoliceVerificationStatus,
                "Valid From": temp?.PCCValidFromDate,
                "Valid To": temp?.PCCValidToDate,
                "PCC Certificate": temp?.PoliceClearCertStatus
              }
            } else if (this.tab == 'medical') {
              this.data = {
                "Medical Test Initiation Date": temp?.MedicalTestInitiationDate,
                "Medical Test Status": temp?.MedicalTestStatus,
                "Medical Test Date": temp?.MedicalTestDate,
                "Medical Test Reference Number" : temp?.MedicalTestReferenceNumber,
                "Medical Test Result Date": temp?.MedicalTestResultDate,
                "Hospital Name" : temp?.HospitalName,
                "Doctor Name" : temp?.DoctorName,
                "Medical Certificate": temp?.MedicalTestReportUploadStatus
              }
            } else if (this.tab == 'training') {
              this.getBusinessUnit(temp);
              this.data = {
                "Initiation Date": temp?.TrainingInitiationDateTime,
                // "Business Unit": temp?.BusinessUnit,
                "Business Unit": this.businessUnit,
                "Completion Status": temp?.TrainingCompletionStatus,
                "Completion Date": temp?.TrainingCompletionDateTime
              }
            } else if (this.tab == 'payment') {
              this.componentData = {
                contactid: temp?.HawkerID,
                registration: temp?.RegistrationNo,
                RegistrationStatus: temp?.RegistrationStatus,
                hawkerfirstname: temp?.FirstName,
                hawkermiddlename: temp?.MiddleName,
                hawkerlastname: temp?.LastName
              }
            } else if (this.tab == 'documents') {
              for (let data of res.results.data) {
                var kycObj = {
                  'Sr No': '',
                  "Actionable": data.AttachmentUrl,
                  'Document Type': data.Category,
                  'Created On': data.CreatedOn,
                }
                this.tabValue.push(kycObj);
              }
              for (var key in this.tabValue[0]) {
                if (this.tabValue[0].hasOwnProperty(key)) {
                  this.tabKey.push(key);
                }
              }
            }
          } else {
            this.loader = false;
          }
        },
          (error) => {
            this.loader = false;
            this.common.snackbar("General Error");
          })
      }
    })
  }

  businessUnit: any;
  getBusinessUnit(data){
    this.api.get1('jsonSer?Action=GetBusinessUnits').subscribe(res => {
      this.businessUnit = res['Data']['BusinessUnits'].find(e => e.BizUnitID === data.BusinessUnit).BizUnitName;
      this.data = {
        "Initiation Date": data?.TrainingInitiationDateTime,
        // "Business Unit": data?.BusinessUnit,
        "Business Unit": this.businessUnit,
        "Completion Status": data?.TrainingCompletionStatus,
        "Completion Date": data?.TrainingCompletionDateTime
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  remarkValidation(event) {
    if (this.form.get('remarks').value) {
      this.submit(event);
    } else {
      this.Remarkstatus = true
    }
  }

  keepOrder = (a) => {
    return a;
  }

  action(type) {
    if (type == 'edit') {
      this.router.navigate(['masters/beneficiary/' + this.editLink + '/' + this.path]);
    }
  }
  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid: this.path,
    }
    this.common.setSingleImage(data)
  }

  openDialog(type, data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
      width: 'auto'
    });
    dialogRef.afterClosed().subscribe(status => {
    });
  }

  setItemsPerPage(e) {
    this.itemsPerPage = e
  }

  submit(event) {
    this.loader = true;
    // if(this.Remarkstatus == false){
    let obj = {
      data: {
        spname: 'usp_unfyd_haw_personal',
        parameters: {
          flag: 'update_registration_status',
          hawkerid: this.path,
          registrationstatus: this.userDetails.RoleType == 'Supervisor' && event == 'Approved' ? 'Pending-CC' : this.userDetails.RoleType == 'ER Officer' && event == 'Approved' ? 'Active' : this.userDetails.RoleType == 'Supervisor' && event == 'Reject' ? 'Reject-Supervisor' : this.userDetails.RoleType == 'ER Officer' && event == 'Reject' ? 'Reject-ER' : '',
          hawkerstatusid: this.userDetails.RoleType == 'Supervisor' && event == 'Approved' ? 21 : this.userDetails.RoleType == 'ER Officer' && event == 'Approved' ? 1 : this.userDetails.RoleType == 'Supervisor' && event == 'Reject' ? 18 : this.userDetails.RoleType == 'ER Officer' && event == 'Reject' ? 19 : '',
          erstatus: this.userDetails.RoleType == 'Supervisor' ? '' : 'Completed'
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        if (this.userDetails.RoleType == 'ER Officer' &&  event == 'Approved') {
          this.insertHawker(this.data.id);
        }
        this.updateStatusRegistration(event, this.form.get('remarks').value)

        this.common.snackbar("Success");
      } else {
        this.common.snackbar("Success");
      }
      if (this.userDetails.RoleType == 'ER Officer') {
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
    // }
  }

  insertHawker(id) {
    this.loader = true;
    var dob = new Date(this.data['Date of Birth']);
    var tempDate = dob.getDate();
    var date = tempDate.toString().length == 1 ? '0' + tempDate : tempDate;
    var tempMonth = dob.getMonth() + 1;
    var month = tempMonth.toString().length == 1 ? '0' + tempMonth : tempMonth;
    var tempYear = dob.getFullYear().toString().slice(-2);
    var year = tempYear.toString().length == 1 ? '0' + tempYear : tempYear;
    var username = 'HAW' + year + month + String(id).padStart(5, '0');
    var password = this.data['First Name'].toLowerCase().substring(0, 4) + date + month;

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_haw_Login',
        parameters: {
          flag: 'INSERT',
          createdby: this.userDetails.Id,
          hawkerid: this.path,
          username: username,
          password: this.common.setEncrypted('123456$#@$^@1ERF', password),
          firstname: this.data['First Name'],
          lastname: this.data['Last Name'],
          employeeid: this.path,
          emailid: null,
          firsttimelogin: true,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      });

      this.genetateQRCode(username);


  }

  updateStatusRegistration(event, remarks) {

    let obj = {
      data: {
        spname: 'usp_unfyd_haw_approval_process',
        parameters: {
          flag: 'INSERT',
          status: this.userDetails.RoleType == 'Supervisor' && event == 'Approved' ? 21 : this.userDetails.RoleType == 'ER Officer' && event == 'Approved' ? 1 : this.userDetails.RoleType == 'Supervisor' && event == 'Reject' ? 18 : this.userDetails.RoleType == 'ER Officer' && event == 'Reject' ? 19 : '',
          remarks: remarks,
          hawkerid: this.path,
          processid: this.userDetails.Processid,
          productid: 1,
          approvedby: event == 'Approved' ? this.userDetails.UserName : '',
          rejectedby: event == 'Reject' ? this.userDetails.UserName : '',
          role: this.userDetails.role,
          createdby: this.userDetails.Id,
          publicip: this.userDetails.Ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.router.navigate(['masters/beneficiary']);
      }
    })
  }

  loadFinanace() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_haw_personal',
        parameters: {
          flag: 'GET_FOR_FINANCE',
          processid: this.userDetails.Processid,
          productid: 1,
          hawkerid: this.path,
          firstname: null,
          middlename: null,
          lastname: null,
          mobilenumber: null
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        var temp = res.results.data[0];
        if (temp) {
          this.componentData = {
            display: false,
            contactid: temp['Applicant Id'],
            registration: temp['Registration No'],
            hawkerfirstname: temp['First Name'],
            hawkermiddlename: temp['Middle Name'],
            hawkerlastname: temp['Last Name'],
            mobileNo: temp['MobileNo'],
            uniformsize: temp['UniformSize'],
          }
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      });
  }

  genetateQRCode(RegistrationNo) {
    let personalDetailsObj = {
      data: {
        spname: 'usp_unfyd_haw_personal',
        parameters: {
          flag: 'EDIT',
          hawkerid: this.path
        }
      }
    }
    this.api.post('index', personalDetailsObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        if (res.results.data[0].RegistrationNo == '' || res.results.data[0].RegistrationNo == null) {
          let updateRegistrationID = {
            "data": {
              "spname": "usp_unfyd_haw_personal",
              "parameters": {
                "flag": "UPDATE_REGISTRATION_NO",
                "hawkerid": this.path,
                "RegistrationNo": RegistrationNo
              }
            }
          }
          this.api.post('index', updateRegistrationID).subscribe(res => {
            this.loader = false;
            
            if (res.code == 200) {
              let personalData = res.results.data[0];
              if (RegistrationNo != undefined) {
                var personalDeatils = { ...personalData, RegistrationNo };
              } else {
                var personalDeatils = { ...personalData };
              }
              this.openDialog('QRcode', personalDeatils)
            }
          })
        }
      }
    })
  }
  registrationStatus() {
    var requestObj = {
      data: {
        spname: 'usp_unfyd_haw_personal',
        parameters: {
          flag: 'EDIT',
          hawkerid: this.path
        }
      }
    }
    this.api.post('index', requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        this.RegistrationStatus = res.results.data[0]?.RegistrationStatus;
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      });
  }

  activeReactive(status) {
    const dialogRef = this.dialog.open(DialogComponent, {
        data: {
            type: 'blockList'
        },
        width: '400px',
    });

    dialogRef.afterClosed().subscribe(remark => {
        if (remark !== false) {
            if (status == 'Blacklist') {
                this.requestObj = {
                    data: {
                        spname: "usp_unfyd_blacklist",
                        parameters: {
                            flag: 'INSERT',
                            hawkerid: this.path,
                            remarks: remark,
                            processid: this.userDetails.Processid,
                            productid: 1,
                            createdby: this.userDetails.Id,
                            status: 1,
                            publicip: this.userDetails.ip,
                            privateip: "",
                            browsername: this.userDetails.browser,
                            browserversion: this.userDetails.browser_version,
                            isdeleted: ""
                        }
                    }
                }
            }
            if (status == 'Reactivate') {
                this.requestObj = {
                    data: {
                        spname: "usp_unfyd_haw_personal",
                        parameters: {
                            flag: 'reactivate_blacklisted_hawker',
                            reactivationremarks: remark,
                            modifiedby: this.userDetails.Id,
                            hawkerid: this.path,
                        }
                    }
                }
            }

            this.api.post('index', this.requestObj).subscribe(res => {
                if (res.code == 200) {
                  this.registrationStatus()
                    this.common.snackbar("Success");
                    // this.getContacts();
                }
            },
                (error) => {
                    this.loader = false;
                    this.common.snackbar("General Error");
                })
        }
    })
}
  back(): void {
    this.location.back()
  }
}
