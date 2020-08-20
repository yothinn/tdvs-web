import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { JoborderService } from "../services/joborder.service";

@Component({
  selector: "app-select-car-and-date",
  templateUrl: "./select-car-and-date.component.html",
  styleUrls: ["./select-car-and-date.component.scss"],
})
export class SelectCarAndDateComponent implements OnInit {
  cars: Array<any> = [];

  body: any = {};

  canCreateJob:boolean = true;
  constructor(
    private joborderService: JoborderService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectCarAndDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.data.cars.forEach((el) => {
      if (el.lisenceID && el.driverInfo && el.driverInfo.displayName) {
        this.cars.push({
          lisenceID: el.lisenceID,
          startDate: el.startDate,
          endDate: el.endDate,
          vehicleType: el.vehicleType,
          vehicleColor: el.vehicleColor,
          vehicleBrand: el.vehicleBrand,
          isOwner: el.isOwner,
          ownerInfo: el.ownerInfo,
          driverInfo: el.driverInfo,
        });
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    // console.log(this.data);
    // console.log(this.data.docdate.toString());
    this.dialogRef.close(this.data);
  }

  async checkValid() {
    if (this.data.docdate && this.data.carNo) {
      let body = {
        docdate: this.data.docdate,
        lisenceID: this.data.carNo.lisenceID,
      };
     
      let res: any = await this.joborderService.checkValidJobOrder(body);
      // console.log(res);
      if(res.data.length > 0){
        this.snackBar.open(`รถหมายเลขทะเบียน ${this.data.carNo.lisenceID} มีใบสั่งงานในวันนี้แล้ว...`, "", {
          duration: 2000,
        });
        this.canCreateJob=false;
      }else{
        this.canCreateJob=true;
      }
    }

  }
}
