import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-reason-modal',
  templateUrl: './reject-reason-modal.component.html',
  styleUrls: ['./reject-reason-modal.component.scss']
})
export class RejectReasonModalComponent implements OnInit {
  remark: any;

  constructor(
    public dialogRef: MatDialogRef<RejectReasonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.remark) {
      this.remark = this.data.remark;
    };
  }

  onOk() {
    this.dialogRef.close(this.remark);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
