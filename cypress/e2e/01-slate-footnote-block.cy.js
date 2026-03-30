import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const getVisibleSlateToolbarButton = (title) =>
  cy.get('body').then(($body) => {
    const buttons = $body
      .find(`.slate-inline-toolbar .button-wrapper a[title="${title}"]`)
      .filter(':visible');

    expect(
      buttons.length,
      `visible "${title}" slate toolbar button`,
    ).to.be.greaterThan(0);

    return cy.wrap(buttons.last());
  });

const triggerVisibleSlateToolbarButton = (title) =>
  getVisibleSlateToolbarButton(title).trigger('mousedown', { force: true });

const getFootnotePopup = () =>
  cy.contains('h2', 'Footnote entry').closest('header');

const openFootnotePopup = () => {
  triggerVisibleSlateToolbarButton('Footnote');
  cy.wait(300);
  cy.get('body').then(($body) => {
    if ($body.text().includes('Footnote entry')) {
      return;
    }

    const editButton = $body.find(
      '.slate-inline-toolbar:visible .button-wrapper a[title="Edit footnote"]',
    );

    if (editButton.length) {
      cy.wrap(editButton.last()).trigger('mousedown', { force: true });
    }
  });
  getFootnotePopup().should('exist');
};

const setFootnoteReferences = (references) => {
  cy.get(
    '#blockform-fieldset-default .field-wrapper-footnote .react-select-container',
  )
    .last()
    .click();

  references.forEach((reference, index) => {
    if (index > 0) {
      cy.get(
        '#blockform-fieldset-default .field-wrapper-footnote .react-select-container',
      )
        .last()
        .click();
    }

    cy.focused().type(`${reference}{enter}`, { force: true });
  });
};

const saveFootnotePopup = () => {
  getFootnotePopup().find('button').first().click();
};

const cancelFootnotePopup = () => {
  getFootnotePopup().find('button').last().click();
};

const addFootnotesBlock = ({ title = 'Footnotes', global = true } = {}) => {
  cy.getSlateEditorAndType('{enter}');
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get('.blocks-chooser .title').contains('Text').click();
  cy.get('.blocks-chooser .content.active .button')
    .contains('Footnotes')
    .click();

  cy.contains('Footnote block').should('exist');
  cy.get('input[name="title"]').last().clear().type(title);

  if (global) {
    cy.get('#field-global').last().click({ force: true });
  }
};

const visitPageEdit = () => {
  cy.navigate('/cypress/my-page/edit');
  cy.get('.block.title h1').should('exist');
};

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('allows adding a footnote and footnotes block', () => {
    cy.getSlateEditorAndType('Colorless green ideas sleep furiously.')
      .type('{selectAll}')
      .dblclick();

    cy.setSlateCursor('Colorless').dblclick();
    cy.setSlateSelection('Colorless', 'green');
    openFootnotePopup();
    setFootnoteReferences(['Citation']);
    saveFootnotePopup();

    addFootnotesBlock();
    cy.toolbarSave();

    cy.get('span.citation-item').contains('Colorless green');
    cy.contains('Footnotes');
    cy.contains('Citation');
    cy.get('[aria-label="Back to content"]').first().click();
  });

  it('allows canceling a footnote edit', () => {
    cy.getSlateEditorAndType('Colorless green ideas sleep furiously.')
      .type('{selectAll}')
      .dblclick();

    cy.setSlateCursor('Colorless').dblclick();
    cy.setSlateSelection('Colorless', 'green');
    openFootnotePopup();
    setFootnoteReferences(['Citation']);
    cancelFootnotePopup();

    cy.toolbarSave();
    cy.contains('My Page');
    cy.get('span.citation-item').should('not.exist');
    cy.contains('Footnotes').should('not.exist');
  });

  it('allows adding multiple citations for the same footnote', () => {
    cy.getSlateEditorAndType('Colorless green ideas sleep furiously.')
      .type('{selectAll}')
      .dblclick();

    cy.setSlateCursor('Colorless').dblclick();
    cy.setSlateSelection('Colorless', 'green');
    openFootnotePopup();
    setFootnoteReferences(['Citation', 'Yet another citation']);
    saveFootnotePopup();

    addFootnotesBlock();
    cy.toolbarSave();

    cy.get('span.citation-item').contains('Colorless green');
    cy.contains('Footnotes');
    cy.contains('Citation');
    cy.contains('Yet another citation');
  });

  it('renders an existing citation node in edit mode through the UI', () => {
    cy.getSlateEditorAndType('Colorless green ideas sleep furiously.')
      .type('{selectAll}')
      .dblclick();

    cy.setSlateCursor('Colorless').dblclick();
    cy.setSlateSelection('Colorless', 'green');
    openFootnotePopup();
    setFootnoteReferences(['Citation']);
    saveFootnotePopup();

    addFootnotesBlock();
    cy.toolbarSave();

    visitPageEdit();

    cy.get('[id^="cite_ref-"]').should('exist');
    cy.contains('Colorless green').should('exist');
    cy.contains('Footnotes').should('exist');
    cy.contains('Citation').should('exist');

    cy.toolbarSave();
    cy.contains('Citation');
  });
});
