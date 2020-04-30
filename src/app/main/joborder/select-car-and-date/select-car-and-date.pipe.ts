import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "servicedatefilter",
  pure: false,
})
export class ServiceDateFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    // return items.filter(item => item.title.indexOf(filter.title) !== -1);
    // console.log(new Date(filter).getTime());
    return items.filter((item: any) => {
      // console.log(`${new Date(item.startDate).getTime()} <= ${new Date(filter).getTime()}`)
      return new Date(item.startDate).getTime() <= new Date(filter).getTime() 
      && (item.endDate ? new Date(item.endDate).getTime() : new Date('2120-12-31').getTime()) >= new Date(filter).getTime();
    });
  }
}
