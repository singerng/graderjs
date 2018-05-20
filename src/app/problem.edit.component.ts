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
      output: ['', Validators.required],
      sample: [false]
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
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.http.get("/api/problems/" + this.id).subscribe(res => {
          const data = res.json();
          this.problemForm.controls['name'].setValue(data['name']);
          this.problemForm.controls['text'].setValue(data['text']);
          (<FormArray> this.problemForm.controls['testCases']).removeAt(0);
          for (let testCase of data['testCases']) {
            this.problemForm.controls['testCases']['controls'].push(this.fb.group({
              input: testCase['input'],
              output: testCase['output'],
              sample: testCase['sample']
            }));
          }
        });
      }
    });
  }

  submit() {
    const data = {
      name: this.problemForm.controls['name'].value,
      text: this.problemForm.controls['text'].value,
      testCases: []
    };

    for (let testCaseGroup of this.problemForm.controls['testCases']['controls']) {
      data.testCases.push({
        input: testCaseGroup.controls['input'].value,
        output: testCaseGroup.controls['output'].value,
        sample: testCaseGroup.controls['sample'].value
      });
    }

    console.log(data);

    let post;
    if (this.id) post = this.http.post("/api/problems/" + this.id, data);
    else post = this.http.post("/api/problems/", data);

    post.subscribe(res => this.router.navigateByUrl("/problems/" + res.json().id));
  }
}