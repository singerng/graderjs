import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from "@angular/http";

@Component({
  selector: 'problem',
  templateUrl: './problem.component.html'
})
export class ProblemComponent implements OnInit {
  problem: any;

  constructor(private router: Router, private route: ActivatedRoute, private http: Http) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.http.get("/api/problems/" + id).subscribe(res => {
        this.problem = res.json();
      })
    });
  }
}