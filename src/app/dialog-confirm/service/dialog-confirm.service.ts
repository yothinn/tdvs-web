import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class DialogConfirmService {

  constructor(
    public dialog: MatDialog
  ) { }

  show(body): Promise<any> {
    return new Promise((resolve, reject) => {

      const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '400px',
        data: body,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });

    });
  }

}
