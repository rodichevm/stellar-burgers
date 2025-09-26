import { TIngredientType } from '../../src/utils/types';
import {
  ATTR_BURGER_CONSTRUCTOR,
  ATTR_CONSTRUCTOR_ELEMENT_NAME,
  ATTR_INGREDIENT_NAME,
  ATTR_INGREDIENT_TYPE,
  ATTR_ORDER_BUTTON,
  SELECTOR_MODALS
} from './constants';

Cypress.Commands.add('getIngredient', (type: TIngredientType) => {
  return cy.get(`[${ATTR_INGREDIENT_TYPE}="${type}"]:first-of-type`);
});

Cypress.Commands.add('addIngredientToConstructor', (type: TIngredientType) => {
  cy.getIngredient(type).as('ingredient');
  cy.get('@ingredient').find('button').click();
  cy.get('@ingredient')
    .find(`[${ATTR_INGREDIENT_NAME}]`)
    .invoke('attr', ATTR_INGREDIENT_NAME)
    .then((name) => {
      cy.get(`[${ATTR_CONSTRUCTOR_ELEMENT_NAME}="${name}"]`).should('exist');
    });
});

Cypress.Commands.add('openIngredientModal', (type: TIngredientType) => {
  cy.getIngredient(type).click();
  cy.get(SELECTOR_MODALS).children().should('have.length', 2);
});

Cypress.Commands.add('checkIngredientModalContent', (type: TIngredientType) => {
  cy.getIngredient(type)
    .find(`[${ATTR_INGREDIENT_NAME}]`)
    .invoke('text')
    .then((ingredientName) => {
      cy.get(`${SELECTOR_MODALS} h3`).should('contain.text', ingredientName);
    });
});

Cypress.Commands.add('closeModal', (method: 'button' | 'esc' | 'overlay') => {
  if (method === 'button')
    cy.get(`${SELECTOR_MODALS} button:first-of-type`).click();
  if (method === 'esc') cy.get('body').type('{esc}');
  if (method === 'overlay')
    cy.get(`${SELECTOR_MODALS}>div:nth-of-type(2)`).click({ force: true });
  cy.get(SELECTOR_MODALS).children().should('have.length', 0);
});

Cypress.Commands.add('getConstructor', (expectedCount?: number) => {
  const constructor = cy
    .get(`[${ATTR_BURGER_CONSTRUCTOR}]`)
    .find(`[${ATTR_CONSTRUCTOR_ELEMENT_NAME}]`);
  if (expectedCount !== undefined) {
    constructor.should('have.length', expectedCount);
  }
  return constructor;
});

Cypress.Commands.add('getOrderButton', () => cy.get(`[${ATTR_ORDER_BUTTON}]`));

Cypress.Commands.add('getModal', () => cy.get(SELECTOR_MODALS));
