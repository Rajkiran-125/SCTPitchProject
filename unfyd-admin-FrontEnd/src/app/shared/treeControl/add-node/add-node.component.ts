import { TreeData, DialogData } from 'src/app/global/treeService/tree-data.model';
import { Component, Inject, Output, EventEmitter, Input, ViewChild, NgModule } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { I } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.scss']
})
export class AddNodeComponent {
  @Input() isTop: boolean;
  @Input() currentNode: TreeData;
  @Output() addedNode = new EventEmitter;
  name: string;
  description: string;
  KeyNum: string;
  MessageName: string;
  userDetails: any;

  // testerror:boolean=false;

  constructor(public dialog: MatDialog, private api: ApiService, private auth: AuthService,) { this.userDetails = this.auth.getUser(); }



  openDialog(): void {
    const dialogRef = this.dialog.open(NewNodeDialog, {
      // height: '200px',
      width: '800px',
      data: {
        nodeName: this.name, nodeDescription: this.description, Component: 'Add', nodeKeyNum: this.KeyNum,
        nodeMessageName: this.MessageName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const node: TreeData = {
          Id: null,
          Name: result.nodeName,
          Description: result.nodeDescription,
          Children: [],
          KeyNum: result.nodeKeyNum,
          MessageName: result.nodeMessageName
        };
        if (this.isTop) {


          let obj = {
            data: {
              spname: "usp_unfyd_canned_responses",
              parameters: {
                flag: 'INSERT',
                CREATEDBY: this.userDetails.Id,
                PROCESSID: 1,
                PARENTID: 0,
                MESSAGE: node.Name,
                LANGUAGECODE: 'en',
                SHORTCODE: node.KeyNum,
                MESSAGENAME: node.MessageName
              }
            }
          }
          // (obj);
          this.api.post('index', obj).subscribe((res: any) => {
          })

        } else {
          this.addedNode.emit({ currentNode: this.currentNode, node: node });
        }
      }
    });
  }
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [AddNodeComponent],
  declarations: [AddNodeComponent],
  providers: [],
})

export class AddNodeModule {
}





@Component({
  selector: 'app-new-node',
  templateUrl: '../node-dialog/node-dialog.html',
  styleUrls: ['./add-node.component.scss']
})
export class NewNodeDialog {
  MessageHeaderRequired: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NewNodeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  whiteError(checkspace1) {
    let a = false
    if (checkspace1 !== undefined) {
      if (checkspace1 && checkspace1.length > 0) {
        if (checkspace1.trim('').length < 3) {
          a = true
        }
      }
    }
    return a;
  }

  testerror: boolean = false

  onAddClick(): void {
    let a = {
      nodeName: this.data.Name,
      nodeDescription: this.data.Description,
      nodeKeyNum: this.data.KeyNum
    }

    this.MessageHeaderRequired = true;

    var regexExp = new RegExp('[\{\}a-zA-Z0-9_]+.*$');
    if (!regexExp.test(this.data.Name) &&(this.data.KeyNum)) {
      return;

    }

    if (this.data.Name == undefined || this.data.Name == '') {
      return;
    }
    if (this.data.KeyNum == undefined || this.data.KeyNum.toString() == '') {
      return;
    }
    if (this.data.Name.trim().length == 0) {
      return;
    }
    if ((this.data.Name as string).indexOf(' ') === 0) {
      return;
    }
    if ((this.data.KeyNum.toString() as string).indexOf(' ') === 0) {
      return;
    }


    if (this.whiteError(this.data.KeyNum) || this.whiteError(this.data.Name)) {
      return

    }

    this.dialogRef.close(a);
  }

  //////////////////////////////////////////////////////////////

  // @ViewChild(MatMenuTrigger)
  // contextMenu: MatMenuTrigger;

  // contextMenuPosition = { x: '0px', y: '0px' };

  // onContextMenu(event: MouseEvent) {
  //   event.preventDefault();
  //   this.contextMenuPosition.x = event.clientX + 'px';
  //   this.contextMenuPosition.y = event.clientY + 'px';
  //   // this.contextMenu.menuData = { 'item': item };
  //   this.contextMenu.menu.focusFirstItem('mouse');
  //   this.contextMenu.openMenu();
  // }
}



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [NewNodeDialog],
  declarations: [NewNodeDialog],
  providers: [],
})

export class AddNodeDialogModule {
}
