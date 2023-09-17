import { Component, ElementRef, HostListener, Inject, Input, NgModule, OnInit, ViewChild } from "@angular/core";
import { EChartsOption } from "echarts";
import { ApiPerformanceComponent } from "./cards/api-performance/api-performance.component";
import { BotLicenseUsageComponent } from "./cards/bot-license-usage/bot-license-usage.component";
import { BotMenuUsageComponent } from "./cards/bot-menu-usage/bot-menu-usage.component";
import { BotPerformanceComponent } from "./cards/bot-performance/bot-performance.component";
import { BotStatisticsComponent } from "./cards/bot-statistics/bot-statistics.component";
import { FeedbackComponent } from "./cards/feedback/feedback.component";
import { HsmPerformanceComponent } from "./cards/hsm-performance/hsm-performance.component";
import { RepeatComponent } from "./cards/repeat/repeat.component";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { botDashboardTabs } from "src/app/global/json-data";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { AgentDashboardComponent } from "./agent-dashboard/agent-dashboard.component";
import { CommonService } from "src/app/global/common.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { Observable, Subscription } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { MatDrawer } from "@angular/material/sidenav";
@Component({
  selector: "app-dummy-dashboard",
  templateUrl: "./dummy-dashboard.component.html",
  styleUrls: ["./dummy-dashboard.component.scss"],
})

export class DummyDashboardComponent implements OnInit {
  reloadDurationDropdown = [{Key:'sec',Value:'Sec'},{Key:'min',Value:'Min'}]
  @Input() fullScreenEnabled :boolean;
  @ViewChild('drawer') public drawer: MatDrawer;
  enableReload :boolean =  false
  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  test :boolean = false
  // showFiller = false;
  autoReload = false;
  getGroupList:any = []
  skillType:any = []
  channelType:any = []
  dateFilterDropdown:any = []
  chartandGraphDropdown:any = []
  selectedGetGroupList:any = []
  selectedSkillType:any = []
  selectedChannelType:any = []
  selectedDateFilterDropdown:any = []
  userChannelName:any=[]

  selectedWorkflow:any []
  labelName:any
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  editDashboard = false;
  filterEnabled = false;
  edit = true;
  addDashboardCard :boolean = true;
  editDashboardCard :boolean = true;
  @Input() tabSelected: any;
  tabSelectedComponent: any;
  tab: any;
  configData: any;
  loader = false;
  botDashboardTabs;
  dashboardControlType = []
  value = 40;
  outof = 100;
  options: EChartsOption = {};
  a = JSON.stringify(this.value) + JSON.stringify(this.outof);
  userDetails: any;
  localizationDataAvailable:boolean =false;
  AllIcons:any = [];
  colorPalette = this.common.colorArray.concat(this.common.colorArray)
  infocards = [
    {
      title: "entered",
      value: 123456,
    },
    {
      title: "closed",
      value: 123456,
    },
    {
      title: "active",
      value: 123456,
    },
    {
      title: "overruled",
      value: 123456,
    },
    {
      title: "transfer to agent",
      value: 123456,
    },
  ];

  navbar = [
    {
      label: "BOT",
    },
    {
      label: "WORKS",
    },
    {
      label: "MANAGEMENT",
    }

  ];
  tiles:any = []
  tilesCopy:any = []
  managementTiles:any = []
  managementTilesCopy:any = []
  botCards:any = []
  botCardsCopy:any = []


  public tabs = {
    repeat: RepeatComponent,
    feedback: FeedbackComponent,
    "bot-statistics": BotStatisticsComponent,
    "hsm-performance": HsmPerformanceComponent,
    "api-performance": ApiPerformanceComponent,
    "bot-license-usage": BotLicenseUsageComponent,
    "bot-menu-usage": BotMenuUsageComponent,
    "bot-performance": BotPerformanceComponent,
  };

  elem: any; isFullScreen: boolean;
  dialogRefforFullScreen:any;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  userConfig: any;
  // userChannelName: any= [];
  constructor(
    private dialog: MatDialog,
    public common: CommonService,
    private router: Router,
    public auth: AuthService,
    private api: ApiService,
    @Inject(DOCUMENT) private document: any
  ) {
    Object.assign(this, { botDashboardTabs });

  }

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    let tempVar = JSON.parse(localStorage.getItem("refreshDashboard"));
    this.chkScreenMode();

