import { Component, OnInit } from "@angular/core";
import { Router, Navigation } from "@angular/router";

@Component({
  selector: "app-test-writing",
  templateUrl: "./test-writing.component.html",
  styleUrls: ["./test-writing.component.scss"],
})
export class TestWritingComponent implements OnInit {
  data: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      // Use type assertion to inform TypeScript about the structure of 'extras.state'
      this.data = navigation.extras.state["data"];
    } else {
      console.error("No data available in navigation state.");
    }
  }
}
