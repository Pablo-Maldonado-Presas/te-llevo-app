import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


import { ApiService } from '../service/api.service';

import { Geolocation } from '@capacitor/geolocation';

import { EmailComposer, EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userType: string = '';
  userCorreo: string = '';
  username: string = '';
  nombre: string = '';

  errorMessage: string = '';
  errorMessageVisible: boolean = false;

  userSede: string = '';
  userRut: string = '';
  userPatente: string = '';
  userMarca: string = '';
  userModelo: string = '';
  userColor: string = '';

  currentDate: string = new Date().toISOString();
  horaSalida: string = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  capacidadPasajeros: number = 0;
  precioPorPersona: number = 0;
  correosPasajeros: string[] = [];
  viajeEnProgresoChofer: any = null;

  buscandoViaje: boolean = false;
  viajes: any[] = [];
  viajeEnProgresoPasajero: any = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService,
    private emailComposer: EmailComposer,
    private alertController: AlertController
  ) {
    this.currentDate = this.getFormattedCurrentDate();
  }

  getFormattedCurrentDate(): string {
    const now = new Date();
    return now.toISOString();
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras && navigation.extras.state) {
      const state = navigation.extras.state;

      if (state && state["username"]) {
        this.username = state["username"];
        // Obtener el nombre de usuario a partir del correo electrónico
        this.nombre = this.extractUsername(this.username);
      }
    }

    // Obtener el tipo de usuario y correo almacenado en el localStorage
    this.userType = localStorage.getItem('userType') || '';
    this.userCorreo = localStorage.getItem('userCorreo') || '';

    // Obtener los datos del usuario chofer para llenar campos de generarViaje()
    if (this.userType == 'Chofer') {
      this.userSede = localStorage.getItem('userSede') || '';
      this.userRut = localStorage.getItem('userRut') || '';
      this.userPatente = localStorage.getItem('userPatente') || '';
      this.userMarca = localStorage.getItem('userMarca') || '';
      this.userModelo = localStorage.getItem('userModelo') || '';
      this.userColor = localStorage.getItem('userColor') || '';
    }

    this.obtenerViajeEnProgresoChofer(); // Llama a la función para obtener el viaje en progreso (chofer)

    this.obtenerViajeEnProgresoPasajero(); // Llama a la función para obtener el viaje en progreso (pasajero)

    this.printCurrentPosition(); // Llama a la función para obtener la geolocalización

  }


  /* Obtener coordenadas de geolocalización */
  async printCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);
    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
    }
  }

  /* VISTA GENERAL */
  // Para extraer el nombre de usuario
  extractUsername(email: string): string {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.slice(0, atIndex);
    }
    return email;
  }



  obtenerViajeEnProgresoChofer() {
    this.api.getViajes().subscribe((viajes) => {
      for (let viaje of viajes) {
        if (viaje.estadoViaje === 'Programado' && viaje.correoChofer === this.userCorreo) {
          this.viajeEnProgresoChofer = viaje;
          this.correosPasajeros = this.viajeEnProgresoChofer.correoPasajero.split(',');
          break;
        }
      }
      if (!this.viajeEnProgresoChofer) {
        this.viajeEnProgresoChofer = null;
      }
    });
  }

  obtenerViajeEnProgresoPasajero() {
    this.api.getViajes().subscribe((viajes) => {
      for (let viaje of viajes) {
        // Verificar si correoPasajero contiene this.userCorreo
        if (viaje.estadoViaje === 'Programado' && viaje.correoPasajero.includes(this.userCorreo)) {
          this.viajeEnProgresoPasajero = viaje;
          break;
        }
      }
      if (!this.viajeEnProgresoPasajero) {
        this.viajeEnProgresoPasajero = null;
      }
    });
  }

  //Mensaje de confirmación de viaje creado/seleccionado
  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  //Mensaje de confirmación para cerrar sesión
  cerrarSesionDialogo() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás seguro de que quieres cerrar la sesión?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cerrarSesion();
      }
    });
  }


  /* VISTA CHOFER */

  generarViaje() {
    // Validación de la capacidad de pasajeros
    if (this.capacidadPasajeros < 1 || this.capacidadPasajeros > 4) {
      this.errorMessage = 'La capacidad debe ser entre 1 y 4 pasajeros';
      this.errorMessageVisible = true;

      setTimeout(() => {
        this.errorMessageVisible = false;
      }, 3000);
      return;
    }

    // Validación del precio por persona
    if (this.precioPorPersona < 1000) {
      this.errorMessage = 'El precio por persona debe ser al menos 1000';
      this.errorMessageVisible = true;

      setTimeout(() => {
        this.errorMessageVisible = false;
      }, 3000);
      return;
    }

    const viaje = {
      sede: this.userSede,
      rut: this.userRut,
      horaSalida: this.horaSalida,
      capacidadPasajeros: this.capacidadPasajeros,
      precioPorPersona: this.precioPorPersona,
      estadoViaje: 'Programado',

      patenteVehiculo: this.userPatente,
      marcaVehiculo: this.userMarca,
      modeloVehiculo: this.userModelo,
      colorVehiculo: this.userColor,
      correoChofer: this.userCorreo,
    };

    // Realizar una solicitud POST para crear el viaje
    this.api.createViaje(viaje).subscribe((success) => {
      console.log(success);
      this.obtenerViajeEnProgresoChofer(); // Obtener el viaje en progreso después de crear un viaje
      this.showAlert('El viaje se ha programado exitosamente');
      this.router.navigate(['/home']);
    },
      (error) => {
        console.log(error);
      }
    );
  }



  //Mensaje de confirmación para finalizar viaje (chofer)
  finalizarChoferDialogo() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Finalizar el viaje?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finalizarViajeChofer();
      }
    });
  }

  finalizarViajeChofer() {
    if (this.viajeEnProgresoChofer) {
      this.viajeEnProgresoChofer.estadoViaje = 'Finalizado';
      this.api.updateViaje(this.viajeEnProgresoChofer).subscribe((success) => {
        console.log(success);
        this.viajeEnProgresoChofer = null; // Aquí se establece que no hay un viaje en progreso
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(error);
      });
    }
  }

  //Mensaje de confirmación para cancelar viaje (chofer)
  cancelarChoferDialogo() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás seguro de que quieres cancelar el viaje',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelarViajeChofer();
      }
    });
  }

  cancelarViajeChofer() {
    this.api.deleteViaje(this.viajeEnProgresoChofer._id).subscribe((success) => {
      console.log(success);
      this.viajeEnProgresoChofer = null;
      this.router.navigate(['/home']);
    },
      (error) => {
        console.log(error);
      });
  }



  /* VISTA PASAJERO */

  buscarViaje() {
    this.buscandoViaje = true;

    setTimeout(() => {
      this.api.getViajes().subscribe((res: any[]) => {
        console.log(res[0]);
        this.viajes = res;

        // Simular un tiempo de espera de 4 segundos antes de desactivar buscandoViaje
        this.buscandoViaje = false;

      },
        (error) => {
          console.log(error);
          this.buscandoViaje = false;
        }
      );
    }, 4000);
  }

  contarPasajeros(correoPasajero: string): number {
    if (!correoPasajero || correoPasajero === '') {
      return 0;
    } else {
      return correoPasajero.split(',').length - 1;
    }
  }


  async seleccionarViaje(viaje: any) {
    try {
      const currentViaje = await this.api.getViaje(viaje._id).toPromise();
  
      let correosPasajero = [];
      if (currentViaje.correoPasajero !== null && currentViaje.correoPasajero !== undefined) {
        correosPasajero = currentViaje.correoPasajero.split(',');
      }
      correosPasajero.push(this.userCorreo);
  
      currentViaje.correoPasajero = correosPasajero.join(',');
  
      const response = await this.api.updateViaje(currentViaje).toPromise();
    } catch (error) {
      console.error('Error al seleccionar el viaje', error);
    }

    const commonInfo = `
      Sede: ${viaje.sede}
      Hora de salida: ${viaje.horaSalida}
      Vehículo: ${viaje.marcaVehiculo} ${viaje.modeloVehiculo} (${viaje.colorVehiculo})
      Patente: ${viaje.patenteVehiculo}
      Precio por persona: $${viaje.precioPorPersona}
    `;

    const mensajePasajero = `
    Estimado ${this.nombre},

    ¡Has seleccionado un viaje! Aquí están los detalles:

    ${commonInfo}

    Gracias por elegir TeLlevoAPP. ¡Esperamos que tengas un gran viaje!
  `;

    const mensajeChofer = `
    Hola ${viaje.correoChofer},

    ${this.nombre} ha seleccionado tu viaje. Aquí están los detalles:

    ${commonInfo}

    ¡Prepárate para un nuevo pasajero!

    Atentamente,
    TeLlevoAPP
  `;

    const correo_pasajero: EmailComposerOptions = {
      to: viaje.correoPasajero,
      subject: 'Confirmación de viaje',
      body: mensajePasajero,
    };

    const correo_chofer: EmailComposerOptions = {
      to: viaje.correoChofer,
      subject: 'Nuevo Pasajero',
      body: mensajeChofer,
    };

    try {
      await this.emailComposer.open(correo_pasajero);
      console.log('Email a pasajero enviado exitosamente');
    } catch (error) {
      console.error('Error enviando email a pasajero', error);
    }

    try {
      await this.emailComposer.open(correo_chofer);
      console.log('Email a chofer enviado exitosamente');
    } catch (error) {
      console.error('Error enviando email a chofer', error);
    }

    this.obtenerViajeEnProgresoPasajero(); // Obtener el viaje en progreso después de seleccionar viaje}
    this.showAlert('El viaje se ha seleccionado exitosamente');
    this.router.navigate(['/home']);
  }


  //Mensaje de confirmación para cancelar viaje (chofer)
  cancelarPasajeroDialogo(viaje: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Estás seguro de que quieres cancelar el viaje',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelarViajePasajero(viaje);
      }
    });
  }


  cancelarViajePasajero(viaje: any) {
    let correosPasajero = viaje.correoPasajero.split(',');
  
    // Eliminar el correo del pasajero
    const index = correosPasajero.indexOf(this.userCorreo);
    if (index > -1) {
      correosPasajero.splice(index, 1);
    }
  
    // Convertir el array de nuevo en una cadena
    viaje.correoPasajero = correosPasajero.join(',');
  
    this.api.updateViaje(viaje).toPromise()
      .then(response => {
        console.log(response);
        this.viajeEnProgresoPasajero = null; // Aquí se establece que no hay un viaje en progreso
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Error al cancelar el viaje', error);
      });
  }


  cerrarSesion() {
    // Elimina la bandera que indica que la sesión está abierta
    localStorage.removeItem('ingresado');

    // Eliminación localStorage de tipo de usuario, correo y, si es chofer, de rut y patente
    localStorage.removeItem('userType');
    localStorage.removeItem('userCorreo');

    if (this.userType === 'Chofer') {
      localStorage.removeItem('userRut');
      localStorage.removeItem('userPatente');
    }

    // Borra la lista de viajes en la interfaz de usuario
    this.viajes = [];

    // Redirige al usuario a la página de inicio de sesión (login)
    this.router.navigate(['/login']);
  }
}
