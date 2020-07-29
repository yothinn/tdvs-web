import { Component, OnInit } from '@angular/core';
import { JoborderService } from 'app/main/joborder/services/joborder.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-joborder-report',
  templateUrl: './joborder-report.component.html',
  styleUrls: ['./joborder-report.component.scss']
})
export class JoborderReportComponent implements OnInit {

  joborderId: any;
  joborderData: any;
  salesAmount = 0.0;

  // contactStatus = TH_CONTACTSTATUS;
  // orderStatus = TH_ORDERSTATUS;

  constructor(
    private joborder: JoborderService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
  }

  ngOnInit() {
    this.joborderId = this.route.snapshot.paramMap.get('id');
    if (this.joborderId) {
      this.joborderData = this.route.snapshot.data.items.data;

      // calculate sales amount
      this.salesAmount = this.calSalesAmount(this.joborderData.contactLists);
    }

    // console.log(this.joborderData);
  }

  /**
   * summary sales in contac list
   * @param {json array} : contact list
   * @returns {number}
   */
  calSalesAmount(contactLists: any[]): number {
    return contactLists.reduce((total, value) => {
        return value.sales ? (total + value.sales) : total;
    }, 0);
  }

  onDownloadXlsx(): void {
    this.joborder.downloadAsXLSX(this.joborderData, `${this.joborderData.docno}.xlsx`);
  }

  onDownloadPdf(): void {
    this.joborder.downloadAsPDF(this.joborderData, `${this.joborderData.docno}.pdf`);
  }
  

}