      if(tempVar == true || tempVar == 'true'){
      this.enableReload = true
    } else{
      this.enableReload = false
    }
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'Dashboard');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      if(data && Object.keys(data).length > 0) this.userConfig = data
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    // this.getChannel()
    this.getChannelStorage()
    this.getSkill()
    this.getGroupType()
    this.enableReloadMethod()
    this.common.AllIcons.forEach(element => {
      this.AllIcons.push(element?.name)
      });
    this.subscription.push(this.common.getMasterConfig$.subscribe(data => {
      if(Object.keys(data).length > 0){
        this.dashboardControlType = JSON.parse(data['DashboardTileType'])
        this.dateFilterDropdown = JSON.parse(data['DateFilter'])
        this.chartandGraphDropdown = JSON.parse(data['DashboardChartAndGraph'])
      }
    }))
    this.subscription.push(this.common.dashboardFullScreen$.subscribe(res =>{
      this.fullScreenEnabled = res;
    }))
    this.elem = document.documentElement;
    this.subscription.push(this.common.localizationDataAvailable$.subscribe(res =>{
      this.localizationDataAvailable = res;
    }))

    this.loader = true
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }));

    if (this.router.url == "/dashboard") {
      this.workspaceSessionData();
    }


    this.tabSelected = this.tabSelected ? this.tabSelected : this.navbar[0].label;

    this.getDashboardTilesData()
    this.getDashboardCardsData()
    this.getDashboardManagementTilesData()
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');

  }





  setLabelByLanguage(data) {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(
      this.userDetails.Processid,
      "Dashboard",
      data
    );
  }

  getDashboardCardsData(){
    this.common.hubControlEvent('Dashboard','click','','','','getDashboardCardsData');

    this.botCards = []
    let obj = {
      "data": {
        "flag": "get",
        "filename": "dashboardCardsData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected
      }
    }

    this.api.post('branding', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.botCards = JSON.parse(res.results.data)
        this.botCardsCopy = JSON.parse(JSON.stringify(this.botCards))
      } else{
        this.botCards = []
      }
    },(error)=>{
      this.botCards = []
      this.common.snackbar("Something Went Wrong","error");
    }
    )
  }

  getDashboardTilesData(){
    this.tiles = []
    let obj = {
      "data": {
        "flag": "get",
        "filename": "dashboardTilesData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'getDashboardTilesData');

    this.api.post('branding', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.tiles = JSON.parse(res.results.data)
        this.tilesCopy = JSON.parse(JSON.stringify(this.tiles))
      } else{
        this.tiles = []
      }
    },(error)=>{
      this.tiles = []
      this.common.snackbar("Something Went Wrong","error");
    }
    )
  }

  getDashboardManagementTilesData(){
    this.managementTiles = []
    let obj = {
      "data": {
        "flag": "get",
        "filename": "dashboardManagementTilesData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'getDashboardTilesData');

    this.api.post('branding', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.managementTiles = JSON.parse(res.results.data)
        this.managementTilesCopy = JSON.parse(JSON.stringify(this.managementTiles))
      } else{
        this.managementTiles = []
      }
    },(error)=>{
      this.managementTiles = []
      this.common.snackbar("Something Went Wrong","error");
    }
    )
  }

  workspaceSessionData() {
    let obj = {
      data: {
        spname: "UNFYD_ADM_REALTIMEDASHBOARD_V2",
        parameters: {
          FLAG: "SESSION",
          PROCESSID:  this.userDetails.Processid,
          ADMINID: this.userDetails?.Id,
        },
      },
    };

    let obj1 = {
      data: {
        spname: "UNFYD_ADM_REALTIMEDASHBOARD_V2",
        parameters: {
          FLAG: "AGENT",
          PROCESSID:  this.userDetails.Processid,
          ADMINID: this.userDetails?.Id,
        },
      },
    };

    var b = {
      TotalEntered: 0,
      EnteredToday: 0,
      EnteredPrevious: 0,
      TotalClosed: 0,
      ClosedToday: 0,
      PendingQueueClosed: 0,
      TotalQueue: 0,
      LongestInQueue: "00:00:00",
      AvgQueueTime: "00:00:00",
      Abandoned: 0,
      Overruled: 0,
      SLA: 0,
      AHT: "00:00:00",
      ART: "00:00:00",
      Queue_Webchat: 0,
      Queue_Whatsapp: 0,
      Queue_SMS: 0,
      Queue_Viber: 0,
      Queue_Email: 0,
      TransferToSkill: 0,
      TransferToAgent: 0,
      Requeue: 0,
      Transfer: 0,
      OfflineCarryForwarded: 0,
      OfflineReceivedToday: 0,
      OfflineResponded: 0,
      OfflinePending: 0,
      ParkedCarryForwarded: 0,
      ParkedReceivedToday: 0,
      ParkedResponded: 0,
      ParkedPending: 0,
      MaxQueueTime: "00:00:00",
      OfflineMessage: 0,
      OfflineMessagePer: 0,
    };
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'workspaceSessionData');

    this.api.post("dashboard/workspace", obj).subscribe((res) => {
      if (res.code == 200) {
        this.common.workspaceSessionMethod(
          res.results.data == undefined ? b : res.results.data[0]
        );
      }
    });

    var a = {
      LoggedInAgents: 0,
      Capacity: 0,
      PausedAgents: 0,
      PausedAgentPer: 0,
      ActiveAgents: 0,
      ActiveAgentPer: 0,
      ReadyAgents: 0,
      ReadyAgentsPer: 0,
      NotReadyAgents: 0,
      NotReadyAgentsPer: 0,
      AvailbleSession: 0,
      AvailbleSessionPer: 0,
      ActiveSession: 0,
      LoggedInSupervisor: 0,
      SupervisorLoggedIn: 0,
      SupervisorReady: 0,
      SupervisorActive: 0,
      SupervisorCapacity: 0,
    };
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj1),'workspaceSessionData');

    this.api.post("dashboard/workspace", obj1).subscribe((res) => {
      if (res.code == 200) {

        this.common.workspaceAgentMethod(
          res.results.data == undefined ? a : res.results.data[0]
        );
      }
    });
  }

  items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  drop(event: CdkDragDrop<any>) {
    // this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(event),'drop');

    this.botCards[event.previousContainer.data.index] =
      event.container.data.item;
    this.botCards[event.container.data.index] =
      event.previousContainer.data.item;
  }

  enableEdit() {
    this.common.hubControlEvent('Dashboard','click','','','','enableEdit');

    this.edit = !this.edit;
    this.common.editDashboardMethod(this.edit);
    if(this.edit){
      this.insertDashboardCardData('sequence')
    }
  }

  changeTab(val) {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(val),'changeTab');

    this.tabSelected = val.label;
    this.edit = true;
    this.editDashboard =false
    this.getDashboardTilesData()
    this.getDashboardCardsData()
    this.getDashboardManagementTilesData()
    this.common.setUserConfig(this.userDetails.ProfileType, 'Dashboard');
    this.common.dashboardTabChanged.next(true)
  }

  changeDashboardCard(i) {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(i),'changeDashboardCard');

    let cards = this.botCards;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "selectDashboardCards",
        data: this.botCards,
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe((status) => {});
  }

  add(){
    this.common.hubControlEvent('Dashboard','click','','','','add');

    this.addDashboardCardMethod()
  }

  addDashboardCardMethod(){
    this.common.hubControlEvent('Dashboard','click','','','','addDashboardCardMethod');

    let data = {
      tabSelected: this.tabSelected,
    }
    this.changeAddButtonStatus()
    const dialogRef = this.dialog.open(DialogComponent, {

      data: {
          type: 'addDashboardCard',
          data:data
      },
      width: '60vw',
  });
  dialogRef.afterClosed().subscribe(status => {
    this.changeAddButtonStatus()
    if(status){
      this.getDashboardCardsData()
      this.getDashboardTilesData()
      this.getDashboardManagementTilesData()
    }
  })
  }

  changeAddButtonStatus(){
    this.common.hubControlEvent('Dashboard','click','','','','changeAddButtonStatus');

    this.addDashboardCard = !this.addDashboardCard

  }

  changeEditButtonStatus(){
    this.common.hubControlEvent('Dashboard','click','','','','changeEditButtonStatus');

    this.editDashboardCard = !this.editDashboardCard
  }

  aaaaaa =false;

  hoverListItem(val){
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(val),'hoverListItem');

    this.aaaaaa = val
  }


  insertDashboardCardData(flag){
    let obj1 = {
      "data": {
        "flag": "insert",
        "filename": "dashboardCardsData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected,
        "brandingjson":this.botCards
      }
    }

    this.api.post('branding', obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        if(flag == 'delete') this.common.snackbar("Delete Record");
        else if(flag == 'sequence') this.common.snackbar("Sequence Updated");
      }
    },(error)=>{
      this.common.snackbar("Something Went Wrong","error");
    })
  }

  insertDashboardTileData(){
    let obj1 = {
      "data": {
        "flag": "insert",
        "filename": "dashboardTilesData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected,
        "brandingjson":this.tiles
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj1),'insertDashboardTileData');

    this.api.post('branding', obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.common.snackbar("Sequence updated","success");
      }
    },(error)=>{
      this.common.snackbar("Something Went Wrong","error");
    })
  }

  updateTilesAndCardsTogether(){
    let count = 3
    let obj1 = {
      "data": {
        "flag": "insert",
        "filename": "dashboardCardsData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected,
        "brandingjson":this.botCards
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj1),'updateTilesAndCardsTogether');

    this.api.post('branding', obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        count--;
        if(count == 0) this.common.snackbar("Update Success");
      } else{
        this.common.snackbar("Something Went Wrong","error");
      }
    },(error)=>{
      this.common.snackbar("Something Went Wrong","error");
    })
    let obj2 = {
      "data": {
        "flag": "insert",
        "filename": "dashboardTilesData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected,
        "brandingjson":this.tiles
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj2),'updateTilesAndCardsTogether');

    this.api.post('branding', obj2).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        count--;
        if(count == 0) this.common.snackbar("Update Success");
      } else{
        this.common.snackbar("Something Went Wrong","error");
      }
    },(error)=>{
      this.common.snackbar("Something Went Wrong","error");
    })

    let obj3 = {
      "data": {
        "flag": "insert",
        "filename": "dashboardManagementTilesData",
        "processId": this.userDetails.Processid,
        "product": this.tabSelected,
        "brandingjson":this.managementTiles
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj2),'updateTilesAndCardsTogether');

    this.api.post('branding', obj3).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        count--;
        if(count == 0) this.common.snackbar("Update Success");
      } else{
        this.common.snackbar("Something Went Wrong","error");
      }
    },(error)=>{
      this.common.snackbar("Something Went Wrong","error");
    })

  }

  b(){
    this.common.hubControlEvent('Dashboard','click','','','','updateTilesAndCardsTogether');

    this.widgetsContent.nativeElement.scrollRight += 150;
    this.editDashboard = !this.editDashboard;
  }



  deleteCard(type,index){
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(type,index),'deleteCard');
  this.common.confirmationToMakeDefault('ConfirmationToDelete');
  this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
    if(status.status){
      if(type =='tile'){
        this.tiles.splice(index,1)
      }else if(type =='managementTile'){
        this.managementTiles.splice(index,1)
      }
    }



    this.subscriptionBulkDelete.forEach((e) => {
      e.unsubscribe();
    });
  }
  ))
  }


  zz= new Date()


  getGroupType() {
    let obj= {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'getGroupType');

    this.api.post('index', obj).subscribe((res: any) => {
      this.getGroupList = res.results['data'];
    })
  }
  getSkill() {
    let obj= {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "SKILL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'getSkill');

    this.api.post('index', obj).subscribe((res: any) => {
      this.skillType = res.results['data'];
    })
  }

  // getChannelStorage(){
  //   this.loader = true;
  //   this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
  //   console.log('this.userChannelName all', this.userChannelName)
  //   if(this.userChannelName == null || this.userChannelName == undefined)
  //   {
  //     this.getChannel();
  //   }else{
  //     let chlen = this.userChannelName.length
  //     this.userChannelName.forEach(element => {
  //       if(element.ChannelName == 'Voice')
  //       {
  //         this.userChannelName = true;
  //       }

  //       chlen--;
  //       if(chlen == 0)
  //       {
  //         this.loader =false
  //       }

  //     })
  //   }

  // }


  getChannel() {
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'getChannel');

    this.api.post('index', obj).subscribe((res: any) => {

      if(res.code == 200){
        console.log('res.results.data channek',res.results.data);

        localStorage.setItem("userChannelName",res.results.data[0][0].UserChannel);
        this.getChannelStorage()
      }
      // this.channelType = res.results['data']

    })
  }


  getChannelStorage(){
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
    console.log('this.userChannelName all', this.userChannelName)
    if(this.userChannelName == null || this.userChannelName == undefined)
    {
      this.getChannel();
    }else{
      let chlen = this.userChannelName.length
      this.userChannelName.forEach(element => {
        // if(element.ChannelName == 'Voice')
        // {
        //   this.userChannelName = true;
        // }

        chlen--;
        if(chlen == 0)
        {
          this.loader =false
        }

      })
    }

  }

  enableReloadMethod(){
    this.common.hubControlEvent('Dashboard','click','','','','enableReloadMethod');

      if(this.enableReload){
        localStorage.setItem('refreshDashboard',JSON.stringify(true))
        this.common.autoRefreshDashboard.next(true)
      } else{
        localStorage.setItem('refreshDashboard',JSON.stringify(false))
        this.common.autoRefreshDashboard.next(false)
      }
  }

  isReload = 0;
  refreshIntervalId: any;





  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
