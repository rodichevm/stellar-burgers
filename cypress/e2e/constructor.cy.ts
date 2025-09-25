const ATTR_INGREDIENT_TYPE = 'data-ingredient-type';
const ATTR_INGREDIENT_NAME = 'data-ingredient-name';
const ATTR_CONSTRUCTOR_ELEMENT_NAME = 'data-constructor-element-name';
const SELECTOR_MODALS = '#modals';
const ATTR_ORDER_BUTTON = 'data-order-button';
const ATTR_BURGER_CONSTRUCTOR = 'data-burger-constructor';

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
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]`).should(
        'have.length.at.least',
        1
      );
      cy.get(
        `[${ATTR_INGREDIENT_TYPE}="main"],[${ATTR_INGREDIENT_TYPE}="sauce"]`
      ).should('have.length.at.least', 1);
    });

    it('Добавление булки из списка в конструктор', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type`).as(
        'ingredientBun'
      );
      cy.get('@ingredientBun').find('button').click();
      cy.get('@ingredientBun')
        .find(`[${ATTR_INGREDIENT_NAME}]`)
        .invoke('attr', ATTR_INGREDIENT_NAME)
        .then((name) => {
          cy.get(`[${ATTR_CONSTRUCTOR_ELEMENT_NAME}="${name}"]`).should(
            'exist'
          );
        });
    });

    it('Добавление начинки из списка в конструктор', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="main"]:first-of-type`).as(
        'ingredientMain'
      );
      cy.get('@ingredientMain').find('button').click();
      cy.get('@ingredientMain')
        .find(`[${ATTR_INGREDIENT_NAME}]`)
        .invoke('attr', ATTR_INGREDIENT_NAME)
        .then((name) => {
          cy.get(`[${ATTR_CONSTRUCTOR_ELEMENT_NAME}="${name}"]`).should(
            'exist'
          );
        });
    });

    it('Добавление соуса из списка в конструктор', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="sauce"]:first-of-type`).as(
        'ingredientSauce'
      );
      cy.get('@ingredientSauce').find('button').click();
      cy.get('@ingredientSauce')
        .find(`[${ATTR_INGREDIENT_NAME}]`)
        .invoke('attr', ATTR_INGREDIENT_NAME)
        .then((name) => {
          cy.get(`[${ATTR_CONSTRUCTOR_ELEMENT_NAME}="${name}"]`).should(
            'exist'
          );
        });
    });
  });

  describe('Тестирование модальных окон с описанием ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type`).click();
      cy.get(SELECTOR_MODALS).children().should('have.length', 2);
    });

    it('Отображение данных выбранного ингредиента в модальном окне', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type`).click();
      cy.get(
        `[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type [${ATTR_INGREDIENT_NAME}]`
      )
        .invoke('text')
        .then((ingredientName) => {
          cy.get(`${SELECTOR_MODALS} h3`).should(
            'contain.text',
            ingredientName
          );
        });
    });

    it('Закрытие модального окна через кнопку крестика', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type`).click();
      cy.get(`${SELECTOR_MODALS} button:first-of-type`).click();
      cy.wait(1000);
      cy.get(SELECTOR_MODALS).children().should('have.length', 0);
    });

    it('Закрытие модального окна через кнопку Esc', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type`).click();
      cy.get('body').type('{esc}');
      cy.wait(1000);
      cy.get(SELECTOR_MODALS).children().should('have.length', 0);
    });

    it('Закрытие модального окна через оверлей', () => {
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type`).click();
      cy.get(`${SELECTOR_MODALS}>div:nth-of-type(2)`).click({ force: true });
      cy.wait(1000);
      cy.get(SELECTOR_MODALS).children().should('have.length', 0);
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
      cy.get(`[${ATTR_ORDER_BUTTON}]`).should('be.disabled');
      cy.get(`[${ATTR_INGREDIENT_TYPE}="bun"]:first-of-type button`).click();
      cy.get(`[${ATTR_INGREDIENT_TYPE}="main"]:first-of-type button`).click();
      cy.get(`[${ATTR_INGREDIENT_TYPE}="sauce"]:first-of-type button`).click();
      cy.get(`[${ATTR_BURGER_CONSTRUCTOR}]`)
        .find(`[${ATTR_CONSTRUCTOR_ELEMENT_NAME}]`)
        .should('have.length', 3);
      cy.get(`[${ATTR_ORDER_BUTTON}]`).should('be.enabled');
      cy.get(`[${ATTR_ORDER_BUTTON}]`).click();
      cy.wait('@createOrder');
      cy.get(SELECTOR_MODALS).children().should('have.length', 2);
      cy.get(`${SELECTOR_MODALS} [data-order-number]`).should(
        'have.text',
        orderFixture.order.number
      );
      cy.get(`${SELECTOR_MODALS} button:first-of-type`).click();
      cy.wait(1000);
      cy.get(SELECTOR_MODALS).children().should('have.length', 0);
      cy.get(`[${ATTR_BURGER_CONSTRUCTOR}]`)
        .find(`[${ATTR_CONSTRUCTOR_ELEMENT_NAME}]`)
        .should('have.length', 0);
      cy.get(`[${ATTR_ORDER_BUTTON}]`).should('be.disabled');
    });
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
});
