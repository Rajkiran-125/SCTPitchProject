import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption,ECharts } from "echarts";
import { graphic } from 'echarts';
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";

@Component({
  selector: 'app-channel-performance',
  templateUrl: './channel-performance.component.html',
  styleUrls: ['./channel-performance.component.scss']
})
export class ChannelPerformanceComponent implements OnInit {
  loader: boolean = false;
  spname = "usp_unfyd_hub_dashboard_graphs";
  innerSpName = "CHANNELWISE_STATS"
  flag = "DAY";
  endPoint = "dashboard/workspace";
  userDetails: any;
  hawkerAppButton = "DAY";
  keys: any;
  nextDisable: boolean = true;
  previousDisable: boolean = false;
  values: any;
  hawkerAppDate: any = new Date();
  today: any = new Date();
  tommorow: any = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
  hawkerAppSum = 0;
  trainingData: any;
  selectedGrievance: any = "Day";
  options: EChartsOption = {};
  colorPalette = ["#4FC0E8", "#00E676","#5D9CEC","#FB6E52"];
  isReload = 0;
  refreshIntervalId: any;
  inner_content_height =getComputedStyle(document.body).getPropertyValue('--inner_content');
  content_height =getComputedStyle(document.body).getPropertyValue('--content');
  constructor(
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.today = new Date(this.today.setHours(0, 0, 0, 0));
    this.hawkerAppDate = new Date(this.hawkerAppDate.setHours(0, 0, 0, 0));
    this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
    this.common.reloadTime$.subscribe((res) => {
      this.isReload = res;
      clearInterval(this.refreshIntervalId);
      this.reloadData();
    });
    this.reloadData();
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');

  }

