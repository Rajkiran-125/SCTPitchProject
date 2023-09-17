import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
// import { stringify } from 'querystring';
import { checknull, regex } from 'src/app/global/json-data';
import { log } from 'console';
@Component({
  selector: 'app-configuration-webchat',
  templateUrl: './configuration-webchat.component.html',
  styleUrls: ['./configuration-webchat.component.scss']
})
export class ConfigurationWebchatComponent implements OnInit {
  abcd = ''
  formName: any;
  selectedTab: any;
  form: FormGroup;
  userDetails: any;
  requestObj: any;
  language: any;
  botFlowList: any;
  submittedForm: boolean = false;
  loader: boolean = false;
  formData: any = null;
  chatIcon: boolean = false;
  webchatContainer: boolean = false;
  viewWebchat: boolean = false;
  selectedlanguage: any = '';
  iframeURLReload: any = true;
  webchatTileSelectedColor = this.common.WebchatIconData[0];
  tileSelectedColor = this.common.colorArray[0];
  tileURLColor = this.common.colorArray[0];
  tileEmailColor = this.common.colorArray[0];
  tileNumberColor = this.common.colorArray[0];
  colorPalette = this.common.colorArray.concat(this.common.colorArray)
  check: any = false;
  themeColor: any;
  IconData: any;
  chatTitleFocus: boolean = false;
  eyeCatcherFocus: boolean = false;
  item: any;
  PDF: any;
  JPG: any;
  PNG: any;
  EXCEL: any;
  step = 0;
  FACEBOOKSOCIAL: any;
  TWITTERSOCIAL: any;
  INSTAGRAMSOCIAL: any;
  path: any;
  channelSRCID: string;
  webchatChannel: any;
  config: any[] = [];
  allFormsData = [];
  themeColorPallette: any[] = ['Solid', 'Gradient'];
  fileSizeMemory: any = ['KB', 'MB']
  webchat: string;
  productId: string;
  type: string = 'wrap-up';
  fileFormats: any;
  isShowColorAdd: boolean = false;
  isShowGradientColorAdd: boolean = false;
  subscriptionAcitivateData: any;
  data: any;
  @ViewChild('preChatForm') public preChatFormId;
  iframeVisible = false;
  chatComponent = true;
  customThemeColorGradient = '';
  customThemeColorSolid = '';
  setStep(index: number) {
    this.step = index;
  }
  panelOpenState = false;
  subscription: Subscription[] = [];
  colorPallet = this.common.themeColorArray
  hexPallet = this.common.themeColorHexArray
  botFlow: any = 'https://cx1.unfyd.com/webchat/#/chat/';

