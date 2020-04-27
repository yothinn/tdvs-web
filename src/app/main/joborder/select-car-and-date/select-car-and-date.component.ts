import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-select-car-and-date",
  templateUrl: "./select-car-and-date.component.html",
  styleUrls: ["./select-car-and-date.component.scss"],
})
export class SelectCarAndDateComponent implements OnInit {
  cars: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<SelectCarAndDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.data.cars.forEach((el) => {
      if (el.lisenceID && el.driverInfo && el.driverInfo.displayName) {
        let car = "(" + el.lisenceID + ") " + el.driverInfo.displayName;
        this.cars.push({
          lisenceID: el.lisenceID,
          driverInfo: el.driverInfo,
        });
      }
    });

    // console.log(this.cars);
    // console.log(this.data);
  }

  // selectionChange(ev) {
  //   console.log(ev.value);
  //   this.data.lisenceID = ev.value.lisenceID;
  //   this.data.driverInfo = ev.value.driverInfo;
  //   console.log(this.data);
  // }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}
