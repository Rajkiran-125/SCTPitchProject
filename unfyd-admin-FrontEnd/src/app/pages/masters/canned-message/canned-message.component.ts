import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {of as observableOf, Subscription} from 'rxjs';
import { TreeData } from 'src/app/global/treeService/tree-data.model';
import { TreeDataService } from 'src/app/global/treeService/tree-data.service';
import { TreeFunctionService } from 'src/app/global/treeService/tree-function.service';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddNodeComponent, NewNodeDialog,AddNodeDialogModule,AddNodeModule} from 'src/app/shared/treeControl/add-node/add-node.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';



export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-canned-message',
  templateUrl: './canned-message.component.html',
  styleUrls: ['./canned-message.component.scss']
})

export class CannedMessageComponent implements OnInit {

  configs = {
    placeholder: '',
    tabsize: 1,
    height: '200px',
    uploadImagePath: '/api/upload',

    toolbar: [
      ['fontsize', ['fontname']],

      ['style', ['bold', 'underline', 'italic',]],

      ['para', ['ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table']],
      ['font', ['clear']],



    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']

  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }


  form: FormGroup;
  productID: any;
  productName: any = '';
  productType: any = '';
  selected :any;
  selectedcat : any;
  channelName : any ;
  ChannelNameSelect : any;
  requestObj: any;
  languageType: any = [];
  labelName: any;
  language1: any = [];
  report: any;
  channelType: any = [];
  selectedchannel: any = '';
  selectedlanguage: any = '';
  icons: any = [];
  ChannelName: any;
  language :any;
  IsChildAvail:boolean = true;
  loader :boolean = false;
  addbutton: boolean = false
  changeModuleDisplayName: string;
  userConfig: any;
  userChannelName:any=[];
  userLanguageName:any=[];



  getProducts() {
    this.common.hubControlEvent('canned-message','click','','','','getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'))
    this.productName = this.productType[0].ProductName
    this.getSnapShot();
  }




  selectedProduct(e) {
    this.common.hubControlEvent('canned-message','click','','',e,'selectedProduct');

    this.productName = e
  }

  selectedCategory(e) {
    this.common.hubControlEvent('canned-message','click','','',e,'selectedCategory');

    this.channelName = e
  }


