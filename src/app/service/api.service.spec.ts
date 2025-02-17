import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ApiService] 
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear', () => {
    expect(service).toBeTruthy();
  });


  it('debería obtener usuarios', () => {
    const dummyUsers = [
      { login: 'John' },
      { login: 'Doe' }
    ];

    service.getUsuarios().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(service.apiURL + '/lista_usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });



  it('debería obtener viajes', () => {
    const dummyViajes = [
      { id: '1', nombre: 'Viaje 1' },
      { id: '2', nombre: 'Viaje 2' }
    ];
  
    service.getViajes().subscribe(viajes => {
      expect(viajes.length).toBe(2);
      expect(viajes).toEqual(dummyViajes);
    });
  
    const req = httpMock.expectOne(service.apiURL + '/lista_viajes');
    expect(req.request.method).toBe('GET');
    req.flush(dummyViajes);
  });
  
  it('debería crear un viaje', () => {
    const dummyViaje = { id: '1', nombre: 'Viaje 1' };
  
    service.createViaje(dummyViaje).subscribe(viaje => {
      expect(viaje).toEqual(dummyViaje);
    });
  
    const req = httpMock.expectOne(service.apiURL + '/lista_viajes');
    expect(req.request.method).toBe('POST');
    req.flush(dummyViaje);
  });
  
  it('debería actualizar un viaje', () => {
    const dummyViaje = { _id: '1', nombre: 'Viaje 1' };
  
    service.updateViaje(dummyViaje).subscribe(viaje => {
      expect(viaje).toEqual(dummyViaje);
    });
  
    const req = httpMock.expectOne(service.apiURL + '/lista_viajes/' + dummyViaje._id);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyViaje);
  });
  
  it('debería eliminar un viaje', () => {
    const dummyId = '1';
  
    service.deleteViaje(dummyId).subscribe(res => {
      expect(res).toEqual({ status: 'success' });
    });
  
    const req = httpMock.expectOne(service.apiURL + '/lista_viajes/' + dummyId);
    expect(req.request.method).toBe('DELETE');
    req.flush({ status: 'success' });
  });

});