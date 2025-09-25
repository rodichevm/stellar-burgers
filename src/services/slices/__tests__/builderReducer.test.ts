import reducer, {
  initialState,
  setBun,
  addIngredient,
  removeIngredient,
  resetConstructor,
  moveIngredient
} from '../builderSlice';

const bunData = {
  id: '643d69a5c3f7b9001cfa093c',
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0
};

const firstIngredientData = {
  id: '643d69a5c3f7b9001cfa093e',
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

const secondIngredientData = {
  id: '643d69a5c3f7b9001cfa0942',
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0
};

describe('Тесты для конструктора бургера', () => {
  test('Добавление булки', () => {
    const state = reducer(initialState, setBun(bunData));
    expect(state.bun).toEqual(bunData);
  });
  test('Добавление ингредиента', () => {
    const stateAfterFirst = reducer(
      initialState,
      addIngredient(firstIngredientData)
    );
    const stateAfterSecond = reducer(
      stateAfterFirst,
      addIngredient(secondIngredientData)
    );
    expect(stateAfterSecond.ingredients).toContainEqual(firstIngredientData);
    expect(stateAfterSecond.ingredients).toContainEqual(secondIngredientData);
    expect(stateAfterSecond.ingredients).toHaveLength(2);
  });
  test('Удаление ингредиента', () => {
    const stateAfterFirst = reducer(
      initialState,
      addIngredient(firstIngredientData)
    );
    const stateAfterSecond = reducer(
      stateAfterFirst,
      addIngredient(secondIngredientData)
    );
    const newState = reducer(
      stateAfterSecond,
      removeIngredient(secondIngredientData.id)
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients).not.toContainEqual(secondIngredientData);
  });
  test('Перемещение ингредиента вверх', () => {
    const stateAfterFirst = reducer(
      initialState,
      addIngredient(firstIngredientData)
    );
    const stateAfterSecond = reducer(
      stateAfterFirst,
      addIngredient(secondIngredientData)
    );
    const newState = reducer(
      stateAfterSecond,
      moveIngredient({ index: 1, upwards: true })
    );
    expect(newState.ingredients[0]).toEqual(secondIngredientData);
    expect(newState.ingredients[1]).toEqual(firstIngredientData);
  });
  test('Перемещение ингредиента вниз', () => {
    const stateAfterFirst = reducer(
      initialState,
      addIngredient(firstIngredientData)
    );
    const stateAfterSecond = reducer(
      stateAfterFirst,
      addIngredient(secondIngredientData)
    );
    const newState = reducer(
      stateAfterSecond,
      moveIngredient({ index: 0, upwards: false })
    );
    expect(newState.ingredients[0]).toEqual(secondIngredientData);
    expect(newState.ingredients[1]).toEqual(firstIngredientData);
  });

  test('Сброс конструктора', () => {
    const stateAfterFirst = reducer(
      initialState,
      addIngredient(firstIngredientData)
    );
    const stateAfterSecond = reducer(
      stateAfterFirst,
      addIngredient(secondIngredientData)
    );
    const stateWithBun = reducer(stateAfterSecond, setBun(bunData));
    const newState = reducer(stateWithBun, resetConstructor());
    expect(newState).toEqual(initialState);
  });
});
