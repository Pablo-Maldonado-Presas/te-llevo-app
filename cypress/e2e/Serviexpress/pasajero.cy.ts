describe('Pruebas E2E para pasajero TeLlevoAPP', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.wait(5000);
  });

  it('Ingreso de Usuario Pasajero', () => {
    cy.get('[data-cy=username-input]').type('pedro.gomez@duocuc.cl');
    cy.get('[data-cy=password-input]').type('pedrogomez');
    cy.contains('Ingresar').click();

    cy.url().should('include', '/home');
  });


  it('El pasajero selecciona un viaje', () => {
    cy.visit('/login');

    cy.get('[data-cy=username-input]').type('pedro.gomez@duocuc.cl');
    cy.get('[data-cy=password-input]').type('pedrogomez');
    cy.contains('Ingresar').click();

    cy.url().should('include', '/home');

    cy.get('.user-type', { timeout: 10000 }).should('have.text', 'Pasajero');

    cy.contains('Buscar viaje').click();


    cy.get('div:has(table)', { timeout: 10000 }).should('exist');


    cy.contains('Seleccionar').click();
    });

  });
