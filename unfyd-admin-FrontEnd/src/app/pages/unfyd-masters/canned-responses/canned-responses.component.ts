import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { TreeFunctionService } from './service/tree-function.service';
// import { TreeDataService } from './service/tree-data.service';
// import { TreeData } from './service/tree-data.model';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import {of as observableOf} from 'rxjs';
import { TreeData } from 'src/app/global/treeService/tree-data.model';
import { TreeDataService } from 'src/app/global/treeService/tree-data.service';
import { TreeFunctionService } from 'src/app/global/treeService/tree-function.service';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-canned-responses',
  templateUrl: './canned-responses.component.html',
  styleUrls: ['./canned-responses.component.scss']
})
export class CannedResponsesComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;
  gettreeList : any = [] ;
  userDetails: any;

 
  constructor(
    private dataService: TreeDataService,
    private service: TreeFunctionService,
    private api: ApiService,
    private auth: AuthService,
  ) {
    this.userDetails = this.auth.getUser();
  }

  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.dataService._dataChange.subscribe(
      data => (this.nestedDataSource.data = data)
    );

    this.gettreeListData();

  }

  private _getChildren = (node: TreeData) => observableOf(node.Children);
  hasNestedChild = (_: number, nodeData: TreeData) => nodeData.Children.length > 0;

  refreshTreeData() {
    const data = this.nestedDataSource.data;
    this.nestedDataSource.data = null;
    this.nestedDataSource.data = data;
  }

  addNode(node: TreeData) {

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

  addChildNode(childrenNodeData) {
    // childrenNodeData.node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 1;
  //   childrenNodeData.currentNode.Id = this.service.findNodeMaxId(this.nestedDataSource.data);
  childrenNodeData.currentNode.Children.push({Id: childrenNodeData.currentNode.Id,
    Name: childrenNodeData.node.Name,ParentId:childrenNodeData.currentNode.Id,Children:[]});
 let obj =    {
      data: {
        spname: "usp_unfyd_canned_responses",
        parameters: {
          flag: 'INSERT',
          CREATEDBY: this.userDetails.Id,
          PROCESSID: this.userDetails.Processid,
          PARENTID : childrenNodeData.currentNode.Id,
          MESSAGE :childrenNodeData.node.Name,
          LANGUAGECODE : 'en'
        }
      }
    }
    this.api.post('index', obj).subscribe((res: any) => {
    })
//     this.gettreeListData();
    this.refreshTreeData();
  }



  editNode(nodeToBeEdited) {    
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
      }
    }
  }
  this.api.post('index', obj).subscribe((res: any) => {
  })
    this.refreshTreeData();
  }

  deleteNode(nodeToBeDeleted: TreeData) {
    const deletedElement: TreeData = this.service.findFatherNode(nodeToBeDeleted.Id, this.nestedDataSource.data);
    let elementPosition: number;
    if (window.confirm('Are you sure you want to delete ' + nodeToBeDeleted.Name + '?' )) {
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
      this.api.post('index', obj).subscribe((res: any) => {
      })


      this.refreshTreeData();
    }
  }
  gettreeListData(){



let requestObj = {
  "data": {
      "spname": "usp_unfyd_canned_responses",
      "parameters": {
          "flag": "GET"
      }
  }
}
this.api.post('index', requestObj).subscribe(res => {
  if (res.code == 200) {
   this.gettreeList = res.results.data;
   var treeList =  JSON.parse(JSON.stringify(this.gettreeList))
   let result1 = treeList.map(item => {
     if(item.ParentId != null ){
       return  {Id:item.Id,Name:item.Name,ParentId : item.ParentId , Children:[]}
     }else{
       return {Id:item.Id,Name:item.Name,Children:[]}
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
       return t[root].Children; 
   }(data, undefined);
   this.nestedDataSource.data = tree;
  //  this.nestedTreeControl.expandAll();
  }
}, (error) => { })
  }
  expandNode() {
    this.nestedTreeControl.dataNodes = this.nestedDataSource.data;
    this.nestedTreeControl.expandAll()
  }
  collapseNode(){
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
