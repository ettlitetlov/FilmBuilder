import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptBuilderComponent } from './script-builder.component';

describe('ScriptBuilderComponent', () => {
  let component: ScriptBuilderComponent;
  let fixture: ComponentFixture<ScriptBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
