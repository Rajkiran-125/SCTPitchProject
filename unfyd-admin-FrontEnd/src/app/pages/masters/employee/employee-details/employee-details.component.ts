import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { employeeDetailsSteps, regex, masters } from 'src/app/global/json-data';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {

  loader: boolean = false;
  data: any;
  commonObj: any;
  userDetails: any;
  contactId: any;
  tab: any;
  tabKey: any = [];
  tabValue: any = [];
  editLink: any;
  employeeDetailsSteps: string[] = [];
  regex: any;
  requestObj: any;
  userConfig: any;
  page: number = 1;
  search: any;
  itemsPerPage: number = 10;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService
  ) {
    Object.assign(this, { employeeDetailsSteps, regex, masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('beneficiary','click','pageload','pageload','','ngOnInit');
    this.common.hubControlEvent('beneficiary','click','pageloadend','pageloadend','','ngOnInit');

    this.getSnapShot();
  }

  setItemsPerPage(e) {
    this.common.hubControlEvent('beneficiary','click','','',e,'setItemsPerPage');

    this.itemsPerPage = e
  }

  getSnapShot() {
    this.activatedRoute.url.subscribe(url => {
      this.loader = true;
      this.userDetails = this.auth.getUser();
      this.contactId = this.activatedRoute.snapshot.paramMap.get('id');
      this.tab = this.activatedRoute.snapshot.paramMap.get('type');

      this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
      this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      });
      this.data = {}
      this.tabKey = [];
      this.tabValue = [];

      if (this.contactId !== null) {
        var spname = this.tab == 'personal' ? "usp_unfyd_emp_personal" : this.tab == 'social' ? 'usp_unfyd_emp_social' : this.tab == 'bank' ? 'usp_unfyd_emp_bank' : this.tab == 'professional' ? 'usp_unfyd_emp_professional' : this.tab == 'academic' ? 'usp_unfyd_emp_academic' : this.tab == 'other' ? 'usp_unfyd_emp_other' : this.tab == 'kyc' ? 'usp_unfyd_emp_kyc_fileurl' : '';
        var flag = this.tab == 'kyc' ? 'GET' : 'EDIT';
        this.editLink = this.tab == 'personal' ? "personal-details" : this.tab == 'social' ? 'social-details' : this.tab == 'bank' ? 'bank-details' : this.tab == 'professional' ? 'professional-details' : this.tab == 'academic' ? 'academic-details' : this.tab == 'other' ? 'other-details' : this.tab == 'kyc' ? 'kyc' : '';

        if (this.tab == 'kyc' || this.tab == 'personal') {
          this.requestObj = {
            data: {
              spname: spname,
              parameters: {
                flag: flag,
                processid: this.userDetails.Processid,
                productid: 1,
                contactid: this.contactId
              }
            }
          }
        }
        else {
          this.requestObj = {
            data: {
              spname: spname,
              parameters: {
                flag: flag,
                contactid: this.contactId
              }
            }
          }
        }
        this.common.hubControlEvent('beneficiary','click','','',JSON.stringify(this.requestObj),'getSnapShot');

        this.api.post('index', this.requestObj).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.loader = false;
            var temp = res.results.data[0];
            if (this.tab == 'personal') {
              this.data = {
                "Salutation": temp.Salutation,
                "First Name": temp.FirstName,
                "Middle Name": temp.MiddleName,
                "Last Name": temp.LastName,
                "Gender": temp.Gender,
                "Date of Birth": this.datePipe.transform(temp.DOB, regex.dateFormat),
                "Religion": temp.Religion,
                "Marital Status": temp.MaritalStatus,
                "Date of Marriage": this.datePipe.transform(temp.DateOfMarriage, regex.dateFormat),
                "Mother Tongue": temp.MotherTongue,
                "Languages Known": temp.Languages,
                "Mobile Number": temp.MobileNumber,
                "Alternate Mobile No.": temp.AlternateMobileNumber,
                "Emergency Contact Name": temp.EmergencyContactName,
                "Emergency Contact No.": temp.EmergencyContactNumber,
                "Relation": temp.Relation,
                "Landline No.": temp.LandlineNumber,
                "Personal Email": temp.PersonalEmail,
                "Country": temp.CountryID,
                "State": temp.StateID,
                "City": temp.CityID,
                "Pin Code": temp.PINCodeID,
                "Address Line 1": temp.AddressLine1,
                "Address Line 2": temp.AddressLine2,
                "Address Line 3": temp.AddressLine3,
                "Current Address": temp.CurrentAddress,
                "Permanent Address": temp.PermanentAddress,
                "Communication Address": temp.CommunicationAddress,
                "Caste": temp.Caste,
                "Is Caste Certificate Submitted": temp.IsCasteCertificateSubmitted,
                "Medical History": temp.MedicalHistory,
                "Medical History If Other": temp.MedicalHistoryIfOther,
                "Is Aadhaar Card Uploaded ?": temp.IsAadharCardUploaded,
                "Is PAN Card uploaded ?": temp.IsPANCardUploaded,
                "Age Proof": temp.AgeProof,
                "Passport": temp.Passport,
                "Ration Card": temp.RationCard,
                "Driving License": temp.DrivingLicense,
                "Is Signature Uploaded ?": temp.IsSignatureUploaded,
                "Nationality": temp.Nationality,
                "Is Photograph Uploaded?": temp.IsPhotographUploaded,
                "Health Insurance Check": temp.IsHealthInsuranceCheck,
                "Blood Group": temp.BloodGroup,
                "Address Proof Type": temp.AddressProofType,
                "Covid Vaccination Status": temp.CovidVaccinationStatus
              }
            } else if (this.tab == 'social') {
              this.data = {
                "WhatsApp No.": temp.WhatsAppNumber,
                "Authorising WhatsApp": temp.AuthorisingWhatsApp,
                "Facebook ID": temp.FacebookID,
                "Twitter Handle": temp.TwitterHandle,
                "Linkedin ID": temp.LinkedIn,
                "Skype ID": temp.Skype,
                "Instagram ID": temp.Instagram,
              }
            } else if (this.tab == 'bank') {
              this.data = {
                "Account No.": temp.AccountNumber,
                "IFSC Code": temp.IFSC,
                "Bank Name": temp.BankName,
              }
            } else if (this.tab == 'professional') {
              this.data = {
                "Official Email": temp.OfficialEmail,
                "Is Differently Abled ?": temp.IsPhysicallyChallenged,
                "Is Reference Check Done ?": temp.IsReferenceCheckDone,
                "Is Police Verification Done ?": temp.IsPoliceVerificationDone,
                "Any Ongoing Cases ?": temp.AnyOngoingCases,
                "Account No.": temp.AccountNumber,
                "Organization Name": temp.OrganizationName,
                "Designation ID": temp.DesignationID,
                "Employee ID": temp.EmployeeID,
                "Employee Type": temp.EmployeeType,
                "Employee Status": temp.EmployeeStatus,
                "Reporting to": temp.ReportingTo,
                "Department": temp.Department,
                "Is Resume uploaded ?": temp.IsResumeUploaded,
                "Offer Letter": temp.IsOfferLetterUploaded,
                "Is Appointment Letter / Consultant Agreement uploaded ?": temp.IsAptLtrCnsltAgmtUploaded,
                "Is RelievingLetter / Resignation Acceptance Letter uploaded ?": temp.RlvgLtrResgAcceptanceLtr,
                "Operating Location": temp.OperationLocation,
                "Date Of Joining": this.datePipe.transform(temp.DateOfJoining, regex.dateFormat),
                "Date Of Leaving": this.datePipe.transform(temp.DateOfLeaving, regex.dateFormat),
                "Date Of Confirmation": this.datePipe.transform(temp.DateOfConfirmation, regex.dateFormat),
                "BAND": temp.BAND,
                "CTC": temp.CTC,
                "Salary Slips": temp.SalarySlips,
                "Form 16": temp.Form16,
                "Reference check form filled": temp.RefCheckFormFilled,
                "Service Area": temp.ServiceArea,
                "Industry Type": temp.IndustryType,
              }
            } else if (this.tab == 'academic') {
              this.data = {
                "Education Qualification": temp.EducationQual,
                "SSC Certificate": temp.SSCHSCDegreeCert,
                "Post Graduation Certificate": temp.PostGradCert,
                "Other Qualification Certificate": temp.OtrQualCert,
              }
            } else if (this.tab == 'other') {
              this.data = {
                "Medical Initiation Date": this.datePipe.transform(temp.MedTestInitiationDate, regex.dateFormat),
                "Medical Status": temp.MedTestStatus,
                "Medical Result Date": this.datePipe.transform(temp.MedTestResultDate, regex.dateFormat),
                "Is Medical Clearance Report Uploaded ?": temp.IsMedTestReportUploaded,
                "Police Verification Status": temp.PoliceVerificationStatus,
                "Police Verification Initiation Date": this.datePipe.transform(temp.VerificationInitiationDate, regex.dateFormat),
                "Is Police Clearance Attached": temp.IsPoliceClearanceAttached,
                "Undertaking If Applicable": temp.UndertakingIfApplicable,
                "PF UAN Details If Applicable": temp.PFUANDetailsIfApplicable,
              }
            } else if (this.tab == 'kyc') {
              for (let data of res.results.data) {
                var kycObj = {
                  SrNo: '',
                  Action: data.AttachmentUrl,
                  Category: data.Category,
                  CreatedOn: this.datePipe.transform(data.CreatedOn, regex.dateTimeFormat),
                }
                this.tabValue.push(kycObj);
              }
              this.tableHead()
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

  tableHead() {
    this.common.hubControlEvent('beneficiary','click','','','','tableHead');

    for (var key in this.tabValue[0]) {
      if (this.tabValue[0].hasOwnProperty(key)) {
        this.tabKey.push(key);
      }
    }
  }

  keepOrder = (a) => {
    return a;
  }

  action(type) {
    this.common.hubControlEvent('beneficiary','click','','',type,'action');

    if (type == 'edit') {
      this.router.navigate(['masters/employee/' + this.editLink + '/' + this.contactId]);
    }
  }

  viewDocument(val, type) {
    this.common.hubControlEvent('beneficiary','click','','',type,'viewDocument');

    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid: this.contactId,
    }
    this.common.setSingleImageEmp(data)
  }

  view(data) {
    this.common.hubControlEvent('beneficiary','click','','',JSON.stringify(data),'view');

    this.openDialog('fileView', data)
  }

  openDialog(type, data) {
    this.common.hubControlEvent('beneficiary','click','','',JSON.stringify(data),'openDialog');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
      width: '748px'
    });
    dialogRef.afterClosed().subscribe(status => {
    });
  }
}
