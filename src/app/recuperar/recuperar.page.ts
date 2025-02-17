import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  email: string = '';
  errorMessage: string = '';
  errorMessageVisible: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private alertController: AlertController 
  ) { }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  recuperar() {
    this.api.getUsuarios().subscribe((res) => {
      // Verificar si el usuario es válido
      const users: any[] = res as any[];
      const user = users.find((u) => u.correo === this.email);

      if (user) {
        // Redirigir a la página de login
        this.router.navigate(['/login']);
        this.showAlert('Se ha enviado un correo con las instrucciones para reestablecer la contraseña');

      } else {
        this.errorMessage = 'El correo no está registrado';
        this.errorMessageVisible = true;

        setTimeout(() => {
          this.errorMessageVisible = false;
        }, 3000);
      }
    },
      (error) => {
        console.error('Error al comprobar', error);
      });
  }
}
