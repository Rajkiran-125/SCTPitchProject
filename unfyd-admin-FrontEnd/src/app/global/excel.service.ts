import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  jsonData: any;

  constructor(private datePipe: DatePipe) { }

  public exportExcel(json: any[], excelFileName: string): void {
    // console.log(excelFileName,"excelfilename")
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const myworkbook: XLSX.WorkBook = { Sheets: { [excelFileName]: myworksheet }, SheetNames: [excelFileName] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    // this.saveExcel(excelBuffer, excelFileName);
    this.saveExcelPitch(excelBuffer, excelFileName);
  }

  private saveExcel(buffer: any, fileName: string): void {
   
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + this.datePipe.transform(new Date(), 'd_M_yyyy_h_mm_a') + EXCEL_EXTENSION);
  }

  private saveExcelPitch(buffer: any, fileName: string): void {
   
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  public importExcel(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.jsonData = XLSX.utils.sheet_to_json(ws, {
        header: 0,
        defval: ""
      });
    };
  }

  getJson(): string | null {
    return this.jsonData
  }


}
