import { Pipe, PipeTransform } from '@angular/core';
import { TH_CONTACTSTATUS } from 'app/types/tvds-status'

@Pipe({
  name: 'thaicontactstatus'
})
export class ThaicontactstatusPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    let thaiStatus = TH_CONTACTSTATUS[value];
    // console.log(thaiStatus);
    if (!thaiStatus){
      thaiStatus = '';  
    }
    return thaiStatus;
  }

}
