import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
  rows = 11;
  seatsPerRow = 7;
  lastRowSeats = 3;
  totalSeats = 80;

  // Pre-booked seats
  private preBookedSeats: number[] = [3, 7, 15, 23, 31]; // Example pre-booked seats

  // Initialize the seat layout as a 2D array
  seats: { number: number, status: string }[][] = [];
  bookedSeats: number = 0; // Track total booked seats

  constructor() {
    this.initializeSeats();
  }

  // Initialize the seat layout with seat numbers and status
  initializeSeats(): void {
    let seatCounter = 1;
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.seatsPerRow; j++) {
        row.push({ number: seatCounter++, status: this.preBookedSeats.includes(seatCounter - 1) ? 'X' : 'O' });
      }
      this.seats.push(row);
    }

    // Add the last row with 3 seats
    let lastRow = [];
    for (let j = 0; j < this.lastRowSeats; j++) {
      lastRow.push({ number: seatCounter++, status: this.preBookedSeats.includes(seatCounter - 1) ? 'X' : 'O' });
    }
    this.seats.push(lastRow);
  }

  // Book seats based on the user's input (up to 7 seats at a time)
  bookSeats(seatCount: number): void {
    if (seatCount < 1 || seatCount > 7) {
      alert('You can only book between 1 and 7 seats at a time.');
      return;
    }

    let booked = this.findSeats(seatCount);
    if (booked.length > 0) {
      // Mark the seats as booked
      booked.forEach(seat => {
        const seatPosition = this.findSeatPosition(seat.number);
        if (seatPosition) {
          this.seats[seatPosition.row][seatPosition.col].status = 'X';
          this.bookedSeats++;
        }
      });

      alert(`Successfully booked seats: ${booked.map(seat => 'Seat ' + seat.number).join(', ')}`);
    } else {
      alert('Not enough seats available.');
    }
  }

  // Find the best seats to book (either in one row or nearby rows)
  findSeats(seatCount: number): { number: number, status: string }[] {
    // Try to find a row with enough consecutive available seats
    for (let row of this.seats) {
      let availableSeats = row.filter(seat => seat.status === 'O');
      if (availableSeats.length >= seatCount) {
        return availableSeats.slice(0, seatCount);
      }
    }

    // If not found, try to split the seats across multiple rows
    let bookedSeats = [];
    for (let row of this.seats) {
      for (let seat of row) {
        if (seat.status === 'O') {
          bookedSeats.push(seat);
          if (bookedSeats.length === seatCount) {
            return bookedSeats;
          }
        }
      }
    }

    return []; // Not enough seats available
  }

  // Find the position of a seat in the 2D array
  findSeatPosition(seatNumber: number): { row: number, col: number } | null {
    for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
      const seatIndex = this.seats[rowIndex].findIndex(seat => seat.number === seatNumber);
      if (seatIndex !== -1) {
        return { row: rowIndex, col: seatIndex };
      }
    }
    return null;
  }
}