  reloadData() {

    this.isReload = JSON.parse(localStorage.getItem("reload"));
    if (
      this.isReload != 0 &&
      this.isReload != null &&
      this.isReload != undefined
    ) {
      this.refreshIntervalId = setInterval(() => {
        if (this.router.url == "/dashboard")
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
      }, this.isReload * 1000);
    } else {
      clearInterval(this.refreshIntervalId);
    }
  }
  convert(str) {

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  changeDate(direction: any) {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(direction),'changeDate');

    if (direction == "next") {
      if (this.selectedGrievance == "Day") {
        this.getTomorrowDate();
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        if (this.hawkerAppDate.getTime() == this.today.getTime()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == "Month") {
        if (this.hawkerAppDate.getMonth() == 11) {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear() + 1,
            0,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);

          if (
            this.hawkerAppDate.getMonth() == this.today.getMonth() &&
            this.hawkerAppDate.getFullYear() == this.today.getFullYear()
          ) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear(),
            this.hawkerAppDate.getMonth() + 1,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
          if (
            this.hawkerAppDate.getMonth() == this.today.getMonth() &&
            this.hawkerAppDate.getFullYear() == this.today.getFullYear()
          ) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        }
      } else if (this.selectedGrievance == "Year") {
        this.hawkerAppDate = new Date(
          this.hawkerAppDate.getFullYear() + 1,
          this.hawkerAppDate.getMonth(),
          1
        );
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedGrievance == "Day") {
        this.getYesterdayDate();
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        this.nextDisable = false;
      } else if (this.selectedGrievance == "Month") {
        if (this.hawkerAppDate.getMonth() == 0) {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear() - 1,
            11,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
          this.nextDisable = false;
        } else {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear(),
            this.hawkerAppDate.getMonth() - 1,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == "Year") {
        this.hawkerAppDate = new Date(
          this.hawkerAppDate.getFullYear() - 1,
          this.hawkerAppDate.getMonth(),
          1
        );
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        this.nextDisable = false;
      }
    }
  }

  getTomorrowDate() {
    this.common.hubControlEvent('Dashboard','click','','','','getTomorrowDate');

    this.hawkerAppDate = new Date(
      this.hawkerAppDate.getTime() + 24 * 60 * 60 * 1000
    );
  }

  getYesterdayDate() {
    this.common.hubControlEvent('Dashboard','click','','','','getYesterdayDate');

    this.hawkerAppDate = new Date(
      this.hawkerAppDate.getTime() - 24 * 60 * 60 * 1000
    );
  }

  getInformation(spname,innerSpName, flag) {
    this.loader = true;
    let obj = {
      data: {
        spname: spname,
        parameters: {
          flag: innerSpName,
          FREQUENCY : flag,
          processid: this.userDetails.Processid,
        },
      },
    };

    if (flag == "Day") {
      obj.data.parameters["date"] = this.convert(this.hawkerAppDate);
    } else if (flag == "Month") {
      obj.data.parameters["Month"] = this.hawkerAppDate.getMonth() + 1;
      obj.data.parameters["Year"] = this.hawkerAppDate.getFullYear();
    } else if (flag == "Year") {
      obj.data.parameters["Year"] = this.hawkerAppDate.getFullYear();
    }

    this.api
      .post(this.endPoint, obj)
      .subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          if(!res.results.data ){
          
            this.trainingData = {
              SMS:0,
              WhatsApp:0,
              Email:0,
              Voice:0
            }
          } else{
            this.trainingData = res.results.data[0];
          }

       
          if (this.selectedGrievance == "Day") {
            if (
              this.hawkerAppDate.toISOString().slice(0, 10) ==
              this.today.toISOString().slice(0, 10)
            ) {
              this.nextDisable = true;
            } else {
              this.nextDisable = false;
            }
          } else if (this.selectedGrievance == "Month") {
            if (
              this.hawkerAppDate.getMonth() == this.today.getMonth() &&
              this.hawkerAppDate.getFullYear() == this.today.getFullYear()
            ) {
              this.nextDisable = true;
            } else {
              this.nextDisable = false;
            }
          } else if (this.selectedGrievance == "Year") {
            if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
              this.nextDisable = true;
            } else {
              this.nextDisable = false;
            }
          }
        }
      },
      (error)=>{

        if (error.code == 401) {
     
        this.common.snackbar("Token Expired Please Logout",'error');
        }else
        {
          this.common.snackbar("General Error");
        }
      }

      )
      .add(() => {
        this.getGraphData();
      });
  }

  keepOrder = (a) => {
    return a;
  };

  getGraphData() {
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');


    let values =[]
    values=  Object.values(this.trainingData)
    this.options = {
   
      tooltip: {
        trigger:'axis',
        textStyle:{
          fontSize:this.inner_content_height.substring(0, this.inner_content_height.length -2)
        },
        position: function(point, params, dom, rect, size){
        var x = point[0];//
        var y = point[1];
        var viewWidth = size.viewSize[0];
        var viewHeight = size.viewSize[1];
        var boxWidth = size.contentSize[0];
        var boxHeight = size.contentSize[1];
        var posX = 0;
        var posY = 0;

        if(x<boxWidth){
            posX = 5;
        }else{
            posX = x-boxWidth;
        }

        if(y<boxHeight){
            posY = 5;
        }else{
            posY = y-boxHeight;
        }

        return [posX,posY];

    }
    },
      legend: {
        icon: "rect",
        show:false,
        orient: "horizontal",
        itemWidth: 16,
        itemHeight: 12,
        textStyle: {
          fontSize: 12,
        },
      },
      grid: {
        top:'9%',
        left: '1%',
        right: '3%',
        bottom: '0%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisLabel: {
            interval: 0
          },
          data: Object.keys(this.trainingData)

        }
      ],
      yAxis: {
        type: "value",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: function (value: any) {
            if(value< 1000){
              return value
            } else if(value >= 100000){
              let a= (value/100000).toFixed(0)
              return `${a}L`;
            } else if(value > 9999){
              let a= (value/1000).toFixed(0)
              return `${a}k`;
            } else{
              let a= (value/1000).toFixed(0)
              return `${a}k`;
              }
          },
        },
      },
      series: [

        {
          data: [
            {
            value:values[0],
            itemStyle:{
              color:this.colorPalette[0]
            }
          },
          {
            value:values[1],
            itemStyle:{
              color:this.colorPalette[1]
            }
          },
          {
            value:values[2],
            itemStyle:{
              color:this.colorPalette[2]
            }
          },
          {
            value:values[3],
            itemStyle:{
              color:this.colorPalette[3]
            }
          },
       
        ],
          
          label: {
            show: true,
            position: 'top'
          },
          type: 'bar',
        }
      ]
    };

    }
    selectedOptionValue(){
      this.common.hubControlEvent('Dashboard','click','','','','selectedOptionValue');

      this.hawkerAppDate= new Date();
    }
}
