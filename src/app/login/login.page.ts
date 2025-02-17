import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  errorMessageVisible: boolean = false;


  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  
  login() {
    // Realizar una solicitud GET a la API de Django para validar el inicio de sesión
    this.api.getUsuarios().subscribe((res) => {
        // Verificar si el usuario y la contraseña son válidos
        const users: any[] = res as any[];
        const user = users.find((u) => u.correo === this.username && u.contrasennia === this.password);
        
        if (user) {
          // Inicio de sesión válido
          
          // Guardar el tipo de usuario (pasajero o chofer) y correo en el almacenamiento local
          localStorage.setItem('userType', user.categoria);
          localStorage.setItem('userCorreo', user.correo);

          // Guardar datos del usuario chofer para rellenar campos de generarViaje() en home
          if (user.categoria === 'Chofer') {
            localStorage.setItem('userSede', user.sede);
            localStorage.setItem('userRut', user.rut);
            localStorage.setItem('userPatente', user.patenteVehiculo);
            localStorage.setItem('userMarca', user.marcaVehiculo);
            localStorage.setItem('userModelo', user.modeloVehiculo);
            localStorage.setItem('userColor', user.colorVehiculo);
          }

          // Establecer estado de sesión como 'ingresado' hasta cerrar sesión (en home)
          localStorage.setItem('ingresado', 'true');
          
          // Crear un objeto NavigationExtras para pasar datos a la página de inicio
          const navigationExtras: NavigationExtras = {
            state: {
              username: this.username,
            },
          };

          this.password = '';
          
          // Redirigir a la página de inicio
          this.router.navigate(['/home'], navigationExtras);

        } else {
          // Inicio de sesión no válido, establecer el mensaje de error y mostrarlo
          this.errorMessage = 'Credenciales inválidas (usuario y/o contraseña)';
          this.errorMessageVisible = true;

          // Ocultar el mensaje de error después de 3 segundos
          setTimeout(() => {
            this.errorMessageVisible = false;
          }, 3000);
        }
      },
      (error) => {
        console.error('Error al ingresar', error);
      }
    );
  }

  limpiarCampos() {
    // Limpia los valores de los campos
    this.username = '';
    this.password = '';
  }
}