import { TestBed } from '@angular/core/testing';

import { IngresadoGuard } from './ingresado.guard';

describe('IngresadoGuard', () => {
  let guard: IngresadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IngresadoGuard);
  });

  it('debería crear', () => {
    expect(guard).toBeTruthy();
  });
});
