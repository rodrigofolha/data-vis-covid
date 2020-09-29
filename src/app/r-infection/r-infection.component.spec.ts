import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RInfectionComponent } from './r-infection.component';

describe('RInfectionComponent', () => {
  let component: RInfectionComponent;
  let fixture: ComponentFixture<RInfectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RInfectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RInfectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
