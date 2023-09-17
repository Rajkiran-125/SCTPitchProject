import { TreeData } from 'src/app/global/treeService/tree-data.model';
import { Component, OnInit, Output, EventEmitter, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';

@Component({
  selector: 'app-delete-node',
  templateUrl: './delete-node.component.html',
  styleUrls: ['./delete-node.component.css']
})
export class DeleteNodeComponent {
  @Output() deletedNode = new EventEmitter;
  @Input() currentNode: TreeData;

  deleteNode() {
    this.deletedNode.emit(this.currentNode);
  }


  // ////////////////




  // openDialog(type, id) {
  //   const dialogRef = this.dialog.open(DialogComponent, {
  //       data: {
  //           type: type,
  //           title: 'Are you sure?',
  //           subTitle: 'Do you want to ' + type + ' this data',
  //       },
  //       width: '300px',
  //   });
  //   dialogRef.afterClosed().subscribe(status => {






  // openDialog(): void {
  //   const dialogRef = this.dialog.open(DialogComponent, {
  //   data: {
  //           type: type,
  //           title: 'Are you sure?',
  //           subTitle: 'Do you want to ' + type + ' this data',
  //       },
  //       width: '300px',
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       const node: TreeData = {
  //         Id: null,
  //         Name: result.nodeName,
  //         Description: result.nodeDescription,
  //         Children: this.currentNode.Children,
  //         KeyNum: result.nodeKeyNum,
  //         MessageName:  result.nodeMessageName
  //       };
  //       this.edittedNode.emit({currentNode: this.currentNode, node: node});
  //     }
  //   });
  // }






  /////////////

}



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [DeleteNodeComponent],
  declarations: [DeleteNodeComponent],
  providers: [],
})

export class DeleteNodeModule {
}
