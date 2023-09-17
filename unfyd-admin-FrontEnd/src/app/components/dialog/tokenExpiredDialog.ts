import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  OnInit,
  Inject,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "token-expired-dialog",
  template: `<div class="profileInfo">
      <div class="content">
        <div class="align-center">
          <div class="notification">
            <!-- <mat-icon *ngIf="!data.data.data.icon" class="mat-icon notranslate material-icons mat-icon-no-color" style="font-size:30px!important;">delete</mat-icon> -->
            <img
              src="{{ data.data.data.icon }}"
              style="height: 60px;width: 60px;"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="alert-container align-center">
      <h2 matDialogTitle>
        <b>{{ data.data.data.msgHead }}</b>
      </h2>
      <h4 class="mb-4">{{ data.data.data.description }}</h4>
      <ng-container *ngIf="data.data.data.selectBtn == 'OK'">
        <div class="btn-group">
          <button
            class="mat-focus-indicator btn mat-flat-button mat-button-base mat-primary"
            mat-flat-button
            (click)="closeDialog()"
          >
            OK
          </button>
        </div>
      </ng-container>
    </div>`,
  styles: [
    `
      .profileInfo {
        align-items: center;
        .avatar {
          position: relative;
          flex: 0 0 93.8px;
          text-align: center;
          display: flex;
          justify-content: center;
          margin-bottom: 5px;
          .mat-icon,
          img {
            width: 96.07px;
            height: 96.07px;
            background-color: var(--gray_color_60);
            border: var(--border);
            border-radius: 5px;
          }
          .mat-icon {
            line-height: 96.07px;
            font-size: 50px !important;
            color: var(--gray_color);
            cursor: pointer;
          }
          img {
            object-fit: cover;
          }
          input[type="checkbox"] {
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
            outline: 0;
            border: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
          &.shake {
            .mat-icon {
              border-color: var(--error);
            }
          }
        }
        .content {
          flex: 1;
        }
      }
    `,
  ],
})
export class TokenExpiredDialogComponent {
  userDetails;
  constructor(
    public dialogRef: MatDialogRef<TokenExpiredDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  closeDialog() {
    this.dialogRef.close(true);
  }
}
