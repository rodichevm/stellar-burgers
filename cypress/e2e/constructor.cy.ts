import * as orderFixture from '../fixtures/order.json';
import {
  ACCESS_TOKEN,
  ATTR_ORDER_NUMBER,
  INGREDIENT_TYPES,
  REFRESH_TOKEN
} from '../support/constants';

describe('Тестирование конструктор бургера и модальных окон ингредиентов', () => {
  beforeEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Тестирование ингредиентов', () => {
    it('Ингредиенты доступны для выбора', () => {
      INGREDIENT_TYPES.forEach((type) => {
        cy.getIngredient(type).should('have.length.at.least', 1);
      });
    });

    it('Добавление ингредиентов в конструктор', () => {
      INGREDIENT_TYPES.forEach((type) => cy.addIngredientToConstructor(type));
    });
  });

  describe('Тестирование модальных окон с описанием ингредиента', () => {
    INGREDIENT_TYPES.forEach((type) => {
      it('Открытие и закрытие модального окна выбранного ингредиента', () => {
        cy.openIngredientModal(type);
        cy.checkIngredientModalContent(type);
        cy.closeModal('button');
        cy.openIngredientModal(type);
        cy.closeModal('esc');
        cy.openIngredientModal(type);
        cy.closeModal('overlay');
      });
    });
  });
});

describe('Процесс создания заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', ACCESS_TOKEN);
    localStorage.setItem('refreshToken', REFRESH_TOKEN);

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
          expect(cookie?.value).to.eq(ACCESS_TOKEN);
        });
    });
    it('Refresh token существует в localStorage', () => {
      const refreshToken = localStorage.getItem('refreshToken');
      expect(refreshToken).to.exist;
      expect(refreshToken).to.eq(REFRESH_TOKEN);
    });
    it('Добавление ингредиентов и создание заказа', () => {
      cy.getOrderButton().should('be.disabled');
      INGREDIENT_TYPES.forEach((type) => cy.addIngredientToConstructor(type));
      cy.getConstructor(INGREDIENT_TYPES.length);
      cy.getOrderButton().should('be.enabled');
      cy.getOrderButton().click();
      cy.wait('@createOrder');
      cy.getModal().children().should('have.length', 2);
      cy.getModal()
        .find(`[${ATTR_ORDER_NUMBER}]`)
        .should('have.text', orderFixture.order.number);
      cy.closeModal('button');
      cy.getConstructor(0);
      cy.getOrderButton().should('be.disabled');
    });
  });
});
