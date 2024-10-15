import { Component, OnInit } from '@angular/core';
import { SeatService } from './seat.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  seats: { number: number; status: string }[][] = []; // 2D array for seats

  constructor(private seatService: SeatService) {}

  ngOnInit(): void {
    this.seatService.getSeats().subscribe(data => {
      this.seats = data; // Initialize seats from service
    });
  }

  // Book seats based on user input
  bookSeats(seatCount: number): void {
    if (seatCount < 1 || seatCount > 7) {
      alert('You can only book between 1 and 7 seats at a time.'); // Alert for invalid input
      return;
    }

    const booked = this.seatService.bookSeats(seatCount);
    if (booked.length > 0) {
      alert(`Successfully booked seats: ${booked.join(', ')}`); // Show booked seats
    } else {
      alert('Not enough seats available.'); // Alert if no seats are available
    }
  }
}
