// cypress/e2e/auth.cy.js
describe('Authentication Flow', () => {

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should redirect unauthenticated users from the dashboard to the login page', () => {
    // Attempt to visit a protected route
    cy.visit('/dashboard');

    // Wait for redirect and assert that the URL has changed to the login page
    cy.url().should('include', '/login');
    cy.contains('Welcome Back').should('be.visible');
  });

  it('should allow a logged-in user to access the dashboard', () => {
    // Use the new login command
    cy.loginWithToken();

    // Now visit the dashboard
    cy.visit('/dashboard');

    // Wait for the page to load and assert that we are on the dashboard
    cy.url().should('include', '/dashboard');
    
    // Wait for the content to load and check for dashboard-specific content
    cy.contains('Continue Learning', { timeout: 10000 }).should('be.visible');
    
    // Verify authentication state
    cy.shouldBeAuthenticated();
  });

  it('should display the user avatar in the navbar for a logged-in user', () => {
    // Use the new login command
    cy.loginWithToken();

    // Wait for auth context to initialize
    cy.wait(2000);

    // Verify authentication state
    cy.shouldBeAuthenticated();

    // An avatar (or a button that triggers the profile popover) SHOULD exist
    cy.get('[data-cy="profile-avatar-button"]').should('be.visible');
  });

});