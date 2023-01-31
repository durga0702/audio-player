import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecorderPageComponent } from './recorder-page.component';

describe('RecorderPageComponent', () => {
  let component: RecorderPageComponent;
  let fixture: ComponentFixture<RecorderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecorderPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecorderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
