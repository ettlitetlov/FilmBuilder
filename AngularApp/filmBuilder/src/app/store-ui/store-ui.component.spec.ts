import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUIComponent } from './store-ui.component';

describe('StoreUIComponent', () => {
  let component: StoreUIComponent;
  let fixture: ComponentFixture<StoreUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
