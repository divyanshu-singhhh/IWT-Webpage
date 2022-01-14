import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bank-holidays',
  templateUrl: './bank-holidays.component.html',
  styleUrls: ['./bank-holidays.component.css'],
})
export class BankHolidaysComponent implements OnInit {
  holidaysList;
  filteredHolidays:any = [];
  holidayListFetched = false;
  onGoingRequest;
  selected:any;

  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last Week': [
      moment().subtract(1, 'week').startOf('week'),
      moment().subtract(1, 'week').endOf('week'),
    ],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
  };

  constructor(private http: HttpClient,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  async getHolidays() {

    try {
      if (!this.holidayListFetched) {
        this.onGoingRequest = true;
        this.holidaysList = await this.http.get('/api/holidays').toPromise();
        this.holidayListFetched = true;
        this.onGoingRequest = false;
      }
    } catch (e) {
      console.log(e);
      this.onGoingRequest = false;
      this._snackBar.open(`Something Went Wrong`, 'close' , {duration: 2000});
    }

    let startDate = new Date(this.selected.startDate).getTime();
    let endDate = new Date(this.selected.endDate).getTime();
    this.filteredHolidays = [];

    Object.keys(this.holidaysList).forEach((key) => {

      let divisionHolidays = this.holidaysList[key].events.filter((event) => {
          let eventDate = new Date(event.date).getTime();
          return eventDate >= startDate && eventDate <= endDate
      });

      let holidaysForDivision = {
        division: this.holidaysList[key].division.toUpperCase(),
        events : divisionHolidays
      };

      this.filteredHolidays.push(holidaysForDivision);

    });
  }
}
