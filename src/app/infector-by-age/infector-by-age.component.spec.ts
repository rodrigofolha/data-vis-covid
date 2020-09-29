import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectorByAgeComponent } from './infector-by-age.component';

describe('InfectorByAgeComponent', () => {
  let component: InfectorByAgeComponent;
  let fixture: ComponentFixture<InfectorByAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectorByAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectorByAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
