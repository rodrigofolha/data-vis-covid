import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectedStackedLocalComponent } from './infected-stacked-local.component';

describe('InfectedStackedLocalComponent', () => {
  let component: InfectedStackedLocalComponent;
  let fixture: ComponentFixture<InfectedStackedLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectedStackedLocalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectedStackedLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
