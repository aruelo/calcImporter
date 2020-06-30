import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResultadoComponent } from './dialog-resultado.component';

describe('DialogResultadoComponent', () => {
  let component: DialogResultadoComponent;
  let fixture: ComponentFixture<DialogResultadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogResultadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
