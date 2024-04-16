import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TestTimeService {
  selectedTime: number = 5; // Default selected time

  constructor() {}
}
