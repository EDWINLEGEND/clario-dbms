// cypress/support/auth-commands.js

// Custom login command that properly sets up authentication state
Cypress.Commands.add('loginWithToken', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdC11c2VyQGplc3QtdGVzdHMuY29tIiwibHQiOm51bGwsImlhdCI6MTc1ODg2ODk3NSwiZXhwIjoxNzU4ODY5ODc1fQ.EaMUqah03W-3ZIlxdxSY43Kgl_9x-B14G0bArs8U7MA';
  
  const userData = {
    id: "1",
    email: "test-user@jest-tests.com",
    name: "Test User",
    learningTypeId: null
  };

  // Visit the page with auth data pre-loaded
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('accessToken', token);
      win.localStorage.setItem('user', JSON.stringify(userData));
    },
  });
  
  // Wait for auth context to initialize
  cy.wait(1000);
});

// Command to check if user is authenticated
Cypress.Commands.add('shouldBeAuthenticated', () => {
  cy.window().its('localStorage').invoke('getItem', 'accessToken').should('exist');
  cy.window().its('localStorage').invoke('getItem', 'user').should('exist');
});

// Command to check if user is not authenticated
Cypress.Commands.add('shouldNotBeAuthenticated', () => {
  cy.window().its('localStorage').invoke('getItem', 'accessToken').should('not.exist');
  cy.window().its('localStorage').invoke('getItem', 'user').should('not.exist');
});