import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from "@angular/http";
import { FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'problem',
  templateUrl: './problem.component.html'
})
export class ProblemComponent implements OnInit {
  id: Number;
  problem: any;
  submissions: any;
  submitGroup: any;
  timerSubscription: Subscription;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: Http) {
    this.submitGroup = fb.group({
      code: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.http.get("/api/problems/" + this.id).subscribe(res => {
        this.problem = res.json();
        this.reloadSubmissions();
      });
    });
  }

  reloadSubmissions() {
    this.http.get("/api/problems/submissions/" + this.id).subscribe(res => {
      this.submissions = res.json();
    });
  }

  submit() {
    this.http.post("/api/problems/submit/" + this.id, {
      code: this.submitGroup.controls['code'].value
    }).subscribe(() => {
      this.timerSubscription = timer(0, 500).subscribe(() => {
        if (this.submissions && this.submissions.done) this.timerSubscription.unsubscribe();
        else this.reloadSubmissions();
      })
    });
  }
}