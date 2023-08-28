import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from './events.service';
import { NewEventComponent } from './new-event/new-event.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  todayDate: string = "";
  dateMap = new Map();
  currentMonth: number = -1;
  currentYear: number = -1;

  constructor(private dialog: MatDialog, private eventsService: EventsService) {

  }

  ngOnInit(): void {
    this.getTodayDate();
    this.createCalendar();
  }

  getTodayDate(date: Date = new Date()) {
    const months = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    this.currentYear = date.getFullYear();
    this.currentMonth = date.getMonth();
    this.todayDate = `${months[this.currentMonth]} ${this.currentYear}`;
  }

  goToMonth(month: number) {
    this.currentMonth = this.currentMonth + month;
    let date;
    date = new Date(this.currentYear, this.currentMonth, new Date().getDate());
    this.currentMonth = date.getMonth();
    if (this.currentMonth < 0 || this.currentMonth > 11) {
      this.currentYear = date.getFullYear();
    }
    this.getTodayDate(date)
    this.createCalendar();
  }

  createCalendar() {
    const dateMap = new Map();
    const firstDayofMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const lastDateofMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const lastDayofMonth = new Date(this.currentYear, this.currentMonth, lastDateofMonth).getDay();

    for (let i = firstDayofMonth; i > 0; i--) {
      dateMap.set('last_' + i, "");
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      dateMap.set(i, i);
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      dateMap.set('next_' + i, "");
    }

    this.dateMap = dateMap;
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  isTodayDate(date: any) {
    return date === new Date().getDate() && this.currentMonth === new Date().getMonth()
      && this.currentYear === new Date().getFullYear() ? "active" : "";
  }

  openEventChange() {
    this.dialog.open(NewEventComponent)
  }

  events(date: any) {
    const month = (this.currentMonth + 1).toString().padStart(2, "0");
    const day = date.toString().padStart(2, "0");
    return this.eventsService.events.get(`${this.currentYear}-${month}-${day}`);
  }

  deleteEvent(event: any, date: any, index: any) {
    const month = (this.currentMonth + 1).toString().padStart(2, "0");
    const day = date.toString().padStart(2, "0");
    const newDate = `${this.currentYear}-${month}-${day}`;
    const dialog = this.dialog.open(ConfirmDialogComponent);
    dialog.afterClosed().subscribe((res: boolean) => {
      if(res) {
        this.eventsService.deleteEvent(newDate, index);
      }
    })
  }

  editEvent(event: any, date: any, index: any) {
    const month = (this.currentMonth + 1).toString().padStart(2, "0");
    const day = date.toString().padStart(2, "0");
    const newDate = `${this.currentYear}-${month}-${day}`;

    const dialogRef = this.dialog.open(NewEventComponent,
      {
        data: {
          event,
          newDate,
          index
        }
      })
  }

  getEvents(date: any) {
    const month = (this.currentMonth + 1).toString().padStart(2, "0");
    const day = date.toString().padStart(2, "0");
    const newDate = `${this.currentYear}-${month}-${day}`;
    this.eventsService.getEvents(newDate);
  }

  drop(event: any, a: any) {
    console.log("jsbkdfsdk", event, a)
    // moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
