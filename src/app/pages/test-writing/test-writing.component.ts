import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-test-writing",
  templateUrl: "./test-writing.component.html",
  styleUrl: "./test-writing.component.scss",
})
export class TestWritingComponent implements OnInit {
  testData: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route?.data?.subscribe((data) => {
      this.testData = data;
    });
  }
}
