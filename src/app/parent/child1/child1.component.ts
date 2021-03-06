import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { passwordValidator } from './shared/password.validator';
import { FormService } from 'src/app/service/form.service';
import { GuardserviceService } from 'src/app/service/guardservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.css']
})
export class Child1Component implements OnInit {
  constructor(private formService: FormService, private AuthServices: GuardserviceService, private route: Router) { 
    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allskills.slice()));
  }
  public form = [];
  submited: boolean = false;

  ngOnInit(): void {
  }

  registrationForm = new FormGroup({
    userName: new FormControl('', ),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('',  [Validators.required]),
    confirmPassword: new FormControl('',),
   // skills: new FormArray([]),
    // ProfessionalExperience: new FormArray([]),
  })


  onSubmit() {

      this.submited = true;
    if (this.registrationForm.invalid) {
      console.log("regist failed");
      
      return ;
    }
    if (this.AuthServices.login(this.registrationForm.value)) {
    //  this.formService.addUsers(this.registrationForm.value);
      localStorage.setItem('loggeduser',JSON.stringify(this.registrationForm.value));
      this.route.navigateByUrl("/child2");

    } else { console.log("mdp incorrect"); }

  }
 


  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  filteredSkills: Observable<string[]>;
  skills: string[] = ['HTML'];
  allskills: string[] = ['CSS', 'nodejs', 'angular'];

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our skill
    if ((value || '').trim()) {
    (this.registrationForm.get('skills') as FormArray ).push(new FormControl( value ,[Validators.required] ));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.skillCtrl.setValue(null);
  }

  remove(index): void {
    (this.registrationForm.get('skills') as FormArray).removeAt(index);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    (this.registrationForm.get('skills') as FormArray).push(new FormControl(event.option.viewValue));
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allskills.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }
  // addProfessionalExperience() {
  //   (this.registrationForm.get('ProfessionalExperience') as FormArray).push(new FormControl('', Validators.required));
  // }
  

}
