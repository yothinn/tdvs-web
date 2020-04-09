import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-car-and-date',
  templateUrl: './car-and-date.component.html',
  styleUrls: ['./car-and-date.component.scss']
})
export class CarAndDateComponent implements OnInit {

  cars: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<CarAndDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.data.cars.forEach(el => {
      let car = '(' + el.lisenceID + ')' + ' '
        + el.ownerInfo.titleThai + el.ownerInfo.firstNameThai + '  ' + el.ownerInfo.lastNameThai
      this.cars.push({carNo: car});
    });

    // console.log(this.cars);
    // console.log(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    // console.log(this.data)
    this.dialogRef.close(this.data);
  }

}
