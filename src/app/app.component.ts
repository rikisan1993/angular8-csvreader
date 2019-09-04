import { Component, ViewChild } from '@angular/core';
import { CSVRecord } from './models/CSVModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-csv-reader';

  public records: any[] = [];
  @ViewChild('csvReader', {static: false}) csvReader: any;

  uploadListener(event): void {
    console.log({event});

    let text = [];
    let files = event.srcElement.files;

    if(this.isValidCSVFiles(files[0])) {
      let input = event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = () => console.log('error occured when reading the file');
    } else {
      alert("Please import valid csv file");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for(let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if(currentRecord.length === headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.id = currentRecord[0].trim();
        csvRecord.firstName = currentRecord[1].trim();
        csvRecord.lastName = currentRecord[2].trim();
        csvRecord.age = currentRecord[3].trim();
        csvRecord.position = currentRecord[4].trim();
        csvRecord.mobile = currentRecord[5].trim();
        csvArr.push(csvRecord);
      }
    }

    return csvArr;
  }

  isValidCSVFiles(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArray: any) {
    let headers = (<string>csvRecordsArray[0]).split(',');
    let headerArray = [];
    for(let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }

    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }
}
