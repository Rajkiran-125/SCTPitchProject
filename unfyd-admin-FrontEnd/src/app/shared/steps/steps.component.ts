import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {
  @Input() steps:any;
  @Input() id:any;
  @Input() action:any;
  @Input() uniqueid:any;
  @Input() tab:any;
  @Input() moduletype:any;
  @Input() Id: any;
  @Input() data: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  @Input() tabSelected: any ;
  @Output() newsteps = new EventEmitter<string>();
  checkUniqueid:boolean;

  constructor( public dialog: MatDialog) { }

  ngOnInit(): void {
    this.checkUniqueid = ((this.uniqueid != undefined || this.uniqueid != null) || (this.id != undefined || this.id != null)) ? true : false; 
  }
  
  addnewsteps(value: string) {
    this.newsteps.emit(value); }
  
  

}
