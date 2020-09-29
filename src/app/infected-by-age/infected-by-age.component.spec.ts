import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectedByAgeComponent } from './infected-by-age.component';

describe('InfectedByAgeComponent', () => {
  let component: InfectedByAgeComponent;
  let fixture: ComponentFixture<InfectedByAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectedByAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectedByAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