  keepOrder = (a) => {
    return a;
  }

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private formBuilder: FormBuilder,
    public common: CommonService,
    private auth: AuthService,
    private el: ElementRef,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }


  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.channelSRCID = this.activatedRoute.snapshot.paramMap.get('uniqueid');
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    // this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.getLanguage();
    this.getBotFLow();
    this.getAllForms();

    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.fileFormats = JSON.parse(data["FileFormat"]);
          // console.log("this.fileFormats:", this.fileFormats);

        }
      })
    )

    if (this.channelSRCID) this.editWebchatData();

    this.activatedRoute.queryParams.subscribe(params => {
      this.webchat = params.webchatName;
    })

    this.form = this.formBuilder.group({

      WebchatName: [this.webchat, [Validators.required, Validators.pattern(regex.alphabet)]],
      WebchatScript: ['', [Validators.nullValidator]],
      webchatIconColor: ['', [Validators.nullValidator]],
      themeColor: ['#053c6d', [Validators.nullValidator]],
      themeColorPalletteSelected: ['Solid', [Validators.nullValidator]],
      widgetStyle: ['Modern', [Validators.nullValidator]],
      addThemeColorCode: ['', [Validators.nullValidator]],
      themeColorCode: ['', [Validators.nullValidator, Validators.pattern(regex.hexColorCode)]],
      themePrimaryColorCode: ['', [Validators.nullValidator, Validators.pattern(regex.hexColorCode)]],
      themeSecondaryColorCode: ['', [Validators.nullValidator, Validators.pattern(regex.hexColorCode)]],
      eyeCatcherHeading: ['Hi, There!!', [Validators.nullValidator]],
      eyeCatcherText: ['Welcome', [Validators.nullValidator]],
      eyeCatcher: ['', [Validators.nullValidator]],
      chatIconStyle: ['chat1', [Validators.nullValidator]],
      chatButtonPosition: ['bottom-right', [Validators.nullValidator]],
      chatTitleOnline: ['', [Validators.nullValidator, Validators.pattern(regex.alphabetSpecialCharacter)]],
      chatTitleOffline: ['', [Validators.nullValidator, Validators.pattern(regex.alphabetSpecialCharacter)]],
      sideSpacing: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
      agentAvatar: ['', [Validators.nullValidator]],
      shapeUploaded: ['', [Validators.nullValidator]],
      agentAvatarUploaded: ['', [Validators.nullValidator]],
      botAvatarUploaded: ['', [Validators.nullValidator]],
      notiSoundUploaded: ['', [Validators.nullValidator]],
      bottomSpacing: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
      languageSelected: ['', [Validators.nullValidator]],
      toggleAttachment: ['', [Validators.nullValidator]],
      maxNumberFile: ['', [Validators.nullValidator]],
      textareaCharLimit: ['', [Validators.nullValidator]],
      CharsLimit: ['300', [Validators.required, Validators.pattern(regex.numeric)]],
      sendFileType: ['', [Validators.nullValidator]],
      FileFormatSelected: [['jpg', 'png', 'pdf'], [Validators.nullValidator]],
      singleMultiImage: ['singleFile', [Validators.nullValidator]],
      fileSize: ['1', [Validators.required, Validators.pattern(regex.numeric)]],
      fileSizeMemorySelected: ['MB', [Validators.nullValidator]],
      toggleMic: [false, [Validators.nullValidator]],
      toggleEmoji: [true, [Validators.nullValidator]],
      toggleInputForm: ['', [Validators.nullValidator]],
      toggleCarousel: ['', [Validators.nullValidator]],
      toggleBotFlow: ['', [Validators.nullValidator]],
      botAvatar: ['', [Validators.nullValidator]],
      botFlowSelected: ['', [Validators.nullValidator]],
      carousalStyle: ['', [Validators.nullValidator]],
      urlToggle: ['', [Validators.nullValidator]],
      chatButtonShape: ['chatButtonShape1', [Validators.nullValidator]],
      chatIconUploaded: ['', [Validators.nullValidator]],
      viewSingleMultiImage: ['', [Validators.nullValidator]],
      imageCaption: [true, [Validators.nullValidator]],
      videoPlayback: [true, [Validators.nullValidator]],
      audioPlayback: [true, [Validators.nullValidator]],
      pictureInPicture: [true, [Validators.nullValidator]],
      urlHighlighter: ['blue', [Validators.nullValidator]],
      emailHighlighter: ['blue', [Validators.nullValidator]],
      numberHighlighter: ['blue', [Validators.nullValidator]],
      socialMediaIcons: ['', [Validators.nullValidator]],
      toggleMsgCustomerTImezone: ['', [Validators.nullValidator]],
      QueueWaitTime: ['', [Validators.nullValidator]],
      QueuePositionMsg: ['', [Validators.nullValidator]],
      toggleSneakPeak: ['', [Validators.nullValidator]],
      toggleNotification: ['', [Validators.nullValidator]],
      toggleEmailTranscript: ['', [Validators.nullValidator]],
      toggleDownloadTranscript: [true, [Validators.nullValidator]],
      toggleEndConversation: [true, [Validators.nullValidator]],
      toggleBranding: ['', [Validators.nullValidator]],
      toggleUNFYDBranding: ['', [Validators.nullValidator]],
      BrandingURL: ['', [Validators.nullValidator]],
      CopyrightText: ['', [Validators.nullValidator]],
      toggleBottomBranding: ['', [Validators.nullValidator]],
      togglePluginBranding: ['', [Validators.nullValidator]],
      watermarkMessageWindow: ['', [Validators.nullValidator]],
      watermarkMessageWindowImg: ['', [Validators.nullValidator]],
      watermarkPrechatWindow: ['', [Validators.nullValidator]],
      watermarkPrechatWindowImg: ['', [Validators.nullValidator]],
      toggleMarquee: ['', [Validators.nullValidator]],
      marqueeText: ['', [Validators.nullValidator]],
      marqueeTextColor: ['', [Validators.pattern(regex.hexColorCode)]],
      marqueeBGColor: ['', [Validators.pattern(regex.hexColorCode)]],
      FACEBOOKSOCIAL: ['', [Validators.nullValidator]],
      facebookURL: ['', [Validators.nullValidator]],
      TWITTERSOCIAL: ['', [Validators.nullValidator]],
      twitterURL: ['', [Validators.nullValidator]],
      INSTAGRAMSOCIAL: ['', [Validators.nullValidator]],
      instagramURL: ['', [Validators.nullValidator]],
      toggleAutocompletion: ['', [Validators.nullValidator]],
      toggleBotAvatar: ['', [Validators.nullValidator]],
      toggleCoBrowse: ['', [Validators.nullValidator]],
      toggleVideoCall: ['', [Validators.nullValidator]],
      VideoRecording: ['', [Validators.nullValidator]],
      VideoCopyURL: ['', [Validators.nullValidator]],
      toggleThumbBtn: ['', [Validators.nullValidator]],
      toggleEmojiBtn: ['', [Validators.nullValidator]],
      VideoScreenshare: ['', [Validators.nullValidator]],
      VideoCallVideo: ['', [Validators.nullValidator]],
      VideoCallAudio: ['', [Validators.nullValidator]],
      CallControl: ['', [Validators.nullValidator]],
      toggleVoiceCall: ['', [Validators.nullValidator]],
      muteUnmute: ['', [Validators.nullValidator]],
      ToggleAgentJoinNoti: ['', [Validators.nullValidator]],
      toggleNetNotification: ['', [Validators.nullValidator]],
      toggleVolumeConrol: ['', [Validators.nullValidator]],
      toggleVideoConversation: ['', [Validators.nullValidator]],
      toggleRingCustomerInitiate: ['', [Validators.nullValidator]],
      toggleDisconnect: ['', [Validators.nullValidator]],
      togglePauseVideo: ['', [Validators.nullValidator]],
      toggleMaximizeVideo: ['', [Validators.nullValidator]],
      toggleStartStopCobrowsing: ['', [Validators.nullValidator]],
      toggleAllowDisallowControlAgent: ['', [Validators.nullValidator]],
      toggleScreenshare: ['', [Validators.nullValidator]],
      toggleAvatar: ['', [Validators.nullValidator]],
      botName: ['Live Chat', [Validators.nullValidator]],
      togglePrechat: ['', [Validators.nullValidator]],
      prechatFormHeding: ['', [Validators.nullValidator]],
      prechatFormSubHeding: ['', [Validators.nullValidator]],
      toggleEyeCatcher: ['', [Validators.nullValidator]],
      prechatformOnline: ['', [Validators.nullValidator]],
      prechatformOffline: ['', [Validators.nullValidator]],
      toggleCustFeedback: [false, [Validators.nullValidator]],
      toggleCookieRead: ['', [Validators.nullValidator]],
    }, { validator: [checknull('WebchatName'), checknull('eyeCatcherHeading'), checknull('eyeCatcherText')] })

  }

  copyInputMessage(inputElement) {
    if (inputElement.value) {
      inputElement.select();
      document.execCommand('copy');
      inputElement.setSelectionRange(0, 0);
      this.common.snackbar("Script copied successfully", "success");
    } else {
      this.common.snackbar("Unable to copy script", "error");
    }
  }

  sendScriptPopup(type, data) {

    console.log("ID", this.path);
    if (parseInt(this.path) == 2) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: this.path,
          productID: this.path,
          script: this.form.value.WebchatScript
        },
        width: '350px',
        disableClose: true,
        hasBackdrop: true
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {

        }
      });
    }
  }

  getAllForms() {
    let obj = {
      "data": {
        "spname": "usp_unfyd_data_collection_form",
        "parameters": {
          "FLAG": "get",
          "Processid": this.userDetails.Processid,
          PRODUCTID: 10,
          "FORMCATEGORY": this.type
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.allFormsData = res.results.data
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }


  changesDoneForWebchatIcon(item) {
    this.form.controls['webchatIconColor'].patchValue(item);
  }

  UploadNotificationSoundMethod(event) {

    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_Mp3_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {
      this.common.snackbar("File Size");

    } else if (extension !== 'audio/MP3' && extension !== 'audio/mp3' && extension !== 'mp3' && extension !== 'audio/mpeg' && extension !== 'audio/wave') {
      this.common.snackbar("Please upload MP3 format file", "error");
    } else {
      var reader = new FileReader();
      reader.onload = (event1: any) => {
        // var data = event1.target.result.split(',');
        // var decodedImageData = btoa(data[1]);  
        this.loader = true;
        this.api.post('upload', formData).subscribe(res => {
          if (res.code == 200) {
            this.form.controls['notiSoundUploaded'].patchValue(res.results.URL);
            this.common.snackbar("Image Uploaded Succesfully", "success");
            this.loader = false;
          } else {
            this.loader = false;
          }
        }, error => {
          this.loader = false;
        });

      };
      reader.readAsDataURL(file);
    };

  }

  get f() {
    return this.form.controls;
  }

  UploadExcelData(event) {

    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_Mp3_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (extension !== 'audio/MP3' && extension !== 'audio/mp3' && extension !== 'mp3' && extension !== 'audio/mpeg' && extension !== 'audio/wave') {
      this.common.snackbar("File Type");
    } else {
      var reader = new FileReader();
      reader.onload = (event1: any) => {
        // var data = event1.target.result.split(',');
        // var decodedImageData = btoa(data[1]);  
        this.loader = true;
        this.api.post('upload', formData).subscribe(res => {
          if (res.code == 200) {
            this.form.controls['notiSoundUploaded'].patchValue(res.results.URL);
            this.common.snackbar("Image Uploaded Succesfully", "success");
            this.loader = false;
          } else {
            this.loader = false;
          }
        }, error => {
          this.loader = false;
        });

      };
      reader.readAsDataURL(file);
    };

  }

  async audioToBase64(audioFile) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => resolve(console.log(e.target.result));
      reader.readAsDataURL(audioFile);
    });
  }


  changesDoneForTile(item) {
    this.tileSelectedColor = item;
    console.log("hello", this.tileSelectedColor);
    //this.form.controls['themeColor'].setValue(this.common.themeColoritem]);

    if (this.form.value.themeColorPalletteSelected == 'Solid') {
      // if(this.isShowColorAdd){
      //   this.form.controls['themeColor'].patchValue(this.form.value.themeColorCode);
      // }else {
      //   this.form.controls['themeColor'].setValue(this.common.themeSolidColor[item]);
      // 

      if (item == 'customColor') {
        this.form.controls['themeColor'].setValue(this.customThemeColorSolid);
        this.form.controls['themeColorCode'].setValue(this.customThemeColorSolid)
      } else {
        this.form.controls['themeColor'].setValue(this.common.themeSolidColor[item]);
        this.form.controls['themeColorCode'].setValue('')
        this.customThemeColorSolid = ''
      }
    } else {
      if (item == 'customColor') {
        this.form.controls['themeColor'].setValue(this.customThemeColorGradient);
      } else {
        this.form.controls['themeColor'].setValue(this.common.themeColor[item]);
        this.form.controls['themePrimaryColorCode'].setValue('')
        this.form.controls['themeSecondaryColorCode'].setValue('')
        this.customThemeColorGradient = ''
      }
    }
    this.webchatContainer = true;
  }

  chooseWidgetStyle(item) {
    this.form.controls['widgetStyle'].setValue(item);
    this.webchatContainer = true;
    this.chatIcon = false;
  }
  chooseChatIconStyle(item) {
    this.form.controls['chatIconStyle'].setValue(item);
    this.chatIcon = true;
    this.webchatContainer = false;
  }
  chooseButtonShape(item) {
    this.form.controls['chatButtonShape'].setValue(item);
    console.log(item)
  }
  chooseButtonPosition(item) {
    this.form.controls['chatButtonPosition'].setValue(item);
  }
  urlColor(item) {
    this.tileURLColor = item;
    this.form.controls['urlHighlighter'].setValue(item);
  }
  emailColor(item) {
    this.tileEmailColor = item;
    this.form.controls['emailHighlighter'].setValue(item);
  }
  numberColor(item) {
    this.tileNumberColor = item;
    this.form.controls['numberHighlighter'].setValue(item);
  }
  chooseInputFormStyle(item) {
    // this.tileSelectedColor = item;
    this.form.controls['inputFormLayout'].setValue(item);
  }
  chooseBotAvatar(item) {
    // this.tileSelectedColor = item;
    this.form.controls['botAvatar'].setValue(item);
  }
  chooseAgentAvatar(item) {
    // this.tileSelectedColor = item;
    this.form.controls['agentAvatar'].setValue(item);
  }
  chooseCaraousalStyle(item) {
    // this.tileSelectedColor = item;
    this.form.controls['carousalStyle'].setValue(item);
  }
  selectFileTypeSendImg() {
    let a = [];
    if (this.PDF) {
      a.push('PDF');
    }
    if (this.JPG) {
      a.push('JPG');
    }
    if (this.PNG) {
      a.push('PNG');
    }
    if (this.EXCEL) {
      a.push('EXCEL');
    }

    this.form.controls['sendFileType'].patchValue(a.join(','));
    // console.log("Kamlesh", this.form.value);
  }

  selectSocialMediaIcons() {
    let a = [];
    if (this.FACEBOOKSOCIAL) {
      a.push('FACEBOOK');
    }
    if (this.TWITTERSOCIAL) {
      a.push('TWIITER');
    }
    if (this.INSTAGRAMSOCIAL) {
      a.push('INSTAGRAM');
    }

    this.form.controls['socialMediaIcons'].patchValue(a.join(','));
    // console.log("Kamlesh", this.form.value);
  }

  resetfunc() {
    this.form.reset();
  }

  widgetStyle: any[] = ['Default', 'Basic', 'Modern', 'Classic'];
  chatIconStyle: any[] = ['chat1', 'chat2', 'chat3', 'chat4', 'chat5'];
  inputFormLayout: any[] = ['form1', 'form2', 'form3'];
  chatButtonShape: any[] = ['buttonShape1', 'buttonShape3', 'buttonShape2', 'buttonShape4', 'buttonShape5'];
  chatButtonPosition: any[] = ['bottom-right', 'bottom-left', 'center-left', 'center-right'];
  botAvatar: any[] = ['botAvatar1', 'botAvatar2'];
  agentAvatar: any[] = ['agent-avatar1', 'agent-avatar2'];
  carousalStyle: any[] = ['carousal1', 'carousal2', 'carousal3'];

  //isShowColorAdd = false;
  //isShowGradientColorAdd = false;
  addThemeColorCode() {
    if (this.form.value.themeColorPalletteSelected == 'Solid') {
      this.isShowGradientColorAdd = false;
      this.isShowColorAdd = !this.isShowColorAdd;
    } else {
      this.isShowColorAdd = false;
      this.isShowGradientColorAdd = !this.isShowGradientColorAdd;
    }
  }

  botFlowSelection() {
    // console.log("1", this.form.value['WebchatScript']);
    this.form.controls['WebchatScript'].patchValue(this.botFlow + this.userDetails.Processid + "/" + this.form.value.botFlowSelected);
    // console.log("2", this.form.value['WebchatScript']);
    // console.log(this.botFlow + this.userDetails.Processid + this.form.value.botFlowSelected);

  }

  closeDialog(status: any): void {

  }
  updateWebchatData() {
    this.loader = true;
    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {

          console.log("updateFlag", key);

          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          this.form.markAllAsTouched();
          break;
        }
      }
      return;
    }

    let requestArray = [];
    let count = 0;
    console.log("customColor :", this.form.value.themeColorCode);

    var customThemeColor = '';
    if (this.form.value.themeColorCode && !this.form.value.themeColor) {
      customThemeColor = `${this.form.value.themeColorCode}`;
      this.form.controls['themeColor'].patchValue(customThemeColor);
    }
    else if (this.form.value.themePrimaryColorCode && this.form.value.themeSecondaryColorCode) {
      customThemeColor = `linear-gradient( 160deg , ${this.form.value.themePrimaryColorCode} 30%, ${this.form.value.themeSecondaryColorCode} 100%)`;
      this.form.controls['themeColor'].patchValue(customThemeColor);
    } else if (this.form.value.themeColorPalletteSelected == 'Gradient') {
      // if(this.tileSelectedColor=="blueTone"){
      // this.form.controls['themePrimaryColorCode'].patchValue((this.tileSelectedColor && this.common.themeSolidColor[this.tileSelectedColor]) ? this.common.themeSolidColor[this.tileSelectedColor].trim() : '');
      // this.form.controls['themeSecondaryColorCode'].patchValue((this.tileSelectedColor && this.common.themeColorSecondaryHexCode[this.tileSelectedColor]) ? this.common.themeColorSecondaryHexCode[this.tileSelectedColor].trim() : '');
    } else {

    }
    console.log("Chitaras:", this.form.value, Object.keys(this.form.value), Object.keys(this.form.value).length);
    // const intersection = this.form.value.filter(element => !this.config.includes(element));
    // console.log('not in config ' + intersection)
    for (var i in this.form.value) {
      this.config.forEach(element => {
        if (element.ConfigKey.toLowerCase() == i.toLowerCase()) {
          let val = this.form.value[i];
          if (i == 'languageSelected') {
            val = this.form.value[i] ? this.form.value[i].join(",") : '';
          }
          if (i == 'FileFormatSelected') {
            val = this.form.value[i] ? this.form.value[i].join(",") : '';
          }
          if (i == 'themePrimaryColorCode' || i == 'themeSecondaryColorCode') {
            console.log("val:", val);
          }

          let obj4 = {
            configkey: i,
            configvalue: val,
            id: element.Id
          }

          requestArray.push(obj4);
          console.log("vaishag", obj4);

          if (this.config.length == requestArray.length) {
            let finalObj = {
              data: {
                spname: "usp_unfyd_webchat_config",
                parameters: {
                  flag: 'UPDATE_BULK_CONFIG',
                  CONFIGJSON: JSON.stringify(requestArray)
                }
              }
            }


            this.api.post('index', finalObj).subscribe(res => {
              if (res.code == 200) {
                if (res.results.data[0].result.includes('already exists')) {
                  this.common.snackbar('Exists');
                  this.loader = false;
                } else {
                  var today = new Date();
                  var dd = new Date().getDate();
                  var mm = new Date().getMonth() + 1;
                  var yyyy = new Date().getFullYear();
                  var time = today.getHours().toString() + today.getMinutes().toString();
                  var uniqueIdWebchat = 'WEBCHAT' + dd + mm + yyyy + time;
                  this.iframeURLReload = !this.iframeURLReload
                  // count++;
                  console.log(this.config.length, ":", count);
                  // if (count == this.config.length) {
                  this.common.snackbar('Update Success');
                  this.loader = false;
                  // }
                }
              }
            }, (error) => {
              console.log("Hello", obj4, "response");
              this.common.snackbar("Something Went Wrong", "error");
              this.loader = false;
            });


          }
        }
      });

    }

  }

  colorPalletteSelection() {
    this.colorPallet = []
    console.log("colorPallette", this.form.value.themeColorPalletteSelected);
    if (this.form.value.themeColorPalletteSelected == 'Solid') {
      this.isShowGradientColorAdd = false;
      this.colorPallet = this.common.themeSolidColorArray;
      this.form.controls['themePrimaryColorCode'].patchValue('');
      this.form.controls['themeSecondaryColorCode'].patchValue('');
    } else {
      this.form.controls['themePrimaryColorCode'].patchValue(this.form.value.themePrimaryColorCode);
      this.form.controls['themeSecondaryColorCode'].patchValue(this.form.value.themeSecondaryColorCode);
      this.isShowColorAdd = false;
      this.colorPallet = this.common.themeColorArray
    }
  }

  UploadAgentIcon(event, max_width, max_height) {
    debugger;
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_AgentAvatar_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    //console.log("Vishal: ", file)
    if (size > 1000) {
      debugger;
      this.common.snackbar("File Size");

    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];

            if (img_height > max_height && img_width > max_width) {
              this.common.snackbar("Please upload icon under 100 x 100", "error");
            } else {
              this.loader = true;
              this.api.post('upload', formData).subscribe(res => {
                if (res.code == 200) {
                  // console.log('nnnnnnn:', res);
                  this.form.controls['agentAvatarUploaded'].patchValue(res.results.URL);
                  this.common.snackbar("Image Uploaded Succesfully", "success");
                  this.loader = false;
                } else {
                  this.loader = false;
                }
              }, error => {
                this.loader = false;
              });
            }
          };
        };
        reader.readAsDataURL(file);
      });

    }
  }

  UploadBotIcon(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_BotAvatar_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else if (size > 1000) {
      this.common.snackbar("File Size");
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("Please upload icon under 100 x 100", "error");
          } else {
            this.loader = true;
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.form.controls['botAvatarUploaded'].patchValue(res.results.URL);
                this.common.snackbar("Image Uploaded Succesfully", "success");
                this.loader = false;
              } else {
                this.loader = false;
              }
            }, error => {
              this.loader = false;
            });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  UploadChatIcon(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_webchat_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {
      this.common.snackbar("File Size");

    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("Please upload image under 150 x 80", "error");
          } else {
            this.loader = true;
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                // this.form.controls['chatIconUploaded'].patchValue(res.results.URL);
                this.form.controls['shapeUploaded'].patchValue(res.results.URL);
                this.common.snackbar("Image Uploaded Succesfully", "success");
                this.loader = false;

              } else {
                this.loader = false;
              }
            }, error => {
              this.loader = false;
            });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }



  UploadWatermarkPreChatWindow(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_PrechatWaterMark_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {
      this.common.snackbar("File Size");

    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          //console.log("hello", img_height, img_width);

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("please upload image under 300 x 400", "error");
          } else {
            this.loader = true;
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.form.controls['watermarkPrechatWindowImg'].patchValue(res.results.URL);
                this.common.snackbar("Image Uploaded Succesfully", "success");
                this.loader = false;
              } else {
                this.loader = false;
              }
            }, error => {
              this.loader = false;
            });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  UploadWatermarkChatWindow(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_watermarkChatWindowImg_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {
      this.common.snackbar("File Size");

    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("please upload image under 300 x 400", "error");
          } else {
            this.loader = true;
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.form.controls['watermarkMessageWindowImg'].patchValue(res.results.URL);
                this.common.snackbar("Image Uploaded Succesfully", "success");
                this.loader = false;
              } else {
                this.loader = false;
              }
            }, error => {
              this.loader = false;
            });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  editWebchatData() {
    let obj5 = {
      data: {
        spname: "usp_unfyd_webchat_config",
        parameters: {
          flag: "EDIT",
          CHANNELID: this.path,
          CHANNELSRCID: this.channelSRCID,
        }
      }
    }
    this.api.post('index', obj5).subscribe((res: any) => {
      if (res.code == 200) {
        console.log("editFlag", res);
        this.loader = false;
        let a: any = [];
        var temp1 = [];
        let obj
        res.results.data.forEach(element => {
          if (element.ConfigValue == "false") element.ConfigValue = false
        });
        this.webchatChannel = res.results.data;

        for (var i = 0; i < res.results.data.length; i++) {
          temp1.push({ [res.results.data[i].ConfigKey]: res.results.data[i].ConfigValue, Id: res.results.data[i].Id })
        }
        obj = temp1.reduce(function (acc, val) {
          return Object.assign(acc, val);
        }, {});
        let val = res.results.data[i];
        if (obj.hasOwnProperty('languageSelected')) {
          obj.languageSelected = obj.languageSelected ? obj.languageSelected.split(",") : [];
        }
        if (obj.hasOwnProperty('FileFormatSelected')) {
          obj.FileFormatSelected = obj.FileFormatSelected ? obj.FileFormatSelected.split(",") : [];
        }

        this.config = res.results.data;

        this.form.patchValue(obj);

        if (this.form.value.themeColorPalletteSelected == 'Gradient') {
          if (this.form.value.themePrimaryColorCode.trim().length > 0 && this.form.value.themeSecondaryColorCode.trim().length > 0) {
            this.customThemeColorGradient = `linear-gradient( 160deg , ${this.form.value.themePrimaryColorCode} 30%, ${this.form.value.themeSecondaryColorCode} 100%)`;
            this.form.controls['themeColor'].patchValue(this.customThemeColorGradient);
            this.form.controls['themePrimaryColorCode'].patchValue(this.form.value.themePrimaryColorCode);
            this.form.controls['themeSecondaryColorCode'].patchValue(this.form.value.themeSecondaryColorCode);
          }
        } else {
          if (this.form.value.themeColorCode) {
            this.customThemeColorSolid = `${this.form.value.themeColorCode}`;
            this.form.controls['themeColor'].patchValue(this.customThemeColorSolid);
          }
        }

      }
    })
  }


  webchatInfo(flag) {
    let reqArray = [];
    let keyCount = 0;
    this.loader = true;
    let obj11 = {
      data: {
        spname: "usp_unfyd_channel_config",
        parameters: {
          flag: 'INSERT_CHANNELSOURCE_MST',
          processid: this.userDetails.Processid,
          CHANNELID: this.path,
          CREATEDBY: this.userDetails.Id,
          CHANNELSRCNAME: this.form.value.WebchatName
        }
      }
    }
    this.api.post('index', obj11).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results.data[0].result == 'success') {
          let ChSrcId = res.results.data[0].Id;

          let count = 0;
          var today = new Date();
          var dd = new Date().getDate();
          var mm = new Date().getMonth() + 1;
          var yyyy = new Date().getFullYear();
          var time = today.getHours().toString() + today.getMinutes().toString();
          var uniqueIdWebchat = 'WEBCHAT' + dd + mm + yyyy + time;

          //console.log("kamlesh", this.form.value)
          for (var i in this.form.value) {
            //console.log('ganesh', i, ":", this.form.value[i]);
            let val = this.form.value[i];

            if (i == 'languageSelected' || i == 'FileFormatSelected' || i == 'botFlowSelected') {
              val = this.form.value[i] ? this.form.value[i].join(",") : '';
            } else if (i == 'themeColor') {
              val = this.common.color[this.form.value[i]];
            }

            let obj1 = {
              data: {
                spname: "usp_unfyd_webchat_config",
                parameters: {
                  flag: "INSERT",
                  CHANNELID: this.path,
                  CHANNELNAME: "WEBCHAT",
                  PARENTCONTROLID: "1",
                  ASSIGNEDVALUE: "",
                  ASSIGNEDPROPERTY: "",
                  ADDITIONALPROPERTY: "",
                  DEFAULTVALUE: "",
                  STATUS: "",
                  PROCESSID: this.userDetails.Processid,
                  PRODUCTID: this.userDetails.ProductId,
                  LANGUAGECODE: "",
                  CREATEDBY: "",
                  BROWSERNAME: "",
                  BROWSERVALUE: "",
                  PUBLICIP: "",
                  PRIVATEIP: "",
                  CONFIGKEY: i,
                  CONFIGVALUE: val,
                  UNIQUEID: uniqueIdWebchat,
                  CHANNELSRCID: ChSrcId,
                  CONFIGTYPE: ""
                }
              }
            }
            console.log("Data Inserted", obj1)

            this.api.post('index', obj1).subscribe(res => {
              this.loader = false;
              if (res.code == 200) {

                console.log("vishal", res);

                this.iframeURLReload = !this.iframeURLReload
                count++;
                if (count == Object.keys(this.form.value).length) {
                  this.common.snackbar("Data Submitted Succesfully", "success");
                }
                this.loader = false;
              }
            }, (error) => {
              this.common.snackbar("Something Went Wrong", "error");
            })

          }
        } else if (res.results.data[0].result.includes('exists')) {
          this.common.snackbar('Data Already Exist');
          this.loader = false;
        }
      }


    })
  }


  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {

      if (res.code == 200) {
        this.language = res.results.data;
      }
    })
  }

  getBotFLow() {
    let Obj = {
      TENANTID: 1,
      EnableCaching: false,
      CHANNELNAME: "WEBCHAT"
    }
    this.api.rawApi('https://cx1.unfyd.com:9443/v1/master/GetListOfChannelSource', Obj).subscribe(res => {
      if (res) {
        console.log("botFlow", res);

        this.botFlowList = (JSON.parse(res)).data;

      } else {
        //console.log(res);
        this.common.snackbar("General Error");
      }
    })
  }

  selectShape(value) {
    console.log("shape:", value);
    this.form.controls['chatButtonShape'].patchValue(value);
  }

  selectEyeCatcher(value) {
    this.form.controls['eyeCatcher'].patchValue(value);
    this.webchatContainer = false;
  }

  selectData() {
    // console.log(this.form.value);
  }
  enableIframe() {
    this.iframeVisible = true;
    this.chatComponent = false;
  }
  enableChatComponent() {
    this.iframeVisible = false;
    this.chatComponent = true;
  }

  removeChip(val) {
    const index = this.form.value.FileFormatSelected.indexOf(val);

    if (index >= 0) {
      this.form.value.FileFormatSelected.splice(index, 1);
      //this.announcer.announce(`Removed ${val}`);
    }
  }

  enableDisablePrechat(val) {
    setTimeout(() => {
      //console.log("test" , this.form.value.togglePrechat);
      if (this.form.value.togglePrechat == true) {
        this.preChatFormId.open();
      }
    }, 500);
  }

  gradientCustomColorChnaged() {
    if (!this.form.controls.themePrimaryColorCode.errors && !this.form.controls.themeSecondaryColorCode.errors) {
      this.customThemeColorGradient = `linear-gradient( 160deg , ${this.form.value.themePrimaryColorCode} 30%, ${this.form.value.themeSecondaryColorCode} 100%)`;
      this.changesDoneForTile('customColor')
    }
  }

  solidCustomColorChnaged() {
    if (!this.form.controls.themeColorCode.errors) {
      this.customThemeColorSolid = this.form.value.themeColorCode
      this.changesDoneForTile('customColor')
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}

