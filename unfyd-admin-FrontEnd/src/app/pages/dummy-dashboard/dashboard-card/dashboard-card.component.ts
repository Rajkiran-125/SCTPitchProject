import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import * as Highcharts from 'highcharts';
import { Options} from "highcharts";
import  More from 'highcharts/highcharts-more';
More(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
import { Router } from '@angular/router';
import { DateFormatPipe } from 'src/app/global/date-format.pipe';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WeekPipe } from 'src/app/global/week.pipe';
import { DateTimeFormatPipe } from 'src/app/global/date-time-format.pipe';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
Drilldown(Highcharts);
@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit, OnChanges {
  @Input() test:any = false;
  @Input() index = 0
  @Input() selectedGetGroupList:any = []
  @Input() selectedSkillType:any = []
  @Input() selectedChannelType:any = []
  @Input() selectedWorkflow:any = []
  @Input() selectedDateFilterDropdown:any = []
  @Input() autoReload:boolean = false;
  @Output() editData = new EventEmitter<any>()
  nextDisable = true
  today =new Date()
  height = 22;
  vennBlock1 = 0;
  vennBlock2 = 0;
  vennBlock3 = 0
  @Input() chartandGraph :any;
  @Input() dashboardControlTypeSelected:any
  customFilterFieldSelected :any
  currentDateTime = new Date()
  gaugeTextBelowGraphData = 0
  labels = []
  sectionBelowBarChartIconOnTopLeftValue = 0;
  sectionBelowBarChartIconOnTopRightValue = 0;
  listData = [
    // {Rank:1,Category:'abcd',Clicks:4}
]

  elem: any; isFullScreen: boolean;
  enableReload :boolean =  false

  selectedDateFilterValue: any;
  option1: EChartsOption = {};
  option : any;
  option2 : any;
  Highcharts: typeof Highcharts = Highcharts;
  chartData = []
  updateFlag:any;
  userDetails:any;
  subscription: Subscription[] = [];
  colorPalette = this.common.colorArray.concat(this.common.colorArray)

  inner_content_height = getComputedStyle(document.body).getPropertyValue(
    "--content"
  );
  content_height = getComputedStyle(document.body).getPropertyValue(
    "--content"
  );
  header_height = getComputedStyle(document.body).getPropertyValue("--header");
  overruled: any[];
  used: any[];
  chartRef:any
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };
  @ViewChild('chart') componentRef;
  @ViewChild('chart1') componentRef1;
  resData:any;
  @Output() cardObject = new EventEmitter<boolean>();
  MaxTotalLicense = 0
  MaxTotalLicenseOnDate = '';
  plotLine = 0;
  backDisable = false;
  fullScreenEnabled:boolean = true;
  labelName: any;
  loader: boolean;
  userConfig: any;
  startOfWeek:any;
  endOfWeek:any;
  subscriptionBulkDelete: Subscription[] = [];
  constructor(private api: ApiService,
    private auth: AuthService,
    public common: CommonService,
    private el: ElementRef,
    private dateFormatPipe: DateFormatPipe,
    private dateTimeFormatPipe: DateTimeFormatPipe,
    public week: WeekPipe,
    private dialog: MatDialog,
    private router:Router) {
     }

  ngOnChanges(changes: SimpleChanges) {
    this.userDetails = this.auth.getUser();

      if(this.chartandGraph.dateFilter && this.chartandGraph.dateFilter.length > 0){
        this.selectedDateFilterValue = this.chartandGraph.dateFilter[0]
    } else this.selectedDateFilterValue = 'Day'

    if(this.selectedDateFilterValue == 'Week') {
      let week = this.week.transform(this.currentDateTime)
      let currentWeek = this.week.transform(new Date())
      this.endOfWeek = this.common.dateFromDay(((week - 1) * 7) + 1)
      this.startOfWeek = this.common.dateFromDay(((week - 1) * 7) - 5)
      this.currentDateTime = new Date(this.startOfWeek)
      if (week == 1) {
        this.backDisable = true;
      } else {
        this.backDisable = false;
      } if (week == currentWeek) {
        this.nextDisable = true;
      } else {
        this.nextDisable = false;
      }
    }

    if (this.dashboardControlTypeSelected == 'ChartAndGraph') {
      this.apiCallMethod()
      if (this.chartandGraph?.chartAndGraph == 'BarChartIconOnTop')
        this.apiCallMethod()

    } else if (this.dashboardControlTypeSelected == 'List') {
      this.apiCallMethod()
    }


  }
  isReload = 0;
  refreshIntervalId: any;
  ngOnInit(): void {
    this.subscription.push(
      this.common.dashboardTabChanged$.subscribe(res => {
        clearInterval(this.refreshIntervalId);
        // this.ngOnDestroy()
      })
      )
    this.common.hubControlEvent('Dashboard', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.userDetails = this.auth.getUser();

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.dashboardFullScreen$.subscribe(res => {
      this.fullScreenEnabled = res;
    }))
    if (this.chartandGraph?.customFilterValues[0]?.customFilterField) {
      this.customFilterFieldSelected = this.chartandGraph?.customFilterValues[0].customFilterField
    }
    this.common.setUserConfig(this.userDetails.ProfileType, 'Dashboard');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data


    }))
    this.subscription.push(this.common.applyFilterForDashboard$.subscribe(res => {
      this.selectedGetGroupList = res.selectedGetGroupList
      this.selectedSkillType = res.selectedSkillType
      this.selectedChannelType = res.selectedChannelType
      this.selectedWorkflow = res.selectedWorkflow
      this.selectedDateFilterDropdown = res.selectedDateFilterDropdown

      if (this.chartandGraph.dateFilter.includes(this.selectedDateFilterDropdown)) {
        this.selectedDateFilterValue = this.selectedDateFilterDropdown
      }
      this.apiCallMethod()
    }))


    this.subscription.push(this.common.autoRefreshDashboard$.subscribe((res) => {
      this.isReload = res;
      clearInterval(this.refreshIntervalId);
      this.reloadData();
    }));
    this.reloadData();
    this.common.hubControlEvent('Dashboard', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }

  reloadData() {

    // let time =this.chartandGraph.reloadTimeType.split(':')
    // let milliSeconds = 0;
    // if(time[0]){
    //   milliSeconds += time[0] * 60 * 60
    // }
    // if(time[1]){
    //   milliSeconds += time[1] * 60
    // }
    // if(time[2]){
    //   milliSeconds += time[2]
    // }
    let milliSeconds = 0;
    if (this.chartandGraph.reloadTime && typeof (this.chartandGraph.reloadTime) == 'number') {
      if (this.chartandGraph.reloadTimeType && this.chartandGraph.reloadTimeType.toLowerCase() == 'min') {
        milliSeconds = this.chartandGraph.reloadTime * 60
      } else {
        milliSeconds = this.chartandGraph.reloadTime
      }
    } else {
      milliSeconds = 10
    }

    this.isReload = JSON.parse(localStorage.getItem("refreshDashboard"));
    if (this.chartandGraph.reloadTimeEnable && milliSeconds && this.isReload) {
      this.refreshIntervalId = setInterval(() => {
        if (this.router.url == "/dashboard" && JSON.parse(localStorage.getItem("refreshDashboard"))) {
          this.apiCallMethod()
        }
      }, milliSeconds * 1000);
    } else {
      clearInterval(this.refreshIntervalId);
    }
  }

  apiCallMethod() {

    let obj
    if (this.chartandGraph.dataRequest) obj = this.returnObjectWithKeys(this.chartandGraph.dataRequest);
    if (!this.test) {
      if (this.chartandGraph.dataApi && obj) {
        this.api.dynamicDashboard(this.chartandGraph.dataApi, obj).subscribe(res => {
          if (res.code == 200) {
            if (Object.keys(res.results).length > 0) {
              if (res.results.data.length > 0) {
                this.loadGraphData(res)
              } else {
                this.loadGraphData(false)
              }
            } else {
              this.loadGraphData(false)
            }
          } else {
            this.loadGraphData(false)
          }
        }, (error) => {
          this.loadGraphData(false)
        })
      } else {
        this.loadGraphData(false)
      }
    } else {
      this.loadGraphData(false)
    }
  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Dashboard', 'click', '', '', JSON.stringify(data), 'setLabelByLanguage');

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
  loadGraphData(res) {

    let additionOfAllValues = 0
    this.chartData = []
    for (let key in this.chartandGraph.blocks) {
      if (this.chartandGraph.blocks[key]?.visible) {
        this.colorPalette[key] = this.chartandGraph.blocks[key].backgroundColor ? this.common.color[this.chartandGraph.blocks[key].backgroundColor] : this.common.color[this.colorPalette[key]];
        if (this.chartandGraph.blocks[key].header && !(this.chartandGraph.blocks[key].header.trim().length === 0)) {
          this.chartData.push({ value: 20, name: this.chartandGraph.blocks[key].header, color: this.chartandGraph.blocks[key].backgroundColor })
        } else {
          this.chartData.push({ value: 20, name: 'Block' + (+key + 1), color: this.chartandGraph.blocks[key].backgroundColor })
        }

        if (this.chartandGraph.blocks[key].key && !(this.chartandGraph.blocks[key].key.trim().length === 0)) {
          Object.assign(this.chartData[this.chartData.length - 1], { key: this.chartandGraph.blocks[key].key })
          // this.chartData[this.chartData.length] =
        } else {
          Object.assign(this.chartData[this.chartData.length - 1], { key: 'Block' + (+key + 1) })
        }

        if (this.chartandGraph.header == 'Agent Status') {
        }
        additionOfAllValues += this.chartData[key]?.value
      }
    }
    let obj
    if (this.chartandGraph.dataRequest) obj = this.returnObjectWithKeys(this.chartandGraph.dataRequest);


    switch (this.chartandGraph?.chartAndGraph) {
      case 'DoughnutChart':
        if (this.test) {
          this.loadGraph(additionOfAllValues)
        } else if (res) {
          additionOfAllValues = 0
          this.chartData.forEach((val) => {
            const lowerObj = this.common.ConvertKeysToLowerCase();
            res.results.data[0] = lowerObj(res.results.data[0]);
            val.value = res.results.data[0][(val.name).toLowerCase()] ? res.results.data[0][(val.name).toLowerCase()] : ''
            additionOfAllValues += !val.value ? 0 : val.value
          })
          setTimeout(() => {
            this.loadGraph(additionOfAllValues)
          })
        } else {
          this.chartData.forEach((val) => {
            val.value = 0
          })
          additionOfAllValues = 0
          setTimeout(() => {
            this.loadGraph(additionOfAllValues)
          })
        }



        break;

      case 'LineChart':
        if (this.test) {
          this.chartData = [Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1)]
          additionOfAllValues = 0
          setTimeout(() => {
            this.loadGraph(additionOfAllValues)
          })
        } else if (res) {
          additionOfAllValues = 0
          this.chartData = []
          if (res.results.data[0].hasOwnProperty('HourStats')) this.chartData = res.results.data[0]?.HourStats?.split(',')
          else { this.chartData = [0]; additionOfAllValues = 0 }
          setTimeout(() => {
            this.loadGraph(additionOfAllValues)
          })
        } else {
          this.chartData = []
          this.chartData = [0]
          additionOfAllValues = 0
          setTimeout(() => {
            this.loadGraph(additionOfAllValues)
          })
        }


        break;

      case 'StackedLineChart':
        let allData = []
        let a = 1
        this.chartData.forEach(element => {
          allData.push(
            {
              name: element.name,
              type: 'line',
              stack: '',

              emphasis: {
                focus: 'series'
              },
              lineStyle: {
                width: 2,
                color: this.common.color[element.color]
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: this.common.color[element.color]
                  },
                  {
                    offset: 1,
                    color: '#D0E0F8'
                  }
                ])
              },
              data: [Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1),]
            }
          )
        });
        this.labels = [1, 2, 3, 4, 5, 6, 7, 8, 9]






        if (this.test) {
          setTimeout(() => {
            this.loadGraph(allData, this.labels)
          })
        } else if (res) {
          this.labels = []
          allData.forEach(val => {
            val.data = []
          })
          res.results.data.forEach(res1 => {
            allData.forEach(val => {
              if (res1.hasOwnProperty(val.name)) val.data.push(res1[val.name])
              else val.data = [0]
            })
            this.labels?.push(res1?.TimeInterval ? res1?.TimeInterval : '0')
          })
          setTimeout(() => {
            this.loadGraph(allData, this.labels)
          })
        } else {
          this.chartData = []
          allData.forEach(val => {
            val.data = [0]
            this.labels = [0]
          })
          setTimeout(() => {
            this.loadGraph(allData, this.labels)
          })
        }
        break;

      case 'Gauge':
        if (this.test) {
          this.loadGraph(90, this.chartandGraph.gaugePercentCountText)
        } else if (res) {
          const lowerObj = this.common.ConvertKeysToLowerCase();
          res.results.data[0] = lowerObj(res.results.data[0]);
          this.loadGraph(res.results.data[0].sla ? res.results.data[0].sla : 0, this.chartandGraph.gaugePercentCountText)
          this.gaugeTextBelowGraphData = res.results.data[0].aht ? res.results.data[0].aht : 0
        } else {
          setTimeout(() => {
            this.loadGraph(0, this.chartandGraph.gaugePercentCountText)
          })
        }
        break;

      case 'GaugeWithProgressBars':
        if (this.test) {
          this.loadGraph(90, this.chartandGraph.gaugePercentCountText)
        } else if (res) {
          const lowerObj = this.common.ConvertKeysToLowerCase();
          res.results.data[0] = lowerObj(res.results.data[0]);
          this.chartData.forEach((val) => {
            val.value = res.results.data[0][(val.key).toLowerCase()] ? res.results.data[0][(val.key).toLowerCase()] : 0
          })
          this.loadGraph(res.results.data[0][this.chartandGraph.gaugePercentCountDataKey] ? res.results.data[0][this.chartandGraph.gaugePercentCountDataKey] : 0, this.chartandGraph.gaugePercentCountText)
          // this.gaugeTextBelowGraphData = res.results.data[0].aht ? res.results.data[0].aht : 0
        } else {
          this.chartData.forEach((val) => {
            val.value = 0
          })
          setTimeout(() => {
            this.loadGraph(0, this.chartandGraph.gaugePercentCountText)
          })
        }
        break;

      case 'BarChart':
        let dataArray = []
        let labels = []

        for (let key in this.chartandGraph.blocks) {
          if (this.chartandGraph.blocks[key]?.visible) {
            this.colorPalette[key] = this.chartandGraph.blocks[key].backgroundColor ? this.common.color[this.chartandGraph.blocks[key].backgroundColor] : this.common.color[this.colorPalette[key]];
            if (this.chartandGraph.blocks[key].header && !(this.chartandGraph.blocks[key].header.trim().length === 0)) {
              dataArray.push({
                value: Math.floor((Math.random() * 100) + 1),
                itemStyle: {
                  color: this.colorPalette[key]
                }
              })
              labels.push(this.chartandGraph.blocks[key].header)
            } else {
              dataArray.push({
                value: Math.floor((Math.random() * 100) + 1),
                itemStyle: {
                  color: this.colorPalette[key]
                }
              })
              labels.push('Block' + (+key + 1))
            }
          }
        }


        if (this.test) {
          this.loadGraph(dataArray, labels)
        } else if (res) {
          const lowerObj = this.common.ConvertKeysToLowerCase();
          res.results.data[0] = lowerObj(res.results.data[0]);
          for (let key in dataArray) {
            dataArray[key].value = res.results.data[0][(labels[key]).toLowerCase()] ? res.results.data[0][(labels[key]).toLowerCase()] : 0
          }
          setTimeout(() => {
            this.option = {}
            this.loadGraph(dataArray, labels)
          })
        } else {
          for (let key in dataArray) {
            dataArray[key].value = 0
          }
          setTimeout(() => {
            this.option = {}
            this.loadGraph(dataArray, labels)
          })
        }
        break;

      case 'BarChartIconOnTop':
        if (this.componentRef1) {
          this.componentRef1.chart = null;
        }
        let BarChartIconOnTopAllData = []
        this.labels = []
        this.chartData.forEach(element => {
          BarChartIconOnTopAllData.push({
            y: element.value,
            color: this.common?.color[element?.color],

          })
          this.labels.push(element.name)
        })

        if (this.test) {
          setTimeout(() => {
            this.option = {}
            this.loadGraph(BarChartIconOnTopAllData, this.labels);
          })
        } else if (res) {
          const lowerObj = this.common.ConvertKeysToLowerCase();
          res.results.data[0] = lowerObj(res.results.data[0]);
          if (this.chartandGraph.sectionBelowBarChartIconOnTop) {
            this.sectionBelowBarChartIconOnTopLeftValue = this.chartandGraph.sectionBelowBarChartIconOnTopLeftText && res.results.data[0][(this.chartandGraph.sectionBelowBarChartIconOnTopLeftText).toLowerCase()] ? res.results.data[0][(this.chartandGraph.sectionBelowBarChartIconOnTopLeftText).toLowerCase()] : 0
            this.sectionBelowBarChartIconOnTopRightValue = this.chartandGraph.sectionBelowBarChartIconOnTopRightText && res.results.data[0][(this.chartandGraph.sectionBelowBarChartIconOnTopRightText).toLowerCase()] ? res.results.data[0][(this.chartandGraph.sectionBelowBarChartIconOnTopRightText).toLowerCase()] : 0
          }
          for (const key in BarChartIconOnTopAllData) {
            BarChartIconOnTopAllData[key].y = this.chartandGraph.blocks[key].header && res.results.data[0][(this.chartandGraph.blocks[key].header).toLowerCase()] ? res.results.data[0][(this.chartandGraph.blocks[key].header).toLowerCase()] : 0
          }
          setTimeout(() => {
            this.option = {}
            this.loadGraph(BarChartIconOnTopAllData, this.labels);
          })
        } else {
          for (const key in BarChartIconOnTopAllData) {
            BarChartIconOnTopAllData[key].y = 0
          }
          setTimeout(() => {
            this.option = {}
            this.loadGraph(BarChartIconOnTopAllData, this.labels);
          })
        }




        break;

      case 'LicenseUsageBarChart':
        this.labels = [];
        this.overruled = [];
        this.used = []


        if (this.test) {
          this.overruled = [0, 0, 0, 0, 20, 0, 30];
          this.used = [100, 100, 120, 110, 150, 12, 152];
          this.loadGraph(null, [1, 2, 3, 4, 5, 6, 7])
          this.MaxTotalLicense = 182
          this.MaxTotalLicenseOnDate = this.dateTimeFormatPipe.transform(new Date());
          this.plotLine = 150
        } else if (res) {
          this.MaxTotalLicense = res.results.data[0]?.MaxTotalLicense ? res.results.data[0]?.MaxTotalLicense : 0
          console.log("time:", res.results.data[0]?.Time);

          this.MaxTotalLicenseOnDate = res.results.data[0]?.Time ? this.dateTimeFormatPipe.transform(res.results.data[0]?.Time) : this.dateTimeFormatPipe.transform(new Date());
          this.plotLine = res.results.data[0]?.TotalLicense ? res.results.data[0]?.TotalLicense : 0
          res.results.data.forEach(element => {
            this.used.push((element.NoOfLicenseUsage == 0 ? ' ' : element.NoOfLicenseUsage <= this.plotLine) ? parseInt(element.NoOfLicenseUsage) : this.plotLine)
            this.labels.push(element?.TimeInterval ? element?.TimeInterval : 0)
            this.overruled.push((element.NoOfLicenseUsage == 0 ? ' ' : element.NoOfLicenseUsage <= this.plotLine) ? 0 : (parseInt(element.NoOfLicenseUsage) == 0 && this.plotLine == 0) ? 0 : parseInt(element.NoOfLicenseUsage) - this.plotLine)
          });
          setTimeout(() => {
            this.option = {}
            this.loadGraph(null, this.labels)
          })
        } else {
          this.labels = [];
          this.overruled = [0];
          this.used = [0]
          this.MaxTotalLicenseOnDate = this.dateTimeFormatPipe.transform(new Date());
          setTimeout(() => {
            this.option = {}
            this.loadGraph(null, this.labels)
          })
        }


        break;

      case 'StackedBarChart':
        if (this.componentRef) {
          this.componentRef.chart = null;
        }

        let StackedBarChartData = []
        this.labels = []
        let abcd = [
          {
            "name": "Block01",
            "data": [
              1,
              2,
              3
            ],
          },
          {
            "name": "Block11",
            "data": [
              2,
              3,
              4
            ],
          }
        ]
        let xyz = this.chartandGraph.blocks.length
        for (let key in this.chartandGraph.blocks) {
          if (this.chartandGraph.blocks[key]?.visible) {
            StackedBarChartData.push({ name: this.chartandGraph.blocks[key].header ? this.chartandGraph.blocks[key].header : 'Block' + (key + 1), data: [Number(key) + 1, Number(key) + 2, Number(key) + 3], color: this.common.color[this.chartandGraph.blocks[key].backgroundColor] })
            this.labels.push(key + (key + 1))
            xyz--;
          }
        }





        if (this.test) {
          setTimeout(() => {
            this.loadGraph(StackedBarChartData, this.labels)
          })
        } else if (res) {
          this.labels = []
          StackedBarChartData.forEach(val => {
            val.data = []
          })
          res.results.data.forEach(res1 => {
            StackedBarChartData.forEach(val => {
              if (res1.hasOwnProperty(val.name)) val.data.push(res1[val.name])
              else val.data.push(0)
            })
            this.labels?.push(res1?.TemplateName ? res1?.TemplateName : '-')
          })
          setTimeout(() => {
            this.loadGraph(StackedBarChartData, this.labels)
          })
        } else {
          this.chartData = []
          StackedBarChartData.forEach(val => {
            val.data = [0]
            this.labels = [0]
          })
          setTimeout(() => {
            this.loadGraph(StackedBarChartData, this.labels)
          })
        }
        break;

      case 'Venn':
        if (this.test) {
          this.vennBlock1 = 0
          this.vennBlock2 = 0
          this.vennBlock3 = 0
        } else if (res) {
          const lowerObj = this.common.ConvertKeysToLowerCase();
          res.results.data[0] = lowerObj(res.results.data[0]);
          this.vennBlock1 = res.results.data[0][(this.chartandGraph.blocks[0].header).toLowerCase()] ? res.results.data[0][(this.chartandGraph.blocks[0].header).toLowerCase()] : 0
          this.vennBlock2 = res.results.data[0][(this.chartandGraph.blocks[1].header).toLowerCase()] ? res.results.data[0][(this.chartandGraph.blocks[1].header).toLowerCase()] : 0
          this.vennBlock3 = res.results.data[0][(this.chartandGraph.blocks[2].header).toLowerCase()] ? res.results.data[0][(this.chartandGraph.blocks[2].header).toLowerCase()] : 0
        } else {
          this.vennBlock1 = 0
          this.vennBlock2 = 0
          this.vennBlock3 = 0
        }
        break;

      default:
        break;
    }


    if (this.dashboardControlTypeSelected == 'List') {
      if (this.test) {
        this.listData = []
      } else if (res) {
        this.chartandGraph?.blocks.forEach(element => {
          element.header = (element.header).toLowerCase()
        });
        for (const key in res.results.data) {
          const lowerObj = this.common.ConvertKeysToLowerCase();
          res.results.data[key] = lowerObj(res.results.data[key]);
        }
        this.listData = res.results.data

      } else {
        this.listData = []
      }
    }
  }

  loadGraph(additionOfAllValues?, labels?) {

    switch (this.chartandGraph?.chartAndGraph) {
      case 'DoughnutChart':
        this.option1 = {
          title: {
            show: this.chartandGraph.displayInnerTextDoughnut,
            text: this.chartandGraph.showSum ? JSON.stringify(additionOfAllValues) : '',
            subtext: this.chartandGraph?.innerTextDoughnut ? this.chartandGraph.innerTextDoughnut : '',
            left: "center",
            top: this.chartandGraph.hideLegend ? "40%" : "35%",
            textStyle: {
              fontSize: this.header_height,
            },
            itemGap: 0,
            subtextStyle: {
              fontSize: this.content_height,
            },
          },

          tooltip: {
            trigger: "item",
            textStyle: {
              fontSize: this.inner_content_height.substring(
                0,
                this.inner_content_height.length - 2
              ),
            },
          },
          legend: {
            show: this.chartandGraph.hideLegend,
            icon: "rect",

            orient: "horizontal",

            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 8,
              fontWeight: 'normal',
              color: '#707070'
            },
          },


          grid: {
            left: "0%",
            right: "0%",
            bottom: "0%",
            containLabel: true,
          },
          selectedOffset: 10,
          series: [
            {
              name: this.chartandGraph?.header ? this.chartandGraph?.header : 'Header',
              type: "pie",
              radius: ["45%", "80%"],
              avoidLabelOverlap: false,
              center: ["50%", "60%"],
              color: this.colorPalette,
              label: {
                position: "outer",
                overflow: "break",
                formatter: "{a|{c}}",
                distanceToLabelLine: -20,
                width: 70,
                fontSize: 8,
                color: "#707070",

                rich: {
                  a: {
                    color: "#212121",
                    fontSize: "16px",
                    fontWeight: "bold",
                  },
                },
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 9,
                  fontWeight: 'bold',
                }
              },
              top: this.chartandGraph.hideLegend ? "-7%" : this.chartandGraph.blocks.length > 4 ? "2%" : "-18%",
              left: "0%",
              bottom: "15%",
              labelLine: {
                show: false,
              },
              clockwise: true,

              data: this.chartData,
            },
          ],
        };
        break;

      case 'LineChart':
        this.option1 = {

          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontSize: this.inner_content_height.substring(0, this.inner_content_height.length - 2)
            },

            position: function (point, params, dom, rect, size) {
              var x = point[0];
              var y = point[1];
              var viewWidth = size.viewSize[0];
              var viewHeight = size.viewSize[1];
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];
              var posX = 0;
              var posY = 0;

              if (x < boxWidth) {
                posX = 5;
              } else {
                posX = x - boxWidth;
              }

              if (y < boxHeight) {
                posY = 5;
              } else {
                posY = y - boxHeight;
              }

              return [posX, posY];

            }
          },
          legend: {
            icon: "rect",
            show: this.chartandGraph.hideLegend,

            orient: "horizontal",

            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 8,
              fontWeight: 'normal',
              color: '#707070',
              fontFamily: 'Nunito Sans'
            },
          },

          grid: {
            top: this.chartandGraph.hideLegend ? '15%' : '5%',
            left: '1%',
            right: '3%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
            }
          ],
          yAxis: {
            type: "value",
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: function (value: any) {
                if (value < 1000) {
                  return value
                } else if (value > 999 && value < 10000) {
                  let a = (value % 1000 == 0 ? value / 1000 : (value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (value > 9999 && value < 100000) {
                  let a = (value % 1000 == 0 ? value / 1000 : (value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (value > 99999 && value < 1000000) {
                  let a = (value % 100000 == 0 ? value / 100000 : (value / 100000).toFixed(0)) + 'L'
                  return a
                } else if (value > 999999 && value < 10000000) {
                  let a = (value % 100000 == 0 ? value / 100000 : (value / 100000).toFixed(0)) + 'L'
                  return a
                }
                //  else if(value >= 100000){
                //   let a= (value/100000).toFixed(0)
                //   return `${a}L`;
                // } else if(value > 9999){
                //   let a= (value/1000).toFixed(0)
                //   return `${a}k`;
                // } else{
                //   let a= (value/1000).toFixed(0)
                //   return `${a}k`;
                //   }
              },
            },
          },
          series: [
            {
              name: this.chartandGraph?.blocks[0].header ? this.chartandGraph?.blocks[0].header : 'Block1',
              type: 'line',
              stack: 'Total',
              lineStyle: {
                width: 2,
                color: this.colorPalette[0]
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: this.colorPalette[0]
                  },
                  {
                    offset: 1,
                    color: '#F8F8F8'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              color: this.colorPalette[0],
              data: this.chartData
            },
          ]
        };
        break;

      case 'StackedLineChart':
        this.option1 = {

          color: this.colorPalette,
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontSize: this.inner_content_height.substring(0, this.inner_content_height.length - 2)
            },
            position: function (point, params, dom, rect, size) {
              var x = point[0];//
              var y = point[1];
              var viewWidth = size.viewSize[0];
              var viewHeight = size.viewSize[1];
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];
              var posX = 0;
              var posY = 0;

              if (x < boxWidth) {
                posX = 5;
              } else {
                posX = x - boxWidth;
              }

              if (y < boxHeight) {
                posY = 5;
              } else {
                posY = y - boxHeight;
              }

              return [posX, posY];

            }
          },
          legend: {
            show: this.chartandGraph.hideLegend,
            icon: "rect",

            orient: "horizontal",

            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 8,
              fontWeight: 'normal',
              color: '#707070',
              fontFamily: 'Nunito Sans'
            },
          },

          grid: {
            top: this.chartandGraph.hideLegend ? '12%' : '5%',
            left: '0%',
            right: '3%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: labels,

              axisLine: {

                lineStyle: {
                  color: '#eaeaea',
                  width: 1,
                }
              },
              axisLabel: {
                color: '#707070',
              }
            }
          ],
          yAxis: {
            type: "value",
            axisLine: {
              show: true,

              lineStyle: {
                color: '#eaeaea',
                width: 1,
              }
            },
            axisLabel: {
              formatter: function (value: any) {
                if (value < 1000) {
                  return value
                } else if (value > 999 && value < 10000) {
                  let a = (value % 1000 == 0 ? value / 1000 : (value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (value > 9999 && value < 100000) {
                  let a = (value % 1000 == 0 ? value / 1000 : (value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (value > 99999 && value < 1000000) {
                  let a = (value % 100000 == 0 ? value / 100000 : (value / 100000).toFixed(0)) + 'L'
                  return a
                } else if (value > 999999 && value < 10000000) {
                  let a = (value % 100000 == 0 ? value / 100000 : (value / 100000).toFixed(0)) + 'L'
                  return a
                }
                // if(value< 1000){
                //   return value
                // } else if(value >= 100000){
                //   let a= (value/100000).toFixed(0)
                //   return `${a}L`;
                // } else if(value > 9999){
                //   let a= (value/1000).toFixed(0)
                //   return `${a}k`;
                // } else{
                //   let a= (value/1000).toFixed(0)
                //   return `${a}k`;
                //   }
              },
              color: '#707070',
            },
          },
          series: additionOfAllValues
        };
        break;

      case 'Gauge':
        this.option1 = {
          series: [
            {
              type: 'gauge',
              progress: {
                show: true,
                width: 30,
                itemStyle: {
                  color: this.common.color[this.chartandGraph?.gaugePercentColor]
                }
              },
              pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',

                width: 10,
                offsetCenter: [0, '0%'],
                itemStyle: {
                  color: '#EAEAEA'
                },

              },
              radius: this.chartandGraph.gaugePercentCount ? "90%" : "100%",
              axisLine: {
                lineStyle: {
                  width: 30
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                length: 5,
                lineStyle: {
                  width: 2,
                  color: '#EAEAEA'
                }
              },
              axisLabel: {
                distance: 25,
                color: '#999',
                fontSize: 20,
                show: false
              },
              anchor: {
                show: false,
                showAbove: false,
                size: 5,
                itemStyle: {
                  color: '#EAEAEA',
                  borderWidth: 10
                }
              },
              title: {
                show: false
              },
              detail: {
                show: this.chartandGraph?.gaugePercentCount,
                backgroundColor: '#F8F8F8',
                borderColor: '#EAEAEA',
                color: this.common.color[this.chartandGraph?.gaugePercentColor],
                borderWidth: 2,
                width: '100%',
                lineHeight: 20,
                fontSize: 10,
                height: 10,
                borderRadius: 4,
                offsetCenter: [0, '90%'],
                valueAnimation: true,

                formatter: function (value) {
                  return labels ? labels + ' ' + value + '%' : '' + value + '%'
                },
              },
              data: [
                {
                  value: additionOfAllValues ? additionOfAllValues : 0
                }
              ]
            }
          ]
        };
        break;

      case 'GaugeWithProgressBars':
        this.option1 = {
          series: [
            {
              type: 'gauge',
              progress: {
                show: true,
                width: 10,
                itemStyle: {
                  color: this.common.color[this.chartandGraph?.gaugePercentColor]
                }
              },
              pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',

                width: 10,
                offsetCenter: [0, '0%'],
                itemStyle: {
                  color: '#EAEAEA'
                },

              },
              radius: this.chartandGraph.gaugePercentCount ? "90%" : "100%",
              axisLine: {
                lineStyle: {
                  width: 10
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                length: 5,
                lineStyle: {
                  width: 2,
                  color: '#EAEAEA'
                }
              },
              axisLabel: {
                distance: 5,
                color: '#999',
                fontSize: 8,
                show: false
              },
              anchor: {
                show: false,
                showAbove: false,
                size: 5,
                itemStyle: {
                  color: '#EAEAEA',
                  borderWidth: 10
                }
              },
              title: {
                show: false
              },
              // detail: {
              //   show:this.chartandGraph?.gaugePercentCount,
              //   backgroundColor: '#F8F8F8',
              //   borderColor: '#EAEAEA',
              //   color:this.common.color[this.chartandGraph?.gaugePercentColor],
              //   borderWidth: 2,
              //   width: '100%',
              //   lineHeight: 20,
              //   fontSize:10,
              //   height: 10,
              //   borderRadius: 4,
              //   offsetCenter: [0, '90%'],
              //   valueAnimation: true,

              //   formatter: function (value) {
              //     return labels ? labels+' ' + value+'%':'' + value+'%'
              //   },
              // },
              detail: {
                valueAnimation: true,
                fontSize: '0.8vw',
                offsetCenter: [0, '70%'],
                formatter: function (value) {
                  return labels ? labels + ' ' + value + '%' : '' + value + '%'
                },
              },
              data: [
                {
                  value: additionOfAllValues ? additionOfAllValues : 0
                }
              ]
            }
          ]
        };
        break;

      case 'BarChart':
        this.option1 = {
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontSize: this.inner_content_height.substring(0, this.inner_content_height.length - 2)
            },
            position: function (point, params, dom, rect, size) {
              var x = point[0];//
              var y = point[1];
              var viewWidth = size.viewSize[0];
              var viewHeight = size.viewSize[1];
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];
              var posX = 0;
              var posY = 0;

              if (x < boxWidth) {
                posX = 5;
              } else {
                posX = x - boxWidth;
              }

              if (y < boxHeight) {
                posY = 5;
              } else {
                posY = y - boxHeight;
              }

              return [posX, posY];

            }
          },
          legend: {
            icon: "rect",
            show: false,

            orient: "horizontal",

            itemWidth: 16,
            itemHeight: 12,
            textStyle: {
              fontSize: 8,
              fontWeight: 'normal',
              color: '#707070',
              fontFamily: 'Nunito Sans'
            },
          },

          grid: {
            top: '12%',
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
              data: labels,

            }
          ],
          yAxis: {
            type: "value",
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: function (value: any) {
                if (value < 1000) {
                  return value
                } else if (value > 999 && value < 10000) {
                  let a = (value % 1000 == 0 ? value / 1000 : (value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (value > 9999 && value < 100000) {
                  let a = (value % 1000 == 0 ? value / 1000 : (value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (value > 99999 && value < 1000000) {
                  let a = (value % 100000 == 0 ? value / 100000 : (value / 100000).toFixed(0)) + 'L'
                  return a
                } else if (value > 999999 && value < 10000000) {
                  let a = (value % 100000 == 0 ? value / 100000 : (value / 100000).toFixed(0)) + 'L'
                  return a
                }
                // if(value< 1000){
                //   return value
                // } else if(value >= 100000){
                //   let a= (value/100000).toFixed(0)
                //   return `${a}L`;
                // } else if(value > 9999){
                //   let a= (value/1000).toFixed(0)
                //   return `${a}k`;
                // } else{
                //   let a= (value/1000).toFixed(0)
                //   return `${a}k`;
                //   }
              },
            },
          },
          series: [

            {
              data: additionOfAllValues,
              label: {
                show: true,
                position: 'top'
              },
              type: 'bar',
            }
          ]
        };
        break;

      case 'BarChartIconOnTop':
        let dataSum = 0
        let BarChartIconOnTopIcons = []
        this.chartandGraph.blocks.forEach(element => {
          BarChartIconOnTopIcons.push({ icon: "class ='normal-font icon-" + element?.selectedIcon + " '", color: "style ='color:" + this.common?.color[element?.selectedIconColor] + " '" })
        });
        additionOfAllValues.forEach(element => {
          dataSum += element.y
        });
        this.option = {
          chart: {
            type: 'column',
            marginLeft: -5,
            marginBottom: 20,
            marginRight: 0,
            marginTop: 0,
          },
          title: {
            text: '',
            enabled: false
          },
          credits: {
            enabled: false
          },
          xAxis: {
            type: 'category',
            categories: labels,


          },
          yAxis: {
            enabled: false,
            visible: false,
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              pointPadding: 0,
              groupPadding: 0.2,
              dataLabels: {
                enabled: true,
                align: 'center',
                y: dataSum == 0 ? 100 : 0,

                useHTML: true,
                position: 'center',
                formatter: function () {

                  if (dataSum == 0)
                    return "<div class='d-flex align-items-center' style='z-index:-1'>" + "<i " + BarChartIconOnTopIcons[this.point.x].icon + " " + BarChartIconOnTopIcons[this.point.x].color + "></i>&nbsp;" + 0 + '% ' + "</div>";
                  else
                    return "<div class='d-flex align-items-center' style='z-index:-1'>" + "<i " + BarChartIconOnTopIcons[this.point.x].icon + " " + BarChartIconOnTopIcons[this.point.x].color + "></i>&nbsp;" + (this.y / dataSum * 100).toFixed(0) + '% ' + "</div>";
                },
                style: {
                  "font-size": '16px'
                }
              }
            }
          },


          tooltip: {
            distance: 30,
            style: {
              fontSize: this.inner_content_height.substring(0, this.inner_content_height.length - 2)
            },
            formatter: function () {
              return this.x + ": " + this.y
            }
          },

          series: [{
            color: '#9378D9',
            data: additionOfAllValues

          }],
        }
        break;

      case 'LicenseUsageBarChart':
        let maxlicensedUsed = this.MaxTotalLicense
        let maxlicensedUsedTime = this.MaxTotalLicenseOnDate

        this.option2 = {
          chart: {
            type: 'column',
            marginLeft: 25,
            marginBottom: 20,
            marginTop: 30
          },
          title: {
            text: '',
            enabled: false

          },

          xAxis: {
            categories: labels,
          },
          yAxis: {
            x: -20,
            min: 0,
            visibility: true,
            lineWidth: 1,
            lineColor: '#ccc',
            title: {
              text: 'Total fruit consumption',
              enabled: false
            },
            width: 15,
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: (
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
                ) || 'gray',
                textOutline: 'none'
              },
              formatter: function () {

                if (this.total > 0) {
                  return this.total;
                }
              }
            },
            labels: {
              formatter: function () {
                if (this.value < 1000) {
                  return this.value
                } else if (this.value > 999 && this.value < 10000) {
                  let a = (this.value % 1000 == 0 ? this.value / 1000 : (this.value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (this.value > 9999 && this.value < 100000) {
                  let a = (this.value % 1000 == 0 ? this.value / 1000 : (this.value / 1000).toFixed(0)) + 'K'
                  return a
                } else if (this.value > 99999 && this.value < 1000000) {
                  let a = (this.value % 100000 == 0 ? this.value / 100000 : (this.value / 100000).toFixed(0)) + 'L'
                  return a
                } else if (this.value > 999999 && this.value < 10000000) {
                  let a = (this.value % 100000 == 0 ? this.value / 100000 : (this.value / 100000).toFixed(0)) + 'L'
                  return a
                }
                // if(this.value == 0){
                //   return this.value;
                // }
                // if(this.value.toString().length <=3){
                //   return this.value;
                // }
                // if(this.value.toString().length >3){
                //   var a = this.value / 1000
                //   if(a == 0)
                //   return a;
                //   var b = a. toFixed(1) + 'k'
                //   return b;
                // }
              },
              align: 'center',
              x: -3,
              y: 0
            },
            plotLines: [{
              color: this.common.color[this.chartandGraph?.maxLicenseAllowedLineColor],
              width: 2,
              value: this.plotLine ? this.plotLine : 0,
              zIndex: 5
            }]
          },
          legend: {
            enabled: this.chartandGraph?.hideLegend ? this.chartandGraph?.hideLegend : false,
            align: 'center',
            itemStyle: {
              fontSize: 8,
              fontWeight: 'normal',
              color: '#707070',
              fontFamily: 'Nunito Sans'
            },
            x: 0,
            y: -45,
            overflow: true,
            verticalAlign: 'top',
            padding: 0,
            symbolRadius: 0,
            itemDistance: 5,
            floating: false,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 0,
            shadow: false,
          },
          subtitle: {
            text: '<span style="font-size:8; line">Max license used: <b>' + maxlicensedUsed
              + '</b><br/>On ' + maxlicensedUsedTime + '</span>',
            align: 'right',
            x: 5,
            y: 12
          },
          tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
            style: {

              fontSize: this.inner_content_height.substring(0, this.inner_content_height.length - 2)
            }
          },
          plotOptions: {

            column: {

              pointPadding: 0,
              groupPadding: 0.1,
              borderWidth: 0,

              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
          },
          credits: {
            enabled: false
          },
          series: [{
            name: this.chartandGraph?.blocks[1]?.header ? this.chartandGraph?.blocks[1]?.header : 'Overruled',
            data: this.overruled,
            color: this.common?.color[this.chartandGraph?.blocks[1]?.backgroundColor],
            dataLabels: {
              enabled: false,
              visible: false,
              align: 'bottom',
              style: {
                color: '#FFFFFF',
                textOutline: 'none',
              }
            }
          }, {
            name: this.chartandGraph?.blocks[0]?.header ? this.chartandGraph?.blocks[0]?.header : 'License Used',
            data: this.used,
            color: this.common?.color[this.chartandGraph?.blocks[0]?.backgroundColor],
            dataLabels: {
              enabled: false,
              visible: false,
              align: 'bottom',
              style: {
                color: '#FFFFFF',
                textOutline: 'none',
              }
            }

          }],

        };

      case 'StackedBarChart':

        this.option = {
          chart: {
            type: 'column',
            marginLeft: 25,
            marginBottom: 25
          },
          title: {
            text: '',
            enabled: false
          },
          xAxis: {
            categories: labels,
          },
          yAxis: {
            x: -20,
            min: 0,
            visibility: true,
            lineWidth: 1,
            lineColor: '#ccc',
            title: {
              text: 'Total fruit consumption',
              enabled: false
            },
            stackLabels: {
              enabled: false,
              style: {
                fontWeight: 'bold',
                color: (
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
                ) || 'gray',
                textOutline: 'none'
              }
            },
            labels: {
              formatter: function () {
                if (this.value == 0) {
                  return this.value;
                }
                if (this.value.toString().length <= 3) {
                  return this.value;
                }
                if (this.value.toString().length > 3) {
                  var a = this.value / 1000
                  if (a == 0)
                    return a;
                  var b = a.toFixed(1) + 'k'
                  return b;
                }
              },
              align: 'center',
              x: -3,
              y: 0
            },

          },
          legend: {
            enabled: this.chartandGraph.hideLegend ? this.chartandGraph.hideLegend : false,
            align: 'center',
            itemStyle: {
              fontSize: 8,
              fontWeight: 'normal',
              color: '#707070',
              fontFamily: 'Nunito Sans'
            },
            x: 0,
            verticalAlign: 'top',
            y: 0,
            padding: 0,
            symbolRadius: 0,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 0,
          },
          tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
            style: {
              fontSize: this.inner_content_height.substring(0, this.inner_content_height.length - 2)

            }
          },
          plotOptions: {

            series: {

              pointPadding: 0,
              groupPadding: 0.1,
              borderWidth: 0,


              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
          },
          credits: {
            enabled: false
          },
          series: additionOfAllValues,

        };
        break;
      default:
        break;
    }
  }



  openDrillDown() {
    this.common.hubControlEvent('Dashboard', 'click', '', '', '', 'openDrillDown');

    let header = this.chartandGraph?.header ? this.chartandGraph?.header : 'Header'
    let obj;
    if (this.chartandGraph.apiRequest) obj = this.returnObjectWithKeys(this.chartandGraph.apiRequest);
    if (this.chartandGraph.api && (this.chartandGraph.api.trim()).length > 0 && this.chartandGraph.apiRequest && (this.chartandGraph.apiRequest.trim()).length > 0) {
      this.common.openDrillDown(header, obj, this.chartandGraph.api)
    }
  }



  filterFieldSelected(val) {
    this.common.hubControlEvent('Dashboard', 'click', '', '', JSON.stringify(val), 'filterFieldSelected');

    if (this.customFilterFieldSelected != val) {
      this.customFilterFieldSelected = val
    } else {
      this.customFilterFieldSelected = null
    }
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  returnObjectWithKeys(inputObj: any) {


    let obj = JSON.parse(inputObj)
    const lowerObj = this.common.ConvertKeysToLowerCase();

    obj = lowerObj(obj);
    obj.data.parameters = lowerObj(obj.data.parameters);
    if (obj?.data?.parameters?.processid) {
      obj.data.parameters.processid = this.userDetails?.Processid
    } else {
      Object.assign(obj.data.parameters, { processid: this.userDetails?.Processid })
    }

    if (obj?.data?.parameters?.adminid) {
      obj.data.parameters.adminid = this.userDetails?.Id
    } else {
      Object.assign(obj.data.parameters, { adminid: this.userDetails.Id })
    }

    if (obj?.data?.parameters?.channelid) {
      obj.data.parameters.channelid = this.selectedChannelType.join()
    } else {
      Object.assign(obj.data.parameters, { channelid: this.selectedChannelType.join() })
    }

    if (obj?.data?.parameters?.groupid) {
      obj.data.parameters.groupid = this.selectedGetGroupList.join()
    } else {
      Object.assign(obj.data.parameters, { groupid: this.selectedGetGroupList.join() })
    }

    if (obj?.data?.parameters?.skillid) {
      obj.data.parameters.skillid = this.selectedSkillType.join()
    } else {
      Object.assign(obj.data.parameters, { skillid: this.selectedSkillType.join() })
    }

    if(this.chartandGraph?.customFilter && this.chartandGraph?.customFilterValues.length > 0){
      if (obj?.data?.parameters?.graphfilter) {
        obj.data.parameters.graphfilter = this.customFilterFieldSelected
      } else {
        Object.assign(obj.data.parameters, { graphfilter : this.customFilterFieldSelected })
      }
    }

    if (obj?.data?.parameters?.frequency) {
      obj.data.parameters.frequency = this.selectedDateFilterValue ? this.selectedDateFilterValue : 'Day'
    } else {
      Object.assign(obj.data.parameters, { frequency: this.selectedDateFilterValue ? this.selectedDateFilterValue : 'Day' })
    }

    if (this.selectedDateFilterValue == "Hour") {
      if (obj?.data?.parameters?.hour) {
        obj.data.parameters.hour = this.currentDateTime.getHours()
      } else {
        Object.assign(obj.data.parameters, { hour: this.currentDateTime.getHours() })
      }
    } else if (this.selectedDateFilterValue == "Day") {
      if (obj?.data?.parameters?.date) {
        obj.data.parameters.date = this.convert(this.currentDateTime)
      } else {
        Object.assign(obj.data.parameters, { date: this.convert(this.currentDateTime) })
      }
    } else if (this.selectedDateFilterValue == "Week") {
      if (obj?.data?.parameters?.from) {
        obj.data.parameters.from = this.startOfWeek
      } else {
        Object.assign(obj.data.parameters, { from: this.startOfWeek })
      }

      if (obj?.data?.parameters?.to) {
        obj.data.parameters.to = this.endOfWeek
      } else {
        Object.assign(obj.data.parameters, { to: this.endOfWeek })
      }
    } else if (this.selectedDateFilterValue == "Month") {
      if (obj?.data?.parameters?.month) {
        obj.data.parameters.month = this.currentDateTime.getMonth() + 1
      } else {
        Object.assign(obj.data.parameters, { month: this.currentDateTime.getMonth() + 1 })
      }

      if (obj?.data?.parameters?.year) {
        obj.data.parameters.year = this.currentDateTime.getFullYear()
      } else {
        Object.assign(obj.data.parameters, { year: this.currentDateTime.getFullYear() })
      }
    } else if (this.selectedDateFilterValue == "Year") {
      if (obj?.data?.parameters?.year) {
        obj.data.parameters.year = this.currentDateTime.getFullYear()
      } else {
        Object.assign(obj.data.parameters, { year: this.currentDateTime.getFullYear() })
      }
    } else if (!this.selectedDateFilterValue) {
      if (obj?.data?.parameters?.date) {
        obj.data.parameters.date = this.convert(this.currentDateTime)
      } else {
        Object.assign(obj.data.parameters, { date: this.convert(this.currentDateTime) })
      }
    }
    return obj;
  }

  getTomorrowDate() {
    this.common.hubControlEvent('Dashboard', 'click', '', '', '', 'getTomorrowDate');

    this.currentDateTime = new Date(
      this.currentDateTime.getTime() + 24 * 60 * 60 * 1000
    );
  }

  getYesterdayDate() {
    this.common.hubControlEvent('Dashboard', 'click', '', '', '', 'getYesterdayDate');

    this.currentDateTime = new Date(
      this.currentDateTime.getTime() - 24 * 60 * 60 * 1000
    );
  }


  changeDate(direction: any) {
    this.common.hubControlEvent('Dashboard', 'click', '', '', JSON.stringify(direction), 'changeDate');

    this.today = new Date();
    if (direction == "next") {
      if (this.selectedDateFilterValue == "Hour") {
        this.currentDateTime = new Date(this.currentDateTime.setHours(this.currentDateTime.getHours() + 1))
        this.apiCallMethod()
        if (this.currentDateTime.getHours() == this.today.getHours()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedDateFilterValue == "Day") {
        this.getTomorrowDate();
        this.apiCallMethod()
        if ((this.currentDateTime.toJSON()).substring(0, 10) == (this.today.toJSON()).substring(0, 10)) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedDateFilterValue == "Week") {
        let week = this.week.transform(this.currentDateTime) + 1
        let currentWeek = this.week.transform(new Date())
        this.endOfWeek = this.common.dateFromDay(((week - 1) * 7) + 1)
        this.startOfWeek = this.common.dateFromDay(((week - 1) * 7) - 5)
        this.currentDateTime = new Date(this.startOfWeek)
        this.apiCallMethod()
        if (week == 1) {
          this.backDisable = true;
        } else {
          this.backDisable = false;
        } if (week == currentWeek) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedDateFilterValue == "Month") {
        if (this.currentDateTime.getMonth() == 11) {
          this.currentDateTime = new Date(
            this.currentDateTime.getFullYear() + 1,
            0,
            1
          );
          this.apiCallMethod()

          if (
            this.currentDateTime.getMonth() == this.today.getMonth() &&
            this.currentDateTime.getFullYear() == this.today.getFullYear()
          ) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else {
          this.currentDateTime = new Date(
            this.currentDateTime.getFullYear(),
            this.currentDateTime.getMonth() + 1,
            1
          );
          this.apiCallMethod()
          if (
            this.currentDateTime.getMonth() == this.today.getMonth() &&
            this.currentDateTime.getFullYear() == this.today.getFullYear()
          ) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        }
      } else if (this.selectedDateFilterValue == "Year") {
        this.currentDateTime = new Date(
          this.currentDateTime.getFullYear() + 1,
          this.currentDateTime.getMonth(),
          1
        );
        this.apiCallMethod()
        if (this.currentDateTime.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedDateFilterValue == "Hour") {
        this.currentDateTime = new Date(this.currentDateTime.setHours(this.currentDateTime.getHours() - 1))
        this.apiCallMethod()
        this.nextDisable = false
        if (this.currentDateTime.getHours() == 0) {
          this.backDisable = true;
        } else {
          this.backDisable = false;
        }
      } else if (this.selectedDateFilterValue == "Day") {
        this.getYesterdayDate();
        this.apiCallMethod()
        this.nextDisable = false;
      } else if (this.selectedDateFilterValue == "Week") {
        let week = this.week.transform(this.currentDateTime) - 1
        let currentWeek = this.week.transform(new Date())
        this.endOfWeek = this.common.dateFromDay(((week - 1) * 7) + 1)
        if (week == 1) {
          this.startOfWeek = this.common.dateFromDay(1)
        } else this.startOfWeek = this.common.dateFromDay(((week - 1) * 7) - 5)
        this.currentDateTime = new Date(this.startOfWeek)
        this.apiCallMethod()
        if (week == 1) {
          this.backDisable = true;
        } else {
          this.backDisable = false;
        } if (week == currentWeek) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedDateFilterValue == "Month") {
        if (this.currentDateTime.getMonth() == 0) {
          this.currentDateTime = new Date(
            this.currentDateTime.getFullYear() - 1,
            11,
            1
          );
          this.apiCallMethod()
          this.nextDisable = false;
        } else {
          this.currentDateTime = new Date(
            this.currentDateTime.getFullYear(),
            this.currentDateTime.getMonth() - 1,
            1
          );
          this.apiCallMethod()
          this.nextDisable = false;
        }
      } else if (this.selectedDateFilterValue == "Year") {
        this.currentDateTime = new Date(
          this.currentDateTime.getFullYear() - 1,
          this.currentDateTime.getMonth(),
          1
        );
        this.apiCallMethod()
        this.nextDisable = false;
      }
    }
  }


  selectedOptionValue() {
    this.common.hubControlEvent('Dashboard', 'click', '', '', '', 'selectedOptionValue');

    this.currentDateTime = new Date();
    if (this.selectedDateFilterValue == "Hour") {
      if (this.currentDateTime.getHours() == 0) this.backDisable = true;
      else this.backDisable = false;
      if (this.currentDateTime.getHours() == 23) this.nextDisable = true;
      else this.nextDisable = false;
    } else if (this.selectedDateFilterValue == "Day") {
      if (
        this.currentDateTime.toISOString().slice(0, 10) ==
        this.today.toISOString().slice(0, 10)
      ) {
        this.nextDisable = true;
      } else {
        this.nextDisable = false;
      }
    } else if (this.selectedDateFilterValue == "Week") {
      let week = this.week.transform(this.currentDateTime)
      let currentWeek = this.week.transform(new Date())
      this.endOfWeek = this.common.dateFromDay(((week - 1) * 7) + 1)
      this.startOfWeek = this.common.dateFromDay(((week - 1) * 7) - 5)
      this.currentDateTime = new Date(this.startOfWeek)
      if (week == 1) {
        this.backDisable = true;
      } else {
        this.backDisable = false;
      } if (week == currentWeek) {
        this.nextDisable = true;
      } else {
        this.nextDisable = false;
      }
    } else if (this.selectedDateFilterValue == "Month") {
      if (
        this.currentDateTime.getMonth() == this.today.getMonth() &&
        this.currentDateTime.getFullYear() == this.today.getFullYear()
      ) {
        this.nextDisable = true;
      } else {
        this.nextDisable = false;
      }
    } else if (this.selectedDateFilterValue == "Year") {
      if (this.currentDateTime.getFullYear() == this.today.getFullYear()) {
        this.nextDisable = true;
      } else {
        this.nextDisable = false;
      }
    }
    this.apiCallMethod()
  }

  addNewItem(value: boolean) {
    this.cardObject.emit(this.chartandGraph);
  }

  convert(str) {

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  deleteCard() {
    this.common.hubControlEvent('Dashboard', 'click', '', '', '', 'deleteCard');

    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status) {
        this.cardObject.emit(this.chartandGraph);
      }



      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

  editCard() {
    this.common.hubControlEvent('Dashboard', 'click', '', '', '', 'editCard');

    this.editData.next({ type: this.dashboardControlTypeSelected == 'ChartAndGraph' ? 2 : 3, index: this.index })
  }

}