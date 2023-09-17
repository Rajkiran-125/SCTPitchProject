import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, ContactSteps, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  loader: any;
  form: any;
  ContactSteps: any;
  path: any;
  userDetails: any;
  submittedForm: boolean;
  obj: {};
  subscription: Subscription[] = [];
  config: any;
  genderdata: [];
  maritalstatusData: [];
  nationalityData: [];
  religionData: [];
  bloodgroupData: [];
  salutationData: [];
  userLanguageName: any = [];
  userConfig: any;
  updateData: any;
  ContactID: any;
  subscriptionAcitivateData: Subscription[] = [];
  reset: boolean;

  labelName: any;





  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog
  ) {
    Object.assign(this, { masters, ContactSteps });
  }

  ngOnInit(): void {
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.path, "path")
    this.userDetails = this.auth.getUser();
    if (this.path == null) {
      this.path = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        console.log(data, "adminconfig data")
        if (Object.keys(data).length > 0) {
          this.genderdata = JSON.parse(data["Gender"]);
          console.log(this.genderdata, "this.Gender")

          this.maritalstatusData = JSON.parse(data["MaritalStatus"]);
          console.log(this.maritalstatusData, "this.MaritalStatus")

          this.nationalityData = JSON.parse(data["Nationality"]);
          console.log(this.nationalityData, "this.Nationality")

          this.religionData = JSON.parse(data["Religion"]);
          console.log(this.religionData, "this.Religion")

          this.bloodgroupData = JSON.parse(data["BloodGroup"]);
          console.log(this.bloodgroupData, "this.BloodGroup")

          this.salutationData = JSON.parse(data["Salutation"]);
          console.log(this.salutationData, "this.Salutation")

        }
      })
    )
    this.getSnapShot();
    this.getLanguageStorage();


    this.form = this.formBuilder.group({
      profilepic: ['', Validators.nullValidator],
      title: ["", Validators.required],
      // Category: ["", Validators.required],
      firstname: ["", Validators.required],
      middlename: ["", Validators.required],
      lastname: ["", Validators.required],
      gender: ["", Validators.required],
      dob: ["", Validators.required],
      bloodgroup: ["", Validators.required],
      nationality: ["", Validators.required],
      religion: ["", Validators.required],
      language: ["", Validators.required],
      maritalstatus: ["", Validators.required],
    },
      { validator: [checknull('firstname'), checknull('middlename'), checknull('lastname')] },
    )


    if (this.path != null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_contact_personal",
          parameters: {
            flag: "EDIT",
            Id: this.path,

          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        if (res.code == 200) {
          console.log(res, "edit res")
          // this.reset = true
          this.form.controls.profilepic.patchValue(res.results.data[0].ProfileImg)
          this.form.controls.title.patchValue(res.results.data[0].Salutation)
          this.form.controls.firstname.patchValue(res.results.data[0].FirstName)
          this.form.controls.middlename.patchValue(res.results.data[0].MiddleName)
          this.form.controls.lastname.patchValue(res.results.data[0].LastName)
          this.form.controls.gender.patchValue(res.results.data[0].Gender)
          this.form.controls.dob.patchValue(res.results.data[0].DOB)
          this.form.controls.bloodgroup.patchValue(res.results.data[0].BloodGroup)
          this.form.controls.nationality.patchValue(res.results.data[0].Nationality)
          this.form.controls.religion.patchValue(res.results.data[0].Religion)
          this.form.controls.language.patchValue(res.results.data[0].Languages)
          this.form.controls.maritalstatus.patchValue(res.results.data[0].MaritalStatus)
          this.updateData = res.results.data[0]
          console.log(this.updateData, "this.updatedata")
        }
      })

    }

  }


  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });

    this.common.setUserConfig(this.userDetails.ProfileType, 'scheduler');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      console.log(this.userConfig, " this.userConfig")
      console.log(data, " this.userConfig data")

    }))
    this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
      this.form.controls.profilepic.setValue(res.status.attachmenturl);
    }))
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Users', 'click', 'label', 'label', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Users', data)
  }

  uploadDocument(event, category) {
    var data = {
      category: category,
      flag: "INSERT",
      createdby: this.userDetails.Id,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)
    }
  }
  getLanguage() {
    this.obj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }

    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        console.log(res, "language res")
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
        console.log(res.results.data[1][0].UserLanguage, "res.results.data[1][0].UserLanguage")
      }
      // this.languageType = res.results['data']
    })
  }
  getLanguageStorage() {
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))
    console.log('this.LanguageStore all', this.userLanguageName)
    if (this.userLanguageName == null || this.userLanguageName == undefined) {
      this.getLanguage();
    } else {
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }



  submit() {
    this.submittedForm = true;
    // if()
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    if (this.path == null) {
      this.obj = {
        data: {
          spname: 'usp_unfyd_contact_personal',
          parameters: {
            flag: "INSERT",
            ProfileImg: this.form.value.profilepic,
            FirstName: this.form.value.firstname,
            Salutation: this.form.value.title,
            MiddleName: this.form.value.middlename,
            LastName: this.form.value.lastname,
            Gender: this.form.value.gender,
            DOB: this.form.value.dob,
            BloodGroup: this.form.value.bloodgroup,
            Nationality: this.form.value.nationality,
            Religion: this.form.value.religion,
            Languages: this.form.value.language,
            MaritalStatus: this.form.value.maritalstatus,
            // UserType: "",
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            createdby: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PrivateIp: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,


          }
        }
      }
    }
    else {
      this.obj = {
        data: {
          spname: 'usp_unfyd_contact_personal',
          parameters: {
            flag: "UPDATE",
            Id: this.path,
            ProfileImg: this.form.value.profilepic,
            FirstName: this.form.value.firstname,
            Salutation: this.form.value.title,
            MiddleName: this.form.value.middlename,
            LastName: this.form.value.lastname,
            Gender: this.form.value.gender,
            DOB: this.form.value.dob,
            BloodGroup: this.form.value.bloodgroup,
            Nationality: this.form.value.nationality,
            Religion: this.form.value.religion,
            Languages: this.form.value.language,
            MaritalStatus: this.form.value.maritalstatus,
            MODIFIEDBY: this.userDetails.Id,

            CountryCode: this.updateData.countrycode,
            MobileNumber: this.updateData.contactno,
            AlternateMobileNumber: this.updateData.alternateno,
            EmergencyContactNumber: this.updateData.emergencyno,

            PresentAddLine1: this.updateData.housename,
            PresentAddLine2: this.updateData.streetname,
            PresentAddLine3: this.updateData.landmark,
            PresentPincode: this.updateData.pincode,
            PresentDistrict: this.updateData.city,
            PresentState: this.updateData.state,
            PresentCountry: this.updateData.state,

            PresentAddForPermanent: this.updateData.sameaddress,

            PermanentAddLine1: this.updateData.housename,
            PermanentAddLine2: this.updateData.streetname,
            PermanentAddLine3: this.updateData.landmark,
            PermanentPincode: this.updateData.pincode,
            PermanentDistrict: this.updateData.city,
            PermanentState: this.updateData.state,
            PermanentCountry: this.updateData.state,


          }
        }
      }
    }
    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results.data[0].result == "Data added successfully") {
          this.ContactID = res.results.data[0].ContactID
          this.common.contactId.next({ ContactID: this.ContactID })
          this.common.snackbar('Record add')
          this.path = res.results.data[0].ID;

          this.updateData = res.results.data[0];

        }

        if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');

        }
        if (res.results.data[0].result == "Data already exists" && res.results.data[0].Status == false) {
          this.common.snackbar('Data Already Exist');

        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              this.loader = false;
              if (status.status) {
                this.loader = true;
                this.obj = {
                  data: {
                    spname: "usp_unfyd_contact_personal",
                    parameters: {
                      flag: 'ACTIVATE',
                      FirstName: this.form.value.firstname,
                      MiddleName: this.form.value.middlename,
                      LastName: this.form.value.lastname,
                      processid: this.userDetails.Processid,
                      productid: this.userDetails.ProductId,


                    }
                  }
                };
                this.api.post('index', this.obj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.refreshMenu(true);

                    this.common.snackbar('Record add')
                    this.router.navigate(['masters/contact']);






                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
        }

      }
    })


  }


  next() {
    this.submittedForm = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    if (this.path == null) {
      this.obj = {
        data: {
          spname: 'usp_unfyd_contact_personal',
          parameters: {
            flag: "INSERT",
            ProfileImg: this.form.value.profilepic,
            FirstName: this.form.value.firstname,
            Salutation: this.form.value.title,
            MiddleName: this.form.value.middlename,
            LastName: this.form.value.lastname,
            Gender: this.form.value.gender,
            DOB: this.form.value.dob,
            BloodGroup: this.form.value.bloodgroup,
            Nationality: this.form.value.nationality,
            Religion: this.form.value.religion,
            Languages: this.form.value.language,
            MaritalStatus: this.form.value.maritalstatus,
            // UserType: "",
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            createdby: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PrivateIp: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,


          }
        }
      }
    }
    else {
      this.obj = {
        data: {
          spname: 'usp_unfyd_contact_personal',
          parameters: {
            flag: "UPDATE",
            Id: this.path,
            ProfileImg: this.form.value.profilepic,
            FirstName: this.form.value.firstname,
            Salutation: this.form.value.title,
            MiddleName: this.form.value.middlename,
            LastName: this.form.value.lastname,
            Gender: this.form.value.gender,
            DOB: this.form.value.dob,
            BloodGroup: this.form.value.bloodgroup,
            Nationality: this.form.value.nationality,
            Religion: this.form.value.religion,
            Languages: this.form.value.language,
            MaritalStatus: this.form.value.maritalstatus,
            MODIFIEDBY: this.userDetails.Id,


            CountryCode: this.updateData.CountryCode,
            MobileNumber: this.updateData.MobileNumber,
            AlternateMobileNumber: this.updateData.AlternateMobileNumber,
            EmergencyContactNumber: this.updateData.EmergencyContactNumber,
            
            PresentAddLine1: this.updateData.PresentAddLine1,
            PresentAddLine2: this.updateData.PresentAddLine2,
            PresentAddLine3: this.updateData.PresentAddLine3,
            PresentPincode: this.updateData.PresentPincode,
            PresentDistrict: this.updateData.PresentDistrict,
            PresentState: this.updateData.PresentState,
            PresentCountry: this.updateData.PresentCountry,

            PresentAddForPermanent: this.updateData.PresentAddForPermanent,

            PermanentAddLine1: this.updateData.PermanentAddLine1,
            PermanentAddLine2: this.updateData.PermanentAddLine2,
            PermanentAddLine3: this.updateData.PermanentAddLine3,
            PermanentPincode: this.updateData.PermanentPincode,
            PermanentDistrict: this.updateData.PermanentDistrict,
            PermanentState: this.updateData.PermanentState,
            PermanentCountry: this.updateData.PermanentCountry,


          }
        }
      }
    }
    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results.data[0].result == "Data added successfully") {
          this.ContactID = res.results.data[0].ContactID
          this.common.contactId.next({ ContactID: this.ContactID })
          this.common.snackbar('Record add')
          this.path = res.results.data[0].ID;




          this.router.navigate(['masters/contact/contact-details', this.path])
        }

        if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          // this.path = res.results.data[0].ID
          // this.path == null ? res.results.data[0].ID :
          this.router.navigate(['masters/contact/contact-details', this.path])


        }
        if (res.results.data[0].result == "Data already exists" && res.results.data[0].Status == false) {
          this.common.snackbar('Data Already Exist');

        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              this.loader = false;
              if (status.status) {
                this.loader = true;
                this.obj = {
                  data: {
                    spname: "usp_unfyd_contact_personal",
                    parameters: {
                      flag: 'ACTIVATE',
                      FirstName: this.form.value.firstname,
                      MiddleName: this.form.value.middlename,
                      LastName: this.form.value.lastname,
                      processid: this.userDetails.Processid,
                      productid: this.userDetails.ProductId,


                    }
                  }
                };
                this.api.post('index', this.obj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.refreshMenu(true);

                    this.common.snackbar('Record add')
                    this.router.navigate(['masters/contact']);






                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
        }
      }
    })


  }

  nextroute() {
    this.router.navigate(['masters/contact/contact-details'])
  }

  cancleRoute() {
    this.router.navigate(['masters/contact'])
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

}
