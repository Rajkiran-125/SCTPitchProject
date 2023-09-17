import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-fee-type',
    templateUrl: './fee-type.component.html',
    styleUrls: ['./fee-type.component.scss'],
})
export class FeeTypeComponent implements OnInit {
    loader: boolean = false;
    submittedForm = false;
    masters: any;
    form: FormGroup;
    userDetails: any;
    userConfig: any;
    tabValue: any = [];
    tabKey: any = [];
    itemsPerPage: number = 10;
    search: any;
    page: number = 1;
    data: any;
    obj: any;
    id: any;
    GST : any;
    constructor(
        private formBuilder: FormBuilder,
        private common: CommonService,
        private activatedRoute: ActivatedRoute,
        private api: ApiService,
        private router: Router,
        private auth: AuthService,
        private location: Location,
        private el: ElementRef,
        public dialog: MatDialog,
    ) {
        Object.assign(this, { masters });
    }
    ngOnInit(): void {
        this.common.hubControlEvent('FeeType','click','pageload','pageload','','ngOnInit');

        this.getSnapShot();
        this.userDetails = this.auth.getUser();
        this.form = this.formBuilder.group({
            FeeType: ['', Validators.nullValidator],
            PROCESSID: [this.userDetails.Processid],
            PUBLICIP: [this.userDetails.ip],
            BROWSERNAME: [this.userDetails.browser],
            BROWSERVERSION: [this.userDetails.browser_version]
        });
        this.getFee();
        this.common.hubControlEvent('FeeType','click','pageloadend','pageloadend','','ngOnInit');

    }
    get(event: any) {
        if (event == 'Service') {
            this.data.forEach(element => {
                if(element.FeeType == event)
                {
                    this.GST = element;
                }
            });
            this.tabValue = [];
            this.tabKey = [];
            var Obj = {
                "data": {
                    "spname": "usp_unfyd_fee_payment",
                    "parameters": {
                        "flag": "GETFEE",
                        "processid": this.userDetails.Processid,
                        "productid": 1
                    }
                }
            };
        }
        else {
            this.tabValue = [];
            this.tabKey = [];
        }
        this.common.hubControlEvent('FeeType','click','','',JSON.stringify(Obj),'get');

        this.api.post('index', Obj).subscribe(res => {
            if (res.code == 200) {
                this.loader = false;
                this.tabValue = res.results.data;
                for (var key in this.tabValue[0]) {
                    if (this.tabValue[0].hasOwnProperty(key)) {
                        this.tabKey.push(key);
                    }
                }
            }
        });
    }

    getFee() {
        var Obj = {
            "data": {
                "spname": "usp_unfyd_haw_fee",
                "parameters": {
                    "flag": "EDIT",
                    "processid": this.userDetails.Processid,
                    "productid": 1
                }
            }
        }
        this.common.hubControlEvent('FeeType','click','','',JSON.stringify(Obj),'getFee');

        this.api.post('index', Obj).subscribe(res => {
            if (res.code == 200) {
                this.loader = false;
                this.data = res.results.data;
            }
        });
    }
    getSnapShot() {
        this.common.hubControlEvent('FeeType','click','','','','getSnapShot');

        this.userDetails = this.auth.getUser();
        this.activatedRoute.url.subscribe(url => {
            let path = this.activatedRoute.snapshot.data.title
            this.common.setUserConfig(this.userDetails.ProfileType, path);
            this.common.getUserConfig$.subscribe(data => {
                this.userConfig = data;
            });
        });
    }
    get f() {
        return this.form.controls;
    }
    back(): void {
        this.common.hubControlEvent('FeeType','click','back','back','','back');

        this.location.back()
    }

    openDialog(type, value) {
        if(type == 'edit'){
            this.id = value.Actionable;
        }
        if (type == 'delete') {
            const dialogRef = this.dialog.open(DialogComponent, {
                data: {
                    type: type,
                    title: 'Are you sure?',
                    subTitle: 'Do you want to ' + type + ' this data',
                },
                width: '300px',
            });
            dialogRef.afterClosed().subscribe(status => {
                if (status == true && type == 'delete') {
                    this.obj = {
                        "data": {
                            "spname": "usp_unfyd_fee_payment",
                            "parameters": {
                                "flag": "DELETE",
                                DeletedBy: this.userDetails.Id,
                                Id: this.id
                            }
                        }
                    }
                    this.common.hubControlEvent('FeeType','click','','',JSON.stringify(this.obj),'openDialog');

                    this.api.post('index', this.obj).subscribe(
                        (res: any) => {
                            if (res.code == 200) {
                                this.loader = false;
                                this.router.navigate(['masters/fee-type']);
                                this.common.snackbar("Success");
                            } else {
                                this.loader = false;
                            }
                        },
                        (error) => {
                            this.loader = false;
                            this.common.snackbar("General Error");
                        }
                    );
                }
            })
        }
        else {
            const dialogRef = this.dialog.open(DialogComponent, {
                data: {
                    type: type,
                    data: value
                },
                width: '80%'
            });
            dialogRef.afterClosed().subscribe(res => {
                if (res.status !== null && res.status !== undefined) {
                    if (res.type == 'add') {
                        this.obj = {
                            "data": {
                                "spname": "usp_unfyd_fee_payment",
                                "parameters": {
                                    "flag": "INSERT",
                                    "processid": this.userDetails.Processid,
                                    "productid": 1,
                                    CREATEDBY: this.userDetails.Id,
                                    PaymentType: res.data.PaymentType,
                                    Amount: parseInt(res.data.Amount),
                                    GST: (res.data.HSNCode),
                                    Discount: parseInt(res.data.Discount),
                                    State: res.data.State
                                }
                            }
                        }
                    }
                    else {
                        this.obj = {
                            "data": {
                                "spname": "usp_unfyd_fee_payment",
                                "parameters": {
                                    "flag": "UPDATE",
                                    MODIFIEDBY: this.userDetails.Id,
                                    Id: this.id,
                                    PaymentType: res.data.PaymentType,
                                    Amount: parseInt(res.data.Amount),
                                    GST: (res.data.HSNCode),
                                    Discount: parseInt(res.data.Discount),
                                    State: res.data.State
                                }
                            }
                        }
                    }
                    this.common.hubControlEvent('FeeType','click','','',JSON.stringify(this.obj),'openDialog');

                    this.api.post('index', this.obj).subscribe(                         //every  api response in fee component                
                        (res: any) => {
                            if (res.code == 200) {
                                this.loader = false;
                                this.router.navigate(['masters/fee-type']);
                                this.common.snackbar("Success");
                            } else {
                                this.loader = false;
                            }
                        },
                        (error) => {
                            this.loader = false;
                            this.common.snackbar("General Error");
                        }
                    );
                }
            });
        }
    }
}