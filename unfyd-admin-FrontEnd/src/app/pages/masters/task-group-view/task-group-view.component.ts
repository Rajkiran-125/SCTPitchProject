import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-task-group-view',
  templateUrl: './task-group-view.component.html',
  styleUrls: ['./task-group-view.component.scss']
})
export class TaskGroupViewComponent implements OnInit {
  status
  loader = false
  option1:any
  taskGroupInfo :any = { Status: false}
  @ViewChild('panel0') public panel0: MatDrawer;
  inner_content_height = getComputedStyle(document.body).getPropertyValue(
    "--inner_content"
  );
  content_height = getComputedStyle(document.body).getPropertyValue(
    "--content"
  );
  header_height = getComputedStyle(document.body).getPropertyValue("--header");
  colorPalette = this.common.colorArray.concat(this.common.colorArray)
  path:any
  userDetails: any
  getGroupList = []
  subscription: Subscription[] = [];
  labelName: any;
  piedata: any;

  constructor(private router: Router, private common: CommonService,
              private activatedRoute: ActivatedRoute,
              private api: ApiService, private auth: AuthService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.getData()
    this.getGroupType()
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))

    this.getpiechart()

  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Skills', 'click', '', '', data, 'setLabelByLanguage');

    // this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        // this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'TaskGroup', data)

  }

  back(){
    this.router.navigateByUrl('/masters/task-group')
  }

  getGroupType(){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
      this.loader = false;
      this.getGroupList = res.results['data'];
    })
  }

  getData(){
    this.loader = true
    let obj = {
      data: {
        spname: "usp_unfyd_task_group",
        parameters: {
          FLAG :'EDIT',
          ID : this.path
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
      this.loader = false;
        if (res.code == 200) {
          if(res.results.data.length > 0){
            this.loader = false
            res.results.data[0].SortCondition = res.results.data[0].SortCondition ? res.results.data[0].SortCondition.split(',') : []
            res.results.data[0].UserGroup = res.results.data[0].UserGroup ? res.results.data[0].UserGroup.split(',') : []
            res.results.data[0].TaskGroupFields = res.results.data[0].TaskGroupFields ? JSON.parse(res.results.data[0].TaskGroupFields) : []
            res.results.data[0].ApplyFilter = res.results.data[0].ApplyFilter ? JSON.parse(res.results.data[0].ApplyFilter) : { "condition": "and", "rules": [] }
            res.results.data[0].RechurnRule = res.results.data[0].RechurnRule ? JSON.parse(res.results.data[0].RechurnRule) : []
            res.results.data[0].fieldMapping = res.results.data[0].fieldMapping ? JSON.parse(res.results.data[0].fieldMapping) : []
            res.results.data[0].apiConfig = res.results.data[0].apiConfig ? JSON.parse(res.results.data[0].apiConfig) : ''
            this.taskGroupInfo = res.results.data[0]
            this.status = res.results.data[0].Status
            console.log(this.taskGroupInfo);

          }
        }
      })
  }

  configureApi(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'configureApiTaskGroup',
        taskGroupInfo : this.taskGroupInfo
      },
      width: "100%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      if(status){
        console.log(status);
        this.getData()
      }
    })
  }

  viewData(flag){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: flag,
        taskGroupInfo : this.taskGroupInfo
      },
      width: flag == 'sortcondition' ? "40%" : flag == 'rechurnrule' ? "70%" : "70%",
      maxHeight : '85vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      if(flag != 'copyTaskGroupAPI') this.taskGroupInfo = status
      // if(status){
      //   console.log(status);
      //   this.getData()
      // }
    })
  }

  clickedOn(val){
    setTimeout(() => {
      if(val == 'closed') this.panel0.close()
    });
  }

  getpiechart(){
    var obj = {
      data: {
        spname: "usp_unfyd_tasks",
        parameters: {
          flag: "GET_TASK_STATS",
          TASKGROUPID: this.path
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        // let piedata
        this.piedata = res.results.data
        let a = []
        res.results.data.forEach(elementtt => {
          a.push({value: elementtt['Count'], name : elementtt.Status})

        });

    this.option1 = {
      title: {
        show: true,
        text: '100',
        subtext: 'total',
        left: "center",
        top: "30%",
        textStyle: {
          fontSize: 20,
        },
        itemGap: 0,
        subtextStyle: {
          fontSize: this.content_height,
        },
      },
      // grid: {
      //   left: "50%",
      //   right: "0%",
      //   bottom: "0%",
      //   containLabel: false,
      // },
      tooltip: {
        trigger: "item",
        formatter: '{b}: {c}',
        textStyle: {
          fontSize: this.inner_content_height.substring(
            0,
            this.inner_content_height.length - 2
          ),
        },

      },
      legend: {
        bottom: '1%',
        left: 'center',
        icon: "circle",
        orient: "horizontal",
        // padding: 0,
        itemGap: 6,
        itemWidth: 6,
        itemHeight: 6,
        width : "100%",
        textStyle: {
          fontSize: 7,
          fontWeight: 'normal',
          color: '#707070'
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ["50%", "40%"],
          avoidLabelOverlap: false,
          labelLine : {
            show : false,
            length: 0
          },
          label: {
            show: true,
            distanceToLabelLine : 0,
            fontSize : this.inner_content_height,
            fontWeight : 'bold',
            formatter: '{c}'
            // position: 'center'
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: 40,
          //     fontWeight: 'bold'
          //   }
          // },
          data: a
        }
      ]
    };
        // console.log('====',piedata);

        // this.piedatacon = {
        //   value: piedata.Count,
        //   name: piedata.Status
        // }

      }
    })
  }

  editTaskGroup(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'taskGroupMaster',
        data: this.taskGroupInfo,
        // parameter : val
      },
      width: "100%",
      maxHeight : '85vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      console.log(status);
      this.common.TaskField.next(true)
      if(status){
        this.getData()
      }
    })
  }

  changeStatus(){
    setTimeout(() => {
      let obj = {
        data: {
          spname: "usp_unfyd_task_group",
          parameters: {
            FLAG :'TASK_GROUP_STATUS',
            STATUS : this.status,
            MODIFIEDBY : this.userDetails.Id,
            ID : this.path
          }
        }
      }
      this.loader = true
      this.api.post('index',obj).subscribe((res: any) => {
        this.loader = false;
          if (res.code == 200) {
            if(res.results.data.length > 0){
              this.loader = false;
              this.common.snackbar("TaskGroupStatus")
            }
          }
        })
    });
  }
}
