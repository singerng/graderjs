import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from "@angular/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'problem-edit',
  templateUrl: './problem.edit.component.html',
})
export class ProblemEditComponent implements OnInit {
  id: Number;
  problemForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: Http) {
    this.problemForm = fb.group({
      name: ['', Validators.required],
      text: ['', Validators.required],
      testCases: fb.array([
        this.newTestCaseFormGroup()
      ])
    });
  }

  newTestCaseFormGroup() {
    return this.fb.group({
      input: ['', Validators.required],
      output: ['', Validators.required]
    });
  }

  // Thanks https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
  addTestCase() {
    (<FormArray> this.problemForm.controls['testCases']).push(this.newTestCaseFormGroup());
  }

  removeTestCase(i) {
    (<FormArray> this.problemForm.controls['testCases']).removeAt(i);
  }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   if (params['id']) {
    //     this.id = +params['id'];
    //   }
    // });
  }

  submit() {
    const data = {
      name: this.problemForm.controls['name'].value,
      text: this.problemForm.controls['text'].value
    };

    let post;
    if (this.id) post = this.http.post("/api/problems/" + this.id, data);
    else post = this.http.post("/api/problems/", data);

    post.subscribe(res => this.router.navigateByUrl("/problems/" + res.json().id));
  }
}