declare namespace Cypress {
  interface Chainable<Subject = any> {
    getIngredient(type: string): Cypress.Chainable<JQuery<HTMLElement>>;

    addIngredientToConstructor(type: string): void;

    openIngredientModal(type: string): void;

    checkIngredientModalContent(type: string): void;

    closeModal(method: 'button' | 'esc' | 'overlay'): void;

    getConstructor(
      expectedCount: number | undefined
    ): Cypress.Chainable<JQuery<HTMLElement>>;

    getOrderButton(): Cypress.Chainable<JQuery<HTMLElement>>;

    getModal(): Cypress.Chainable<JQuery<HTMLElement>>;
  }
}
