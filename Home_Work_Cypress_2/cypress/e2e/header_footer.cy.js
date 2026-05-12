describe('QAuto header and footer elements', () => {
  beforeEach(() => {
    cy.visit('/', {
      auth: {
        username: 'guest',
        password: 'welcome2qauto',
      },
    });
  });

  it('All buttons and links in the header', () => {
    cy.get('header')
      .should('exist')
      .within(() => {
        cy.get('.header_nav')
          .should('exist')
          .within(() => {
            cy.get('a, button').should('have.length', 3);
            cy.contains('a, button', 'Home').should('exist');
            cy.contains('a, button', 'About').should('exist');
            cy.contains('a, button', 'Contacts').should('exist');
          });

        cy.get('.header_right')
          .should('exist')
          .within(() => {
            cy.get('button').should('have.length', 2);
            cy.contains('button', 'Guest log in').should('exist');
            cy.contains('button', 'Sign In').should('exist');
          });
      });
  });

  it('Links and buttons in the footer', () => {
    cy.get('footer')
      .should('exist')
      .within(() => {
        cy.get('a, button').should('have.length', 1);
        cy.get('a.footer_logo').should('exist');
      });
  });

  it('Social media links for Telegram, Facebook, LinkedIn, Instagram and YouTube', () => {
    const socialLinks = [
      { name: 'Facebook', href: 'facebook.com' },
      { name: 'Telegram', href: 't.me' },
      { name: 'LinkedIn', href: 'linkedin.com' },
      { name: 'Instagram', href: 'instagram.com' },
      { name: 'YouTube', href: 'youtube.com' },
    ];

    cy.get('.contacts_socials.socials')
      .should('exist')
      .within(() => {
        cy.get('a.socials_link').should('have.length', socialLinks.length);
        socialLinks.forEach((item) => {
          cy.get(`a.socials_link[href*="${item.href}"]`).should('exist');
        });
      });
  });
});
