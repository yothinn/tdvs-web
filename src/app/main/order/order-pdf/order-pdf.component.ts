import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import jsPDF from "jspdf";

@Component({
  selector: "app-order-pdf",
  templateUrl: "./order-pdf.component.html",
  styleUrls: ["./order-pdf.component.scss"],
})
export class OrderPdfComponent implements OnInit {
  @ViewChild("pdfTable") pdfTable: ElementRef;
  constructor() {}

  ngOnInit() {}

  downloadAsPDF() {
    const doc = new jsPDF();

    let a = doc.getFontList();
    // console.log(a);
    doc.setFont("THSarabun");
    doc.setFontType("normal");
    // doc.setFontType("bold");
    doc.setFontSize(18);

    doc.text(150, 15, `เลขที่ : yyyy-mm-xxxx`);

    doc.text(150, 25, `วันที่ : 14/07/2563`);

    doc.text(15, 35, "รถธรรมธุรกิจ : dsfsdfsdf");

    doc.rect(15, 40, 180, 10);

    doc.text(25, 47, "ลำดับที่");
    doc.text(55, 47, "รายละเอียด");
    let line = 57;
    for (let index = 0; index < 20; index++) {
      
      if (line >= 257) {
        doc.addPage();
        line = 15;
      }
      doc.text(25, line, `${index + 1}.`);
      doc.text(45, line, "คุณ กหกดหกด หกดหกดหกดหกด บ้านเลขที่ ");
      doc.text(45, line + 10, "บ้านเลขที่ ");
      line += 20;
    }

    // const specialElementHandlers = {
    //   "#editor": function (element, renderer) {
    //     return true;
    //   },
    // };

    // // const pdfTable = this.pdfTable.nativeElement;

    // doc.fromHTML("สวัสดี", 15, 15, {
    //   width: 190,
    //   elementHandlers: specialElementHandlers,
    // });

    // doc.text(15, 55, "สวัสดี ยินดีที่ได้รู้จักคุณ");

    // doc.rect(20, 20, 10, 10); // empty square

    // doc.rect(40, 20, 10, 10, "F"); // filled square

    // doc.setDrawColor(255, 0, 0);
    // doc.rect(60, 20, 10, 10); // empty red square

    // doc.setDrawColor(255, 0, 0);
    // doc.rect(80, 20, 10, 10, "FD"); // filled square with red borders

    // doc.setDrawColor(0);
    // doc.setFillColor(255, 0, 0);
    // doc.rect(100, 20, 10, 10, "F"); // filled red square

    // doc.setDrawColor(0);
    // doc.setFillColor(255, 0, 0);
    // doc.rect(120, 20, 10, 10, "FD"); // filled red square with black borders

    doc.save("tableToPdf.pdf");
  }
}
