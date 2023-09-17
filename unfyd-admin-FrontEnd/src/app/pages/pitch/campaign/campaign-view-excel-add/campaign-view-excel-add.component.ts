import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import { DatePipe, Location } from '@angular/common';
import { AuthService } from 'src/app/global/auth.service';
import { ExcelService } from 'src/app/global/excel.service';
import { CommonService } from 'src/app/global/common.service';
import { NotificationMessages, ValidationMessages } from '../../pitch-json-data';
import { Subscription, interval } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-campaign-view-excel-add',
  templateUrl: './campaign-view-excel-add.component.html',
  styleUrls: ['./campaign-view-excel-add.component.scss']
})
export class CampaignViewExcelAddComponent implements OnInit {
  campaignId: any;
  CampaignName:any;
  StartTime: any;
  EndTime: any;
  ChannelSource = [];
  ChannelName: any;
  progressValue: number = 0;
  InitialExcelfileName: any = [];
  excelFileUpload: any = [];
  userDetails: any;
  temp: any;
  excelFileName: any;
  progressInterval: Subscription;
  showThrottling: any = false;
  structureListArr: any = [];
  UploadedAudienceList = [];
  Audiencelistname: any;
  selectedStructureName: any;

  constructor(
    private pitchCommon: PitchCommonService,
    private location: Location,
    private auth: AuthService,
    public datepipe: DatePipe,
    private excelService: ExcelService,
    public common: CommonService,
    private api: ApiService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      // console.log(params); 
      const id = params.get('id');
      if (id) {
        this.campaignId = id;
      }
    });
    this.getUploadedAudienceListByCampaignId();

    this.CampaignName = this.pitchCommon.CampaignName;
    this.ChannelName = this.pitchCommon.ChannelName;
    this.ChannelSource = this.pitchCommon.ChannelSource;
    //console.log(this.ChannelSource);
    this.StartTime = this.pitchCommon.StartTime;
    this.EndTime = this.pitchCommon.EndTime;
  }
  @ViewChild('UploadExcel', { static: false }) UploadExcel: ElementRef;


 
  // getStructureList(){
  //   var Obj = {
  //      "data": {
  //          "spname": "usp_unfyd_geud_structurelist",
  //          "parameters": {
  //              "flag": "GET"
  //          }
  //      }
  //   }
  //    this.api.post('pitch/index', Obj).subscribe((res: any) => {
  //      if (res.code == 200) {
  //        this.structureListArr = res.results.data;
  //        console.log(this.structureListArr); 
  //      }
  //    });
  //  }

  getUploadedAudienceListByCampaignId() {
    var Obj = {
      "data": {
        "spname": "usp_unfyd_getaudiencelistbycampaignid",
        "parameters": {
          "campaignid": this.campaignId ? this.campaignId : ''
        }
      }
    }
    this.api.post('pitch/index', Obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.UploadedAudienceList = res.results.data;
        this.Audiencelistname = res.results.data[0].Audiencelistname;
        //  console.log( res.results.data[0].Audiencelistname);
        this.selectedStructureName = res.results.data[0].StructureId;
        console.log(this.UploadedAudienceList);
      }
    });
  }

  UploadCampaignExcel(event) {

    this.progressValue = 0;
    console.log(event);
    this.InitialExcelfileName.push(event.target.files[0].name)
    console.log(this.InitialExcelfileName);
    var file = event.target.files[0];
    // var size = Math.round(file.size / 1024);
    var extension = file.type;
    // const formData = new FormData();
    var filename = this.userDetails.Id + '_Campaign_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');

    let filetype = event.target.files[0].type
    if (filetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setTimeout(() => {
        this.excelService.importExcel(event)
        setTimeout(() => {
          this.temp = JSON.parse(JSON.stringify(this.excelService.getJson()));
          this.excelFileUpload.push({ name: filename, status: false, file: file, data: this.temp })
          //this.excelFileUploadName.push({name:this.InitialExcelfileName,status:false,file:file,data:this.temp})
          //console.log('test', this.excelFileUpload);
        }, 100)
      }, 100);
    }
    else {
      // this.common.snackbar('Please Upload ".xlsx" format file', 'error');
      this.common.snackbar(NotificationMessages.FileFormat);
      return
    }

    setTimeout(() => {
      this.uploadExcelFiles();
    }, 1000);

  }


  uploadExcelFiles() {
    // var file = event.target.files;
    this.progressValue = 0;

    if (this.excelFileUpload.length > 0) {
      this.excelFileUpload.forEach(element => {
        if (!element.status && element.file.type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          const formData = new FormData();
           let AudienceListName = this.Audiencelistname;
           let StructureList = this.selectedStructureName;
          this.excelFileName = element.name;
          var filename = element.name;
          formData.append(filename, element.file);
          formData.append('AudienceListName', AudienceListName);

          // for (var key of formData1.entries()) {
          //   console.log(key[0] + ', ' + key[1]);
          //   }
          // console.log(JSON.stringify(formData));

          formData.append('StructureId', StructureList);
          formData.append('AudienceType', 'Existing');
          formData.append('CampaignId', this.campaignId);

          // element.status = 'uploading'
          console.log(formData);
          //const formDataArray = [...formData];
          // Log the array to the console
          //console.log(formDataArray);

          // this.loader = true;
          this.progressInterval = interval(300).subscribe(() => {
            this.progressValue += 25;
            if (this.progressValue >= 100) {
              this.progressInterval.unsubscribe();
            }
          });

          if (true) {
            (this.api.post('pitch/upload', formData)).subscribe((res) => {
              if (res.code == 200) {
                this.progressValue = 100;
                element.status = true;
                console.log("vishal:", res);
                this.showThrottling = true;
                // this.loader = false;
                this.common.snackbar(NotificationMessages.ExcelUploadSucces);
                this.progressInterval.unsubscribe();
                // this.getColumnValue(); 
              }
            },
              (error: any) => {
                // this.loader = false;
                element.status = false;
                console.log(error);
                this.common.snackbar(error.error.message);
                this.excelFileUpload.splice(-1);
                this.resetFileInput();
                this.progressValue = 0;
                this.progressInterval.unsubscribe();
              });
          }
          //)
        }
      });

    } else if (this.excelFileUpload.length == 0) {
      this.common.snackbar(NotificationMessages.MinOneExcel);
    }
  }

  resetFileInput(): void {
    this.renderer.setProperty(this.UploadExcel.nativeElement, 'value', null);
  }
  removeExcelFileUpload(i) {
    this.excelFileUpload.splice(i, 1);
  }


  downloadSampleExcel() {
    let downloadSampleExcelColumns = [];
    let x = JSON.parse(this.UploadedAudienceList[0].StructureJson);
    console.log(x);
    let obj = {}
    x.forEach(el => {
      Object.assign(obj, { [el.FieldName]: '' });
    });
    downloadSampleExcelColumns = [obj];
    this.excelService.exportExcel(downloadSampleExcelColumns, (`UNFYD_PITCH_${this.UploadedAudienceList[0].StructureName}`).toUpperCase());
    console.log(downloadSampleExcelColumns);
  }


  goBack() {
    this.location.back();
  }


}