  config: any;
  getSnapShot() {
    this.common.hubControlEvent('canned-message','click','','','','getSnapShot');
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, 'CannedMessages');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )

    this.setLabelByLanguage(localStorage.getItem("lang"))

  }


  setLabelByLanguage(data) {

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'CannedMessages', data)

  }









  getreport(){

    var Obj1 = {
      data: {
        spname: "usp_unfyd_rpt_export_details",
        parameters: {
          flag: 'GETREPORT',

        }
      }
    }
    this.common.hubControlEvent('canned-message','click','','',JSON.stringify(Obj1),'getreport');

    this.api.post('index', Obj1).subscribe(res => {


      if (res.code == 200) {
        this.report = res.results.data;
      }
    })


  }







  getcannedresponses() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_canned_responses",
        parameters: {
          flag: 'GET'
        }
      }
    }
    this.common.hubControlEvent('canned-message','click','','',JSON.stringify(Obj1),'getcannedresponses');

    this.api.post('index', Obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.agents = res.results.data;
      }
    })
  }
  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;
  gettreeList : any = [] ;
  userDetails: any;
  agents = [];
  localizationDataAvailble = false;
  localizationData :any = [];
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];

  constructor(
    private dataService: TreeDataService,
    private service: TreeFunctionService,
    private api: ApiService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,
    private common: CommonService,
    public dialog: MatDialog,
  ) {
    this.userDetails = this.auth.getUser();
  }


  ngOnInit(): void {
    this.common.hubControlEvent('canned-message','click','pageload','pageload','','ngOnInit');

    this.form = this.formBuilder.group({
      productName : ["", [Validators.nullValidator]],
    

    });


    this.loader=true;
    this.getcannedresponses();
    this.getProducts();
    this.getChannelName();
    // this.getLanguage();
    // this.getChannel();
    this.getChannelStorage();
   this.getLanguageStorage()
    // this.gettreeListData()
    this.subscription.push(this.common.localizationDataAvailable$.subscribe((res)=>{
      this.localizationDataAvailble = res;
    }))
    this.subscription.push(this.common.localizationInfo$.subscribe((res1)=>{
      this.localizationData = []
      this.localizationData = res1;
    }));

    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.dataService._dataChange.subscribe(
      data => (this.nestedDataSource.data = data)
    );
    this.common.setUserConfig(this.userDetails.ProfileType, 'CannedMessages');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))

    this.changeModuleDisplayName=this.common.changeModuleLabelName()

  
    this.common.hubControlEvent('canned-message','click','pageloadend','pageloadend','','ngOnInit');


  }



  // getLanguageStorage(){
  //   this.loader = true;
  //   this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))      
  //   console.log('this.LanguageStore all', this.userLanguageName)
  //   if(this.userLanguageName == null || this.userLanguageName == undefined)
  //   {
  //     this.getLanguage();
  //   }else{
  //     let chlen = this.userLanguageName.length
  //     this.userLanguageName.forEach(element => {
  //       if(element.ChannelName == 'Voice')
  //       {
  //         this.userLanguageName = true;
  //       }
        
  //       chlen--;
  //       if(chlen == 0)
  //       {
  //         this.loader =false        
  //       }
  
  //     })     
  //   }
   
  // }
  



  getLanguageStorage(){
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))      
    // console.log('this.LanguageStore all', this.userLanguageName)
    if(this.userLanguageName == null || this.userLanguageName == undefined)
    {
      this.getLanguage();
    }else{
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        if(element.ChannelName == 'Voice')
        {
          this.userLanguageName = true;
        }
        
        chlen--;
        if(chlen == 0)
        {
          this.loader =false        
        }
  
      })     
    }
   
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
    this.common.hubControlEvent('canned-message','click','','',JSON.stringify(this.requestObj),'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      // this.languageType = res.results['data']
      // if (res.code == 200) {
      //   this.language1 = res.results.data;
      // }

      if(res.code == 200){
        localStorage.setItem("userLanguageName",res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }

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
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('canned-message','click','','',JSON.stringify(this.requestObj),'getChannel');

    this.api.post('index', this.requestObj).subscribe((res: any) => {

      if(res.code == 200){
        localStorage.setItem("userChannelName",res.results.data[0][0].UserLanguage);
        this.getChannelStorage()
      }

      // this.channelType = res.results['data']
      
    })
  }


  getChannelStorage(){
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))      
    // console.log('this.userChannelName all', this.userChannelName)
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


  selectedLanguage(e) {
    this.common.hubControlEvent('canned-message','click','','',e,'selectedLanguage');

    this.language = e
  }

  selectedChannel(e) {
    this.common.hubControlEvent('canned-message','click','','',e,'selectedChannel');

    this.ChannelName = e
  }



  toggleShow(){
  //   if(this.ChannelName =='WhatsApp' &&   this.language == 'English')
  // {
  //   this.IsChildAvail = true;
  //    this.gettreeListData();
  //   }
  //   else{
  //     this.IsChildAvail = false;
  //   }
  }






  /////////////////////////////////


  name: string;
  description: string;
  KeyNum: string;
  MessageName: string;






  openDialogAddNode(): void {
    const dialogRef = this.dialog.open(NewNodeDialog, {
     // height: '200px',
      
      data: {nodeName: this.name, nodeDescription: this.description, Component: 'Add',nodeKeyNum: this.KeyNum,
      nodeMessageName:  this.MessageName},
      width: '800px',
      // disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const node: TreeData = {
          Id: null,
          Name: result.nodeName,
          Description: result.nodeDescription,
          Children: [],
          KeyNum: result.nodeKeyNum,
          MessageName:  result.nodeMessageName
        };
// if(node.KeyNum == undefined && node.Name == undefined){
//   return;

// }

          let obj =    {
            data: {
              spname: "usp_unfyd_canned_responses",
              parameters: {
                flag: 'INSERT',
                CREATEDBY: this.userDetails.Id,
                PROCESSID: 1,
                PARENTID : 0,
                MESSAGE :node.Name,
                LANGUAGECODE : this.language,
                SHORTCODE :node.KeyNum,
                MESSAGENAME :node.MessageName,
                CHANNELCATEGORY: this.ChannelName
              }
            }
          }
          this.common.hubControlEvent('canned-message','click','','','','openDialogAddNode');

          this.api.post('index', obj).subscribe((res: any) => {
            if(res.code==200){
              if(res.results.data[0].result=="Data added successfully")
              {
                this.common.snackbar("Record add")
              
            }
            else if ((res.results.data[0].result == "Data already exists")) {
              this.common.snackbar('Data Already Exist');
              return
            }
          }
            this.gettreeListData();
          })


      }
    });
  }















  ////////////////////////////////////////


  private _getChildren = (node: TreeData) => observableOf(node.Children);
  hasNestedChild = (_: number, nodeData: TreeData) => nodeData.Children.length > 0;

  refreshTreeData() {
    this.common.hubControlEvent('canned-message','click','','','','refreshTreeData');

    const data = this.nestedDataSource.data;
    this.nestedDataSource.data = null;
    this.nestedDataSource.data = data;
  }



  getChannelName(){
    var Obj1 = {
      data: {
        spname: "UNFYD_ADM_CHANNELMASTER",
        parameters: {
          flag: 'GETALLCHANNEL',

        }
      }
    }
    this.common.hubControlEvent('canned-message','click','','',JSON.stringify(Obj1),'getChannelName');

    this.api.post('index', Obj1).subscribe(res => {
      //this.loader = false;
      // this.reset = true;
      if (res.code == 200) {
        this.ChannelNameSelect = res.results.data;
        // this.filteredList2 = this.agents.slice();
      }
    })
  }






  addNode1(node: TreeData) {
if(this.nestedDataSource.data.length != 0){
    node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 1;
    this.nestedDataSource.data.push(node);
    this.refreshTreeData();
  }
  else{
//     node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 0;
    this.nestedDataSource.data.push(node);
    this.refreshTreeData();
  }
  }



  addNode(childrenNodeData) {
    childrenNodeData.currentNode.Children.push({Id: childrenNodeData.currentNode.Id,
      Name: childrenNodeData.node.Name,ParentId:childrenNodeData.currentNode.Id,Children:[],KeyNum:childrenNodeData.node.KeyNum,MessageName:childrenNodeData.node.MessageName});
   let obj =    {
        data: {
          spname: "usp_unfyd_canned_responses",
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.Id,
            PROCESSID: 1,
            PARENTID : 0,
            MESSAGE :childrenNodeData.node.Name,
            LANGUAGECODE : this.language,
            SHORTCODE :childrenNodeData.node.KeyNum,
            MESSAGENAME :childrenNodeData.node.MessageName,
            CHANNELCATEGORY: this.ChannelName
          }
        }
      }
      this.common.hubControlEvent('canned-message','click','','',JSON.stringify(childrenNodeData),'addNode');

      this.api.post('index', obj).subscribe((res: any) => {
        this.gettreeListData();
      })


      }










  addChildNode(childrenNodeData) {
    this.loader = true;

  // childrenNodeData.currentNode.Children.push({Id: childrenNodeData.currentNode.Id,
  //   Name: childrenNodeData.node.Name,ParentId:childrenNodeData.currentNode.Id,Children:[],KeyNum:childrenNodeData.node.KeyNum,MessageName:childrenNodeData.node.MessageName});
 let obj =    {
      data: {
        spname: "usp_unfyd_canned_responses",
        parameters: {
          flag: 'INSERT',
          CREATEDBY: this.userDetails.Id,
          PROCESSID: 1,
          PARENTID : childrenNodeData.currentNode.Id,
          MESSAGE :childrenNodeData.node.Name,
          LANGUAGECODE : this.language,
          SHORTCODE :childrenNodeData.node.KeyNum,
          MESSAGENAME :childrenNodeData.node.MessageName,
          CHANNELCATEGORY: this.ChannelName
        }
      }
    }
    this.common.hubControlEvent('canned-message','click','','',JSON.stringify(childrenNodeData),'addChildNode');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        if(res.results.data[0].result=="Data added successfully")
        {
          childrenNodeData.currentNode.Children.push({Id: childrenNodeData.currentNode.Id,
            Name: childrenNodeData.node.Name,ParentId:childrenNodeData.currentNode.Id,Children:[],KeyNum:childrenNodeData.node.KeyNum,MessageName:childrenNodeData.node.MessageName});
          this.common.snackbar("Record add")
        }else if ((res.results.data[0].result == "Data already exists")) {
          this.common.snackbar('Data Already Exist');
          this.loader = false;
          return
        }
        // this.common.snackbar(res.results.data[0].result, "success");
        this.gettreeListData();
      }
      this.loader = false;
    });



  }



  editNode(nodeToBeEdited) {
    this.loader = true;
    const fatherElement: TreeData = this.service.findFatherNode(nodeToBeEdited.currentNode.Id, this.nestedDataSource.data);
    let elementPosition: number;
    nodeToBeEdited.node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 1;
    if (fatherElement[0]) {
       fatherElement[0].Children[fatherElement[1]] = nodeToBeEdited.node;
   } else {
       elementPosition = this.service.findPosition(nodeToBeEdited.currentNode.Id, this.nestedDataSource.data);
       this.nestedDataSource.data[elementPosition] = nodeToBeEdited.node;
   }

   let obj =    {
    data: {
      spname: "usp_unfyd_canned_responses",
      parameters: {
        flag: 'UPDATE',
        MODIFIEDBY: this.userDetails.Id,
        ID: nodeToBeEdited.currentNode.Id,
        MESSAGE :nodeToBeEdited.node.Name,
        SHORTCODE :nodeToBeEdited.node.KeyNum,
        MESSAGENAME :nodeToBeEdited.node.MessageName,
        LANGUAGECODE : this.language,
        CHANNELCATEGORY: this.ChannelName
      }
    }
  }
  this.common.hubControlEvent('canned-message','click','','',JSON.stringify(nodeToBeEdited),'editNode');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        if(res.results.data[0].result=="Data updated successfully"){
          this.common.snackbar('Update Success')
        }
        // this.common.snackbar(res.results.data[0].result, "success");
        this.gettreeListData();    
        // Update Success    
      }
      this.loader = false;
    });

  }