fullscreenmodes(event?){
  this.common.hubControlEvent('Dashboard','click','','',event,'fullscreenmodes');

     this.chkScreenMode();
   }
chkScreenMode(){
  this.common.hubControlEvent('Dashboard','click','','','','chkScreenMode');

     if(document.fullscreenElement){
       this.isFullScreen = true;
       this.enableReload = true;
       this.common.dashboardFullScreen.next(true)
       this.enableReloadMethod();
     }else{
       if(this.dialogRefforFullScreen) this.dialogRefforFullScreen.close();
       this.isFullScreen = false;
       this.enableReload = false;
       this.common.dashboardFullScreen.next(false)
       this.enableReloadMethod();
     }
   }
openFullscreen() {
  this.common.hubControlEvent('Dashboard','click','','','','openFullscreen');

       if (this.elem.requestFullscreen) {
         this.elem.requestFullscreen();
       } else if (this.elem.mozRequestFullScreen) {
         this.elem.mozRequestFullScreen();
       } else if (this.elem.webkitRequestFullscreen) {
         this.elem.webkitRequestFullscreen();
       } else if (this.elem.msRequestFullscreen) {
         this.elem.msRequestFullscreen();
       }
       this.common.dashboardFullScreen.next(true)
       this.enableReload = true;
       this.enableReloadMethod();
     }
     closeFullscreen() {
      this.common.hubControlEvent('Dashboard','click','','','','closeFullscreen');

      this.dialogRefforFullScreen.close();
       if (this.document.exitFullscreen) {
         this.document.exitFullscreen();
       } else if (this.document.mozCancelFullScreen) {
         this.document.mozCancelFullScreen();
       } else if (this.document.webkitExitFullscreen) {
         this.document.webkitExitFullscreen();
       } else if (this.document.msExitFullscreen) {
         this.document.msExitFullscreen();
       }
       this.common.dashboardFullScreen.next(false)
       this.enableReload = false;
       this.enableReloadMethod();
     }


     openDashboardInDialog(){
      this.common.hubControlEvent('Dashboard','click','','','','openDashboardInDialog');


     }

     applyFilterForDashboard(){
      this.common.hubControlEvent('Dashboard','click','','','','applyFilterForDashboard');

      this.common.applyFilterForDashboard.next({
        selectedGetGroupList:this.selectedGetGroupList,
        selectedSkillType:this.selectedSkillType,
        selectedChannelType:this.selectedChannelType,
        selectedDateFilterDropdown:this.selectedDateFilterDropdown,
        selectedWorkflow:this.selectedWorkflow
      })
     }

     deleteItem(cardObject) {
      this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(cardObject),'deleteItem');

      this.botCards.splice(this.botCards.indexOf(cardObject),1)
      this.insertDashboardCardData('delete')
    }

    ngOnDestroy() {
      if(this.subscription){
        this.subscription.forEach((e) => {
          e.unsubscribe();
        });
      }
    }

    tileSubplaceholder3TypeEdit(i){
      this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(i),'tileSubplaceholder3TypeEdit');

      this.tiles[i] = JSON.parse(JSON.stringify(this.tiles[i]))
    }

    apply(){
      this.common.hubControlEvent('Dashboard','click','','','','apply');

      this.tiles = JSON.parse(JSON.stringify(this.tiles))
      this.botCards = JSON.parse(JSON.stringify(this.botCards))
      this.managementTiles = JSON.parse(JSON.stringify(this.managementTiles))
    }

    update(){
      this.common.hubControlEvent('Dashboard','click','','','','update');

      this.tilesCopy = JSON.parse(JSON.stringify(this.tiles))
      this.botCardsCopy = JSON.parse(JSON.stringify(this.botCards))
      this.managementTilesCopy = JSON.parse(JSON.stringify(this.managementTiles))
      this.updateTilesAndCardsTogether()
    }
    resetEditForm(){
      this.common.hubControlEvent('Dashboard','click','','','','resetEditForm');

      this.tiles = JSON.parse(JSON.stringify(this.tilesCopy))
      this.botCards = JSON.parse(JSON.stringify(this.botCardsCopy))
      this.managementTiles = JSON.parse(JSON.stringify(this.managementTilesCopy))
    }


    removeCustomField(j,i){
      this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(j, i),'removeCustomField');

    this.common.confirmationToMakeDefault('ConfirmationToDelete');
      this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
        if (status.status == true) this.botCards[j].customFilterValues.splice(i,1);
        this.subscriptionBulkDelete.forEach((e) => {
          e.unsubscribe();
        });
      }
      ))
    }




    deleteBlockAddDashboardCard(j,i){
      this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(j, i),'deleteBlockAddDashboardCard');
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) this.botCards[j].blocks.splice(i,1);
      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
    }



    addBlockAddDashboardCard(i){
      this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(i),'addBlockAddDashboardCard');

      let j = this.botCards[i]?.blocks?.length == 0 ? 0 : this.botCards[i]?.blocks?.length
      this.botCards[i].blocks.push({
        header:null,
        visible:true,
        api:null,
        backgroundColor:this.colorPalette[j],
        selectedIcon:null,
        selectedIconColor:'blue',
        columnWidth:1,
        displayType:'text'
      })
    }

    addCustomFilter(i){
      this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(i),'addCustomFilter');

      this.botCards[i].customFilterValues.push(
        {
          customFilterField:''
        }
      )
    }

    columnWidthMoreThan12(i):boolean{
      let a:number = 0;

        this.botCards[i].blocks.forEach(element => {
          if(element.visible) a += element.columnWidth
        });
      return a > 12 ? true:false;
    }

    tileStep:number;
    managementTileStep:number;
    chartAndGraphStep:number;
    listStep:number
    expansionPanelSelected
    setStep(type,index: number) {

      this.expansionPanelSelected = type
      if(type == 1){
        this.tileStep = index
      } else{
        this.tileStep = 0
      }
      if(type == 2){
        this.chartAndGraphStep = index
      } else{
        this.chartAndGraphStep = 0
      }
      if(type == 3){
        this.listStep = index
      } else{
        this.listStep = 0
      }
      if(type == 4){
        this.managementTileStep = index
      } else{
        this.managementTileStep = 0
      }
    }

    getStep(val){
      this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(val),'getStep');

      this.expansionPanelSelected = val.type
      if(this.expansionPanelSelected == 1){
        this.tileStep = val.index
      } else{
        this.tileStep = 0
      }
      if(this.expansionPanelSelected == 2){
        this.chartAndGraphStep = val.index
      } else{
        this.chartAndGraphStep = 0
      }
      if(this.expansionPanelSelected == 3){
        this.listStep = val.index
      } else{
        this.listStep = 0
      }


      this.drawer.open()
    }

    returnTilesArray(){
      const min = 0;
      const max = Math.floor((this.tiles.length)/5);
      const arr = Array.from({length: max-min+1}, (_, i) => i + min);
      return arr;
    }

    returnmanagementTilesArray(){
      const min = 0;
      const max = Math.floor((this.managementTiles.length)/4);
      const arr = Array.from({length: max-min+1}, (_, i) => i + min);
      return arr;
    }

}
