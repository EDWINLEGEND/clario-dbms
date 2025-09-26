// cypress/support/commands.js

// Custom login command that sets JWT token in localStorage
Cypress.Commands.add('login', () => {
  // Valid JWT token for test user (expires in 24h)
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdC11c2VyQGplc3QtdGVzdHMuY29tIiwibHQiOm51bGwsImlhdCI6MTc1ODg2ODk3NSwiZXhwIjoxNzU4ODY5ODc1fQ.EaMUqah03W-3ZIlxdxSY43Kgl_9x-B14G0bArs8U7MA';
  
  // Mock user data
  const userData = {
    id: "1",
    email: "test-user@jest-tests.com",
    name: "Test User",
    learningTypeId: null
  };

  // Set the token and user data in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('accessToken', token);
    win.localStorage.setItem('user', JSON.stringify(userData));
    
    // Trigger a storage event to notify the auth context
    win.dispatchEvent(new StorageEvent('storage', {
      key: 'accessToken',
      newValue: token,
      storageArea: win.localStorage
    }));
  });
});

// Additional commands can be added here
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })