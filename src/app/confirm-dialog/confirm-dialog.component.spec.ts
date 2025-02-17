import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      imports: [IonicModule.forRoot(), MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: spy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
    fixture.detectChanges();
  }));

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería cerrar el diálogo con false al hacer clic en No', () => {
    const initialCallCount = dialogRefSpy.close.calls.count();
    component.onNoClick();
    expect(dialogRefSpy.close.calls.count()).toBeGreaterThan(initialCallCount);
  });

  it('debería cerrar el diálogo con true al hacer clic en Sí', () => {
    const initialCallCount = dialogRefSpy.close.calls.count();
    component.onYesClick();
    expect(dialogRefSpy.close.calls.count()).toBeGreaterThan(initialCallCount);
  });
});