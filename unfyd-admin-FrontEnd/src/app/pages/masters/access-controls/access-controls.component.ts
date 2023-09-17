import { Component, OnInit,ViewChild } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

interface TreeNode {
  Label:string;
  MenuKey:string;
  children?: TreeNode[];
  ChildControls?:any;
}

const TREE_DATA: TreeNode[] = [
  {
    "Label":"Interaction",
    "MenuKey":"Interaction",
    "ChildControls":[
      {
        "Label":"Active",
        "Key":"",
        "ControlType":"",
        "AdminConfigKey":"",
        "Values":"Yes,No,Other",
        "ChildControls":[
        {
          "Label":"A",
          "Key":"",
		      "ControlType":"",
		      "AdminConfigKey":"",
		      "Values":"Yes,No,Other",
          "ChildControls":[]
        },
        {
          "Label":"B",
          "Key":"",
		      "ControlType":"",
		      "AdminConfigKey":"",
		      "Values":"Yes,No,Other",
          "ChildControls":[]
        }]
      },
      {
        "Label":"Missed",
        "Key":"",
	      "ControlType":"Textbox",
	      "AdminConfigKey":"",
	      "Values":"Yes,No,Other",
        "ChildControls":[]
      }
      ]
  }
];

@Component({
  selector: 'app-access-controls',
  templateUrl: './access-controls.component.html',
  styleUrls: ['./access-controls.component.scss']
})
export class AccessControlsComponent implements OnInit {
  innerHTML:string;
  controlHTML:string;
  treeControl = new NestedTreeControl<TreeNode>(node => node.ChildControls);
  dataSource = new MatTreeNestedDataSource<TreeNode>();


  constructor(
    public dialog: MatDialog
  ) {
    this.dataSource.data = TREE_DATA;
   }

  ngOnInit(): void {
  }
  hasChild = (_: number, node: TreeNode) => !!node.ChildControls && node.ChildControls.length > 0;

  getHTMLControl(node){
   
    switch(node.ControlType) { 
      case node.ControlType == 'Textbox': { 
        this.innerHTML = '<input autocomplete="off" type="text" style="margin-right: 10px;margin-top: -3px;border: 1px solid #ccc;border-radius: 5px; max-width:50px;" matInput />'; 
        break; 
      } 
      case node.ControlType == 'Toggle': { 
        this.innerHTML = '<mat-slide-toggle color="primary" class="toggleBtn" (change)="UpdateStatus(node.Id,$event)" checked={{node.Status}}>'; 
        break; 
      }
      case node.ControlType == 'Dropdown': { 
        
        break; 
      } 
      case node.ControlType == 'Number': { 
        
        break; 
      } 
      case node.ControlType == 'DatePicker': { 
       
        break; 
      } 
      case node.ControlType == 'TimeControl': { 
       
        break; 
      } 
      case node.ControlType == 'DateTime': { 
       
        break; 
      } 
      case node.ControlType == 'Multicheckbox': { 
        
        break; 
      } 
      default: { 
        this.innerHTML = '';
         break; 
      } 

      return this.innerHTML;
   } 
  }

  addChildNode(node) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'AccessControl',
        parentnode:node.Label
      },
      width: '552px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== false) {
        
      }
    });
  }

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
