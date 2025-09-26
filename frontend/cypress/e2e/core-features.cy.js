// cypress/e2e/core-features.cy.js
describe('Core Features E2E Tests', () => {

  beforeEach(() => {
    // Ensure we start with a clean state
    cy.clearLocalStorage();
  });

  describe('Course Discovery Flow', () => {
    it('should allow users to search for courses and access video player', () => {
      // Step 1: Login using custom command
      cy.login();

      // Step 2: Navigate to the learn page
      cy.visit('/learn');
      cy.url().should('include', '/learn');

      // Step 3: Wait for the page to load and verify search functionality
      cy.get('input[placeholder*="search"], input[type="search"], [data-cy="search-input"]', { timeout: 10000 })
        .should('be.visible')
        .type('javascript{enter}');

      // Step 4: Wait for search results and verify course cards appear
      cy.get('[data-cy="course-card"], .course-card, [class*="course"], [class*="card"]', { timeout: 15000 })
        .should('have.length.greaterThan', 0)
        .first()
        .should('be.visible');

      // Step 5: Click the first course card
      cy.get('[data-cy="course-card"], .course-card, [class*="course"], [class*="card"]')
        .first()
        .click();

      // Step 6: Verify URL changes to a detail page
      cy.url().should('match', /\/learn\/[^\/]+/);

      // Step 7: Verify video player is visible
      cy.get('[data-cy="video-player"], .video-player, iframe[src*="youtube"], [class*="youtube"]', { timeout: 10000 })
        .should('be.visible');

      // Additional verification: Check for video controls or player elements
      cy.get('button[aria-label*="play"], [data-cy="play-button"], .play-button', { timeout: 5000 })
        .should('exist');
    });

    it('should handle empty search results gracefully', () => {
      cy.login();
      cy.visit('/learn');

      // Search for something that likely won't return results
      cy.get('input[placeholder*="search"], input[type="search"], [data-cy="search-input"]')
        .should('be.visible')
        .type('xyznonexistentcourse123{enter}');

      // Verify appropriate message or empty state
      cy.contains('No results', { matchCase: false, timeout: 10000 }).should('be.visible')
        .or(cy.contains('No courses', { matchCase: false }))
        .or(cy.contains('Try a different', { matchCase: false }));
    });
  });

  describe('Project Creation and Deletion Flow', () => {
    it('should allow users to create and delete projects', () => {
      // Step 1: Login using custom command
      cy.login();

      // Step 2: Navigate to the projects page
      cy.visit('/projects');
      cy.url().should('include', '/projects');

      // Step 3: Click the "Create New Project" button
      cy.get('button:contains("Create"), button:contains("New Project"), [data-cy="create-project-button"]', { timeout: 10000 })
        .should('be.visible')
        .click();

      // Step 4: Fill out the project creation form
      const projectName = `Test Project ${Date.now()}`;
      const projectDescription = 'This is a test project created by Cypress E2E tests';

      // Wait for dialog/modal to appear
      cy.get('[role="dialog"], .modal, [data-cy="project-dialog"]', { timeout: 5000 })
        .should('be.visible');

      // Fill in project name
      cy.get('input[name="name"], input[placeholder*="name"], [data-cy="project-name-input"]')
        .should('be.visible')
        .clear()
        .type(projectName);

      // Fill in project description
      cy.get('textarea[name="description"], textarea[placeholder*="description"], [data-cy="project-description-input"]')
        .should('be.visible')
        .clear()
        .type(projectDescription);

      // Step 5: Submit the form
      cy.get('button[type="submit"], button:contains("Create"), button:contains("Save"), [data-cy="submit-project"]')
        .should('be.visible')
        .click();

      // Step 6: Verify the new project appears on the page
      cy.contains(projectName, { timeout: 10000 })
        .should('be.visible');

      // Verify project card exists
      cy.get('[data-cy="project-card"], .project-card, [class*="project"]')
        .contains(projectName)
        .should('be.visible');

      // Step 7: Delete the project (cleanup)
      cy.get('[data-cy="project-card"], .project-card, [class*="project"]')
        .contains(projectName)
        .parent()
        .within(() => {
          // Look for delete button within the project card
          cy.get('button[aria-label*="delete"], button:contains("Delete"), [data-cy="delete-project"], .delete-button')
            .should('be.visible')
            .click();
        });

      // Confirm deletion if there's a confirmation dialog
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Confirm"), button:contains("Delete"), button:contains("Yes")').length > 0) {
          cy.get('button:contains("Confirm"), button:contains("Delete"), button:contains("Yes")')
            .click();
        }
      });

      // Step 8: Verify the project is removed
      cy.contains(projectName, { timeout: 10000 })
        .should('not.exist');
    });

    it('should validate required fields in project creation form', () => {
      cy.login();
      cy.visit('/projects');

      // Open create project dialog
      cy.get('button:contains("Create"), button:contains("New Project"), [data-cy="create-project-button"]')
        .click();

      // Try to submit without filling required fields
      cy.get('button[type="submit"], button:contains("Create"), button:contains("Save"), [data-cy="submit-project"]')
        .click();

      // Verify validation messages appear
      cy.contains('required', { matchCase: false, timeout: 5000 })
        .should('be.visible')
        .or(cy.contains('Please fill', { matchCase: false }))
        .or(cy.contains('This field', { matchCase: false }));
    });
  });

  describe('Navigation and User Experience', () => {
    it('should maintain user session across page navigation', () => {
      cy.login();

      // Navigate through different pages
      cy.visit('/dashboard');
      cy.contains('Current Courses', { timeout: 10000 }).should('be.visible');

      cy.visit('/learn');
      cy.get('input[placeholder*="search"], input[type="search"]', { timeout: 10000 }).should('be.visible');

      cy.visit('/projects');
      cy.get('button:contains("Create"), button:contains("New Project")', { timeout: 10000 }).should('be.visible');

      // Verify user avatar is still visible (indicating maintained session)
      cy.get('[data-cy="profile-avatar-button"]').should('be.visible');
    });

    it('should display loading states appropriately', () => {
      cy.login();
      cy.visit('/learn');

      // Check for loading indicators during search
      cy.get('input[placeholder*="search"], input[type="search"]')
        .type('react{enter}');

      // Look for loading indicators (spinners, skeletons, etc.)
      cy.get('[data-cy="loading"], .loading, .spinner, [class*="skeleton"]', { timeout: 2000 })
        .should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.login();
      
      // Intercept API calls and simulate network error
      cy.intercept('GET', '**/api/**', { forceNetworkError: true }).as('networkError');
      
      cy.visit('/dashboard');
      
      // Verify error handling (could be error message, retry button, etc.)
      cy.contains('error', { matchCase: false, timeout: 10000 })
        .should('be.visible')
        .or(cy.contains('failed', { matchCase: false }))
        .or(cy.contains('try again', { matchCase: false }));
    });
  });

});