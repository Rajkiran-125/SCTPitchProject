import { Component, OnInit ,ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

import { Router } from '@angular/router';

@Component({
  selector: 'app-hawker-training',
  templateUrl: './hawker-training.component.html',
  styleUrls: ['./hawker-training.component.scss']
})
export class HawkerTrainingComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;

  constructor(private router:Router) { 
    
  }

  ngOnInit(): void {
  }

  back(){
    this.router.navigateByUrl('beneficiary-home')
  }
}
