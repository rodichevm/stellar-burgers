describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Тестирование добавления ингредиентов', () => {
    it('Ингредиенты доступны для выбора', () => {
      cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1);
      cy.get('[data-ingredient="main"],[data-ingredient="sauce"]').should(
        'have.length.at.least',
        1
      );
    });

    it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
      cy.get('[data-ingredient="bun"]:first-of-type button').click();
      cy.get('[data-burger-constructor]')
        .find('[data-constructor-element]')
        .should('exist');
    });
  });

  describe('Тестирование модальных окон с описанием ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.get('[data-ingredient="bun"]:first-of-type').click();
      cy.get('#modals').children().should('have.length', 2);
    });

    it('Закрытие модального окна через кнопку крестика', () => {
      cy.get('[data-ingredient="bun"]:first-of-type').click();
      cy.get('#modals button:first-of-type').click();
      cy.wait(1000);
      cy.get('#modals').children().should('have.length', 0);
    });

    it('Закрытие модального окна через кнопку Esc', () => {
      cy.get('[data-ingredient="bun"]:first-of-type').click();
      cy.get('body').type('{esc}');
      cy.wait(1000);
      cy.get('#modals').children().should('have.length', 0);
    });

    it('Закрытие модального окна через оверлей', () => {
      cy.get('[data-ingredient="bun"]:first-of-type').click();
      cy.get('#modals>div:nth-of-type(2)').click({ force: true });
      cy.wait(1000);
      cy.get('#modals').children().should('have.length', 0);
    });

    it('Отображение данных выбранного ингредиента в модальном окне', () => {
      cy.get('[data-ingredient="bun"]:first-of-type').click();
      cy.get('[data-ingredient="bun"]:first-of-type [data-name]')
        .invoke('text')
        .then((ingredientName) => {
          cy.get('#modals h3').should('contain.text', ingredientName);
        });
    });
  });
});
