import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Block and create footnote', () => {
    // Change page title
    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
      .clear()
      .type('My Add-on Page')
      .get('.documentFirstHeading span[data-text]')
      .contains('My Add-on Page');

    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block').type(
      '{enter}',
    );

    // Add some text with footnotes
    cy.get('.slate-editor [contenteditable=true]')
      .focus()
      .click()
      .wait(1000)
      .type('Colorless green ideas sleep furiously.');

    cy.get('.slate-editor.selected [contenteditable=true]').setSelection(
      'furiously',
    );

    cy.wait(1000);

    cy.get('.slate-inline-toolbar .button-wrapper a[title="Footnote"]').click();
    cy.get('.sidebar-container [id=field-footnote]').click().type('Citation');
    cy.get('.sidebar-container .form .header button:first-of-type').click();

    // Add block
    cy.get('.slate-editor [contenteditable=true]')
      .focus()
      .click()
      .wait(1000)
      .type('{enter}');

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Text').click();
    cy.get('.content.active.text .button.slateFootnotes')
      .contains('Footnotes')
      .click();

    // Configure block
    cy.get('[id=sidebar-properties] [name=title]').click().type('Footnotes');
    cy.get('[id=sidebar-properties] label[for=field-global]').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.get('span.citation-item').contains('furiously');
    cy.contains('Footnotes');
    cy.contains('Citation');
  });
});
