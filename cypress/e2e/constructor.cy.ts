import * as orderFixture from '../fixtures/order.json';

describe('Тестирование конструктор бургера и модальных окон ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Тестирование ингредиентов', () => {
    it('Ингредиенты доступны для выбора', () => {
      cy.get('[data-ingredient-type="bun"]').should('have.length.at.least', 1);
      cy.get(
        '[data-ingredient-type="main"],[data-ingredient-type="sauce"]'
      ).should('have.length.at.least', 1);
    });

    it('Добавление булки из списка в конструктор', () => {
      cy.get('[data-ingredient-type="bun"]:first-of-type').as('ingredientBun');
      cy.get('@ingredientBun').find('button').click();
      cy.get('@ingredientBun')
        .find('[data-ingredient-name]')
        .invoke('attr', 'data-ingredient-name')
        .then((name) => {
          cy.get(`[data-constructor-element-name="${name}"]`).should('exist');
        });
    });
    it('Добавление начинки из списка в конструктор', () => {
      cy.get('[data-ingredient-type="main"]:first-of-type').as(
        'ingredientMain'
      );
      cy.get('@ingredientMain').find('button').click();
      cy.get('@ingredientMain')
        .find('[data-ingredient-name]')
        .invoke('attr', 'data-ingredient-name')
        .then((name) => {
          cy.log(`Ищем элемент с data-ingredient-name="${name}"`);
          cy.get(`[data-constructor-element-name="${name}"]`).should('exist');
        });
    });
    it('Добавление соуса из списка в конструктор', () => {
      cy.get('[data-ingredient-type="sauce"]:first-of-type').as(
        'ingredientSauce'
      );
      cy.get('@ingredientSauce').find('button').click();
      cy.get('@ingredientSauce')
        .find('[data-ingredient-name]')
        .invoke('attr', 'data-ingredient-name')
        .then((name) => {
          cy.log(`Ищем элемент с data-ingredient-name="${name}"`);
          cy.get(`[data-constructor-element-name="${name}"]`).should('exist');
        });
    });
  });

  describe('Тестирование модальных окон с описанием ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.get('[data-ingredient-type="bun"]:first-of-type').click();
      cy.get('#modals').children().should('have.length', 2);
    });

    it('Отображение данных выбранного ингредиента в модальном окне', () => {
      cy.get('[data-ingredient-type="bun"]:first-of-type').click();
      cy.get(
        '[data-ingredient-type="bun"]:first-of-type [data-ingredient-name]'
      )
        .invoke('text')
        .then((ingredientName) => {
          cy.get('#modals h3').should('contain.text', ingredientName);
        });
    });

    it('Закрытие модального окна через кнопку крестика', () => {
      cy.get('[data-ingredient-type="bun"]:first-of-type').click();
      cy.get('#modals button:first-of-type').click();
      cy.wait(1000);
      cy.get('#modals').children().should('have.length', 0);
    });

    it('Закрытие модального окна через кнопку Esc', () => {
      cy.get('[data-ingredient-type="bun"]:first-of-type').click();
      cy.get('body').type('{esc}');
      cy.wait(1000);
      cy.get('#modals').children().should('have.length', 0);
    });

    it('Закрытие модального окна через оверлей', () => {
      cy.get('[data-ingredient-type="bun"]:first-of-type').click();
      cy.get('#modals>div:nth-of-type(2)').click({ force: true });
      cy.wait(1000);
      cy.get('#modals').children().should('have.length', 0);
    });
  });
});

describe('Процесс создания заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
    localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/');
    cy.wait('@getUser');
    cy.wait('@getIngredients');
  });

  describe('Оформление заказа авторизованным пользователем', () => {
    it('Токен авторизации существует', () => {
      cy.getCookie('accessToken')
        .should('exist')
        .then((cookie) => {
          expect(cookie?.value).to.eq('EXAMPLE_ACCESS_TOKEN');
        });
    });
    it('Добавление ингредиентов и создание заказа', () => {
      cy.get('[data-order-button]').should('be.disabled');
      cy.get('[data-ingredient-type="bun"]:first-of-type button').click();
      cy.get('[data-ingredient-type="main"]:first-of-type button').click();
      cy.get('[data-ingredient-type="sauce"]:first-of-type button').click();
      cy.get('[data-burger-constructor]')
        .find('[data-constructor-element-name]')
        .should('have.length', 3);
      cy.get('[data-order-button]').should('be.enabled');
      cy.get('[data-order-button]').click();
      cy.wait('@createOrder');
      cy.get('#modals').children().should('have.length', 2);
      cy.get('#modals [data-order-number]').should(
        'have.text',
        orderFixture.order.number
      );
      cy.get('#modals button:first-of-type').click();
      cy.wait(1000);
      cy.get('#modals').children().should('have.length', 0);
      cy.get('[data-burger-constructor]')
        .find('[data-constructor-element-name]')
        .should('have.length', 0);
      cy.get('[data-order-button]').should('be.disabled');
    });
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
});
