import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderUIComponent } from './builder-ui.component';

describe('BuilderUIComponent', () => {
  let component: BuilderUIComponent;
  let fixture: ComponentFixture<BuilderUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
