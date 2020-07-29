import { Pipe, PipeTransform } from '@angular/core';
import { TH_ORDERSTATUS } from 'app/types/tvds-status';

@Pipe({
  name: 'thaiorderstatus'
})
export class ThaiorderstatusPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    let thaiStatus = TH_ORDERSTATUS[value];
    if (!thaiStatus) {
      thaiStatus = '';
    }
    return thaiStatus;
  }

}
