import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecuperarPage } from './recuperar.page';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

describe('RecuperarPage', () => {
  let component: RecuperarPage;
  let fixture: ComponentFixture<RecuperarPage>;
  let el: DebugElement;
  let apiService: ApiService;
  let router: Router;
  let alertController: AlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarPage],
      imports: [IonicModule.forRoot(), HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ApiService, useValue: { getUsuarios: jasmine.createSpy('getUsuarios').and.returnValue(of([{ correo: 'test@example.com' }])) } },
        { provide: AlertController, useValue: { create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: () => {} })) } },
        { provide: NavController, useValue: { navigateRoot: jasmine.createSpy('navigateRoot') } } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPage);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar al método recuperar cuando se hace clic en el botón', () => {
    let recuperarCalled = false;
    component.recuperar = () => {
      recuperarCalled = true;
    };
    el.query(By.css('ion-button')).triggerEventHandler('click', null);
    expect(recuperarCalled).toBe(true);
  });

  it('debe navegar a /login cuando se llama a recuperar y el usuario es válido', () => {
    let navigateCalled = false;
    router.navigate = () => {
      navigateCalled = true;
      return Promise.resolve(true);
    };
    component.email = 'test@example.com';
    component.recuperar();
    expect(navigateCalled).toBe(true);
  });
});