import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, Inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/global/material.module';
import { TreeData, DialogData } from 'src/app/global/treeService/tree-data.model';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.scss']
})
export class EditNodeComponent {

  @Input() isTop: boolean
  @Input() currentNode: TreeData;
  @Output() edittedNode = new EventEmitter;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditNodeDialog, {
      width: '800px',
      data: {
        Name: this.currentNode.Name, Description: this.currentNode.Description, Component: 'Update', KeyNum: this.currentNode.KeyNum,
        MessageName: this.currentNode.MessageName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const node: TreeData = {
          Id: null,
          Name: result.nodeName,
          Description: result.nodeDescription,
          Children: this.currentNode.Children,
          KeyNum: result.nodeKeyNum,
          MessageName: result.nodeMessageName
        };
        this.edittedNode.emit({ currentNode: this.currentNode, node: node });
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
  exports: [EditNodeComponent],
  declarations: [EditNodeComponent],
  providers: [],
})

export class EditNodeModule {
}

@Component({
  selector: 'app-edit-node-dialog',
  templateUrl: '../node-dialog/node-dialog.html',
  styleUrls: ['./edit-node.component.scss']
})

export class EditNodeDialog {
  MessageHeaderRequired: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditNodeDialog>,
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

  onAddClick(): void {
    let a = {
      nodeName: this.data.Name,
      nodeDescription: this.data.Description,
      nodeKeyNum: this.data.KeyNum
    }

    
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

    if (this.whiteError(this.data.KeyNum) || this.whiteError(this.data.Name)) {
      return

    }
    this.dialogRef.close(a);
  }



}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [EditNodeDialog],
  declarations: [EditNodeDialog],
  providers: [],
})

export class EditNodeDialogModule {
}
