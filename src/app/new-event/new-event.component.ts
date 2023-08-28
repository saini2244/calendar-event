import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit {

  eventForm: any;
  eventData: any;

  constructor(private eventsService: EventsService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    private dialogRef: MatDialogRef<NewEventComponent>) {
    this.eventData = data;
  }

  ngOnInit(): void {
    const { event = {},
      newDate = "",
      index } = this.eventData || {};
    this.eventForm = this.fb.group({
      title: [event.value || "", [Validators.required]],
      date: [newDate, [Validators.required]]
    })
  }

  addEvent() {
    const { date, title } = this.eventForm.value;
    if (this.eventData) {
      this.eventsService.updateEvent(this.eventData.newDate, date, title, this.eventData.index);
    } else {
      this.eventsService.addEvent(date, title);
    }
    this.dialogRef.close();
  }

}