///////////////////////////////////////////////////



  openDialog(): void {
    this.common.hubControlEvent('canned-message','click','','','','openDialog');

    const dialogRef = this.dialog.open(DialogComponent, {
    data: {
            type: 'abc',
            title: 'Are you sure?',
            subTitle: 'Do you want to ' + 'abc' + ' this data',
        },
        width: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // const node: TreeData = {
        //   Id: null,
        //   Name: result.nodeName,
        //   Description: result.nodeDescription,
        //   Children: this.currentNode.Children,
        //   KeyNum: result.nodeKeyNum,
        //   MessageName:  result.nodeMessageName
        // };
        // this.edittedNode.emit({currentNode: this.currentNode, node: node});
      }
    });
  }







deleteNode(nodeToBeDeleted: TreeData) {
  const deletedElement: TreeData = this.service.findFatherNode(nodeToBeDeleted.Id, this.nestedDataSource.data);
  let elementPosition: number;
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status) {
        if (deletedElement[0]) {
                deletedElement[0].Children.splice(deletedElement[1], 1);
              } else {
                elementPosition = this.service.findPosition(nodeToBeDeleted.Id, this.nestedDataSource.data);
                this.nestedDataSource.data.splice(elementPosition, 1);
            }


            let obj =    {
              data: {
                spname: "usp_unfyd_canned_responses",
                parameters: {
                  flag: 'DELETE',
                  ID: nodeToBeDeleted.Id,
                }
              }
            }
            this.common.hubControlEvent('canned-message','click','','',JSON.stringify(obj),'deleteNode');

            this.api.post('index', obj).subscribe((res: any) => {
              this.common.snackbar(res.results.data[0].result,"success");
              if(res.results.data[0].result=="Data deleted successfully"){
                this.common.snackbar('Delete Record')
              this.gettreeListData();

              }
              // Data deleted successfully
            })
      }
    
    
    
      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))



}

  gettreeListData(){
    this.loader = true;
    if(this.ChannelName == undefined || this.ChannelName == '')
    {
      this.addbutton = false
      this.loader = false;
      this.common.snackbar('CannedPleaseSelectCategory');
      return;
    }
    else if(this.language == undefined || this.language == '')
    {
      this.addbutton = false
      this.loader = false;
      this.common.snackbar('CannedPleaseSelectLanguage');
      return;
    }
    else{
      this.addbutton = true

let requestObj = {
  "data": {
      "spname": "usp_unfyd_canned_responses",
      "parameters": {
          "flag": "GET",
          "CHANNELCATEGORY" : this.ChannelName,
          "LANGUAGECODE":this.language
      }
  }
}
this.common.hubControlEvent('canned-message','click','','',JSON.stringify(requestObj),'gettreeListData');

this.api.post('index', requestObj).subscribe(res => {
  this.loader = false;
  if (res.code == 200) {
    this.loader = false;

   if(res.results.data.length == 0 )
   {
    this.IsChildAvail = false;
    this.gettreeList = [];
    return;
   }
   else{
    this.IsChildAvail = true;
   }


   this.gettreeList = res.results.data;
   var treeList =  JSON.parse(JSON.stringify(this.gettreeList))
   let result1 = treeList.map(item => {
  
    if(item.ParentId != null ){
      return  {Id:item.Id,Name:item.Name,ParentId : item.ParentId ,KeyNum : item.KeyNum, MessageName : item.MessageName, Children:[]}
    }else{
      return {Id:item.Id,Name:item.Name,KeyNum : item.KeyNum, MessageName : item.MessageName,Children:[]}
    }
   });
    var data : any = result1
   let tree = function (data, root) {
       var t = {};
       data.forEach(o => {
           Object.assign(t[o.Id] = t[o.Id] || {}, o);
           t[o.ParentId] = t[o.ParentId]   || {};
           t[o.ParentId].Children = t[o.ParentId].Children || [];
           t[o.ParentId].Children.push(t[o.Id]);
       });
       return t[root]?.Children;
   }(data, undefined);
   this.nestedDataSource.data = tree;
  }
}, (error) => { })

  }
}
  expandNode() {
    this.common.hubControlEvent('canned-message','click','','','','expandNode');

    this.nestedTreeControl.dataNodes = this.nestedDataSource.data;
    this.nestedTreeControl.expandAll()
  }
  collapseNode(){
    this.common.hubControlEvent('canned-message','click','','','','collapseNode');

    this.gettreeListData()
  }
  ///////////////////////// Mat tree lift click create delete add ////////////////////////////////////

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  openContextMenu(
    event: MouseEvent,
    trigger: MatMenuTrigger,
    triggerElement: HTMLElement
  ) {
    triggerElement.style.left = event.clientX + 5 + "px";
    triggerElement.style.top = event.clientY + 5 + "px";
    if (trigger.menuOpen) {
      trigger.closeMenu();
      trigger.openMenu();
    } else {
      trigger.openMenu();
    }
    event.preventDefault();
  }




}
