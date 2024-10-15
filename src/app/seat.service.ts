import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private seats: { number: number; status: string }[][] = [];
  
  constructor() {
    this.initializeSeats();
  }

  // Initialize the seat layout with seat numbers and status
  private initializeSeats(): void {
    let seatCounter = 1;
    for (let i = 0; i < 11; i++) {
      let row = [];
      for (let j = 0; j < 7; j++) {
        row.push({ number: seatCounter++, status: 'O' }); // 'O' indicates available
      }
      this.seats.push(row);
    }
    // Last row with 3 seats
    let lastRow = [];
    for (let j = 0; j < 3; j++) {
      lastRow.push({ number: seatCounter++, status: 'O' });
    }
    this.seats.push(lastRow);
    
    // Simulate already booked seats
    this.seats[2][2].status = 'X'; // Example: Seat 18 booked
    this.seats[5][0].status = 'X'; // Example: Seat 36 booked
  }

  // Get the current seats
  getSeats(): Observable<{ number: number; status: string }[][] {
    return of(this.seats); // Return the seat layout
  }

  // Book seats based on the user's request
  bookSeats(seatCount: number): string[] {
    let bookedSeats: string[] = [];
    
    // Try to find seats in one row first
    for (let row of this.seats) {
      let availableSeats = row.filter(seat => seat.status === 'O');
      if (availableSeats.length >= seatCount) {
        for (let i = 0; i < seatCount; i++) {
          const seat = availableSeats[i];
          seat.status = 'X'; // Mark as booked
          bookedSeats.push(`Seat ${seat.number}`);
        }
        return bookedSeats; // Return booked seat numbers
      }
    }

    // If not enough seats in one row, find nearby available seats
    let nearbySeats: { number: number; status: string }[] = [];
    for (let row of this.seats) {
      for (let seat of row) {
        if (seat.status === 'O') {
          nearbySeats.push(seat);
          if (nearbySeats.length === seatCount) {
            // Book these nearby seats
            for (let bookedSeat of nearbySeats) {
              bookedSeat.status = 'X'; // Mark as booked
              bookedSeats.push(`Seat ${bookedSeat.number}`);
            }
            return bookedSeats; // Return booked seat numbers
          }
        }
      }
    }

    return []; // Not enough seats available
  }
}
