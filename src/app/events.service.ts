import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  events = new Map();

  constructor() { }

  getEvents(date: string) {
    if (this.events.has(date)) {
      return this.events.get(date);
    }
    return [];
  }

  addEvent(date: string, title: string) {
    if (this.events.has(date)) {
      this.events.set(date, [...this.events.get(date), title]);
    } else {
      this.events.set(date, [title]);
    }
  }

  deleteEvent(date: string, index: number) {
    if (this.events.has(date)) {
      const events = this.events.get(date).filter((e: string, i: number) => i != index);
      this.events.set(date, events);
    }
  }

  updateEvent(oldDate: string, newDate: string, title: string, index: number) {
    const events = this.events.get(oldDate);
    if (newDate == oldDate) {
      events[index] = title;
      this.events.set(oldDate, events);
    } else {
      const events = this.events.get(newDate).filter((e: string, i: number) => i != index);
      this.events.set(newDate, events);
      this.addEvent(newDate, title);
    }
  }

}
