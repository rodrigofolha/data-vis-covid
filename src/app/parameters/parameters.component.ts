import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { GraphService } from '../graph.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {
  form: FormGroup;
  @Output() contactsAtHome: EventEmitter<number> = new EventEmitter<number>();
  @Output() contactsAtSchool: EventEmitter<number> = new EventEmitter<number>();
  @Output() contactsAtWork: EventEmitter<number> = new EventEmitter<number>();
  @Output() contactsAtTransport: EventEmitter<number> = new EventEmitter<number>();
  @Output() infectivityByAge: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() typeOfEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fb: FormBuilder,
    private graphService: GraphService) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    this.form = this.fb.group({
      contactsAtHome: new FormControl(''),
			contactsAtSchool: new FormControl(''),
			contactsAtWork: new FormControl(''),
      contactsAtTransport: new FormControl(''),
      infectivityByAge: new FormControl(''),
      typeOfEvent: new FormControl(''),
    });
  }
  search(parameters: any): void {
    Object.keys(parameters).forEach(key => parameters[key] === '' ? delete parameters[key]: key);
    this.groupFilters.emit(parameters);
  }

}
