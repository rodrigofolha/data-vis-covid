import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectedAccumulatedComponent } from './infected-accumulated.component';

describe('InfectedAccumulatedComponent', () => {
  let component: InfectedAccumulatedComponent;
  let fixture: ComponentFixture<InfectedAccumulatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectedAccumulatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectedAccumulatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
