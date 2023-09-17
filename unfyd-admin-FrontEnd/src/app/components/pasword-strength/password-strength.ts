import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'strength-checker',
  template: `
    <div class="password-strength">
        <ul>
          <div class="pass-strength-ttl">Your Password Must </div>
          <li *ngIf="passwordPolicyList.minMaxChar">
            <span><i [ngClass]="result[0]==true ? 'icon-fill-active' : 'icon-outline-activechat'"></i></span>
            <span class="li-subtext">Be {{min ?min :8}} to {{max ? max:15}} Characters long</span>
          </li>
          <li *ngIf="passwordPolicyList.oneUpperCase">
            <span><i [ngClass]="result[1]==true ? 'icon-fill-active' : 'icon-outline-activechat'"></i></span>
            <span class="li-subtext">Have at least one upper case letter</span>
          </li>
          <li *ngIf="passwordPolicyList.oneNumber">
            <span><i [ngClass]="result[2]==true ? 'icon-fill-active' : 'icon-outline-activechat'"></i></span>
            <span class="li-subtext">Have at least one Number</span>
          </li>
          <li *ngIf="passwordPolicyList.oneSpecialChar">
            <span><i [ngClass]="result[3]==true ? 'icon-fill-active' : 'icon-outline-activechat'"></i></span>
            <span class="li-subtext">Have at least one speacial Character</span>
          </li>
        </ul>

      </div>`,
  styles: [
    `
      .strengthBar {
        list-style: none;
        margin: 0;
        padding: 0;
        vertical-align: 2px;
      }
      
      .point:last-of-type {
        margin: 0 !important;
      }
      
      .point {
        background: #DDD;
        border-radius: 2px;
        display: inline-block;
        height: 5px;
        margin-right: 1px;
        width: 62px;
      }
      .password-strength {
	 border: 1px solid var(--theme_input_border);
	 background-color: var(--theme_bg_color);
	 border-radius: 15px;
	 margin: 20px 0;
	 padding: 15px 15px;
}
 .password-strength ul {
	 padding: 0;
	 margin: 0;
}
 .password-strength ul .pass-strength-ttl {
	 font-size: var(--subtitle);
	 color: var(--theme_title);
	 font-weight: 600;
}
 .password-strength ul li {
	 list-style-type: none;
}
                 
 .password-strength ul li span .icon-fill-active:before  {                   
  color:green !important;
                  
}
 .password-strength ul li .li-subtext {
	 font-size: var(--subtitle);
	 color: var(--theme_title);
	 padding-left: 8px;
}
 `,
  ],
})
export class StrengthCheckerComponent implements OnChanges, OnInit {
  @Input() public passwordToVerify: string;
  @Input() public passwordPolicy;
  @Input() public barLabel: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  result: any = []

  msg = '';

  passwordPolicyList = {
    minMaxChar: false,
    oneUpperCase: false,
    oneNumber: false,
    oneSpecialChar: false

  }
   max: number;
   min: number;
  passPolicy: any;
 


  ngOnInit() {

  }


  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];
  passowordPolicy;


    checkStrength(p) {
    const DIGIT_REGEX = /[0-9]/.test(p)
    const CHAR_LIMIT = between(p.length, this.min, this.max)
    const SYMBOL_REGEX = /[-+_!@#$%^&*,.?]/.test(p)
    const ONE_UPPERCASE = /[A-Z]/.test(p)

    function between(x, MIN_LIMIT, MAX_LIMIT) {
      return x >= MIN_LIMIT && x <= MAX_LIMIT;
    }
    const flags = [CHAR_LIMIT, ONE_UPPERCASE, DIGIT_REGEX, SYMBOL_REGEX];
    return flags;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToVerify.currentValue;
    const passwordPolicy = changes.passwordPolicy ? changes.passwordPolicy.currentValue :""
    if(passwordPolicy){
    this.passPolicy=passwordPolicy
    this.checkPasswordPolicy(this.passPolicy)
    }
    if (password) {
      this.result = this.checkStrength(password)
      let allTermsValid = allAreTrue(this.result)
      this.passwordStrength.emit(allTermsValid)

      function allAreTrue(arr) {
        return arr.every(element => element == true);
      }
    } else {
      this.msg = '';
    }
  }

  checkPasswordPolicy(passwordPolicy) {
    if (this.passwordPolicy.filter(e => e.ConfigKey === 'MinPasswordLength' && e.Status === true).length > 0) {
      let Min = this.passwordPolicy.filter(e => e.ConfigKey === 'MinPasswordLength')
      if (Min.length > 0) {
        this.min = +Min[0].value
        this.passwordPolicyList.minMaxChar=true
      }
    }
    if (this.passwordPolicy.filter(e => e.ConfigKey === 'MaxPasswordLength' && e.Status === true).length > 0) {
      let Max = this.passwordPolicy.filter(e => e.ConfigKey === 'MaxPasswordLength')
      if (Max.length >0) {
        this.max = +Max[0].value
        this.passwordPolicyList.minMaxChar=true
      }
    }
    if (this.passwordPolicy.filter(e => e.ConfigKey === 'AcceptOneSpclChar' && e.Status === true).length > 0) {
      this.passwordPolicyList.oneSpecialChar = true
    }
    if (this.passwordPolicy.filter(e => e.ConfigKey === 'AcceptOneSpclChar' && e.Status === true).length > 0) {
      this.passwordPolicyList.oneSpecialChar = true
    }
    if (this.passwordPolicy.filter(e => e.ConfigKey === 'AcceptOneUpperChar' && e.Status === true).length > 0) {
      this.passwordPolicyList.oneUpperCase = true
    }
  }

  private getColor(s) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else if (s <= 30) {
      idx = 2;
    } else if (s <= 40) {
      idx = 3;
    } else {
      idx = 4;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }
}
