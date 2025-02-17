# TeLlevoApp - Aplicación Móvil

**TeLlevoApp** es una aplicación móvil desarrollada en Ionic como parte del trabajo semestral de la asignatura **"Programación de Aplicaciones Móviles"** en la carrera de **Ingeniería en Informática** del Instituto Profesional Duoc UC.


Para el correcto funcionamiento de esta aplicación, es necesario descargar y seguir las instrucciones del repositorio **TestApi_Django**, indicado al final de este documento.

---

## Requisitos previos
### 1. Preparar el entorno
#### Instalar Node.js (entorno de ejecución)
- [Descargar Node.js](https://nodejs.org/en/download)

#### Modificar política de ejecución de scripts *(solo en Windows)*
Ejecutar en PowerShell como administrador:
```powershell
Set-ExecutionPolicy Unrestricted
```
#### Instalar Ionic (SDK para aplicaciones híbridas)
```cli
npm install -g @ionic/cli
```
#### Instalar Angular (framework utilizado por Ionic)
```cli
npm install -g @angular/cli
```

---

## Instalación de dependencias
### 2. Instalar librerías de Node.js
Ejecutar en el directorio del proyecto de Ionic:
```cli
npm install
```

#### Dependencias Capacitor para geolocalización (API Nativa)
```cli
npm install @capacitor/geolocation
npx cap sync
```

---

## Plugins adicionales
### 3. Instalar Cordova Email Plugin
```cli
npm install cordova-plugin-email-composer
npm install @awesome-cordova-plugins/email-composer @awesome-cordova-plugins/core
```

---

## Ejecución
### 4. Iniciar el backend (API y base de datos)
Para establecer conexión con la base de datos, sigue las instrucciones del siguiente repositorio:
[Repositorio TestApi_Django](https://github.com/Pablo-Maldonado-Presas/te-llevo-api)

### 5. Ejecutar la aplicación Ionic
Ejecutar en la carpeta del proyecto Ionic:
```cli
ionic serve
```

---

## Testing
### Instalaciones para pruebas End-to-End (E2E)
#### Instalar dependencias de Cypress
```cli
npm install cypress --save-dev
```

#### Iniciar configuraciones de Cypress
```cli
npx cypress open
```

#### Plugins de Webpack para Cypress
```cli
npm install --save-dev @cypress/webpack-preprocessor
npm install @badeball/cypress-cucumber-preprocessor
npm install --save-dev typescript ts-loader
```

### Ejecución de pruebas
#### Pruebas unitarias *(con la API en ejecución)*
```cli
ng test
```

#### Pruebas End-to-End con Cypress *(con la API y la aplicación en ejecución)*
```cli
npx cypress open
```