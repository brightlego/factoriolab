import { ItemId, Mocks, RecipeId } from 'src/tests';
import { RateType } from '~/models';
import * as App from '../app.actions';
import * as Actions from './products.actions';
import {
  initialProductsState,
  productsReducer,
  ProductsState,
} from './products.reducer';

describe('Products Reducer', () => {
  const state = productsReducer(
    undefined,
    new Actions.AddAction(ItemId.WoodenChest)
  );

  describe('LOAD', () => {
    it('should load a list of products', () => {
      const productsState: ProductsState = {
        ids: ['id'],
        entities: { id: Mocks.Product1 },
        index: 1,
      };
      const result = productsReducer(
        undefined,
        new App.LoadAction({ productsState })
      );
      expect(result).toEqual(productsState);
    });

    it('should skip loading products state if null', () => {
      const result = productsReducer(undefined, new App.LoadAction({}));
      expect(result).toEqual(initialProductsState);
    });
  });

  describe('App RESET', () => {
    it('should return the initial state', () => {
      const result = productsReducer(undefined, new App.ResetAction());
      expect(result).toEqual(initialProductsState);
    });
  });

  describe('RESET', () => {
    it('should reset the reducer', () => {
      const result = productsReducer(
        undefined,
        new Actions.ResetAction(ItemId.Coal)
      );
      expect(result).toEqual({
        ids: ['1'],
        entities: {
          ['1']: {
            id: '1',
            itemId: ItemId.Coal,
            rate: '60',
            rateType: RateType.Items,
          },
        },
        index: 2,
      });
    });
  });

  describe('ADD', () => {
    it('should add a new product', () => {
      expect(state.ids.length).toEqual(1);
    });

    it('should use settings from the last added product', () => {
      const state: ProductsState = {
        ids: ['0'],
        entities: {
          ['0']: {
            id: '0',
            itemId: ItemId.Coal,
            rate: '30',
            rateType: RateType.Wagons,
          },
        },
        index: 1,
      };
      const result = productsReducer(state, new Actions.AddAction(ItemId.Wood));
      expect(result.entities['1']).toEqual({
        id: '1',
        itemId: ItemId.Wood,
        rate: '30',
        rateType: RateType.Wagons,
      });
    });
  });

  describe('REMOVE', () => {
    it('should remove a product', () => {
      const result = productsReducer(state, new Actions.RemoveAction('1'));
      expect(result.ids.length).toEqual(0);
    });
  });

  describe('SET_ITEM', () => {
    it('should set item on a product', () => {
      const result = productsReducer(
        state,
        new Actions.SetItemAction({
          id: Mocks.Product1.id,
          value: Mocks.Product2.itemId,
        })
      );
      expect(result.entities[Mocks.Product1.id].itemId).toEqual(
        Mocks.Product2.itemId
      );
    });

    it('should reset Factories RateType', () => {
      let result = productsReducer(
        state,
        new Actions.SetRateTypeAction({
          id: Mocks.Product1.id,
          value: RateType.Factories,
        })
      );
      result = productsReducer(
        result,
        new Actions.SetItemAction({
          id: Mocks.Product1.id,
          value: Mocks.Product2.itemId,
        })
      );
      expect(result.entities[Mocks.Product1.id].rateType).toEqual(
        RateType.Items
      );
    });
  });

  describe('SET_RATE', () => {
    it('should set rate of a product', () => {
      const value = '3';
      const result = productsReducer(
        state,
        new Actions.SetRateAction({ id: Mocks.Product1.id, value })
      );
      expect(result.entities[Mocks.Product1.id].rate).toEqual(value);
    });
  });

  describe('SET_RATE_TYPE', () => {
    it('should set rate type of a product', () => {
      const value = RateType.Wagons;
      const result = productsReducer(
        state,
        new Actions.SetRateTypeAction({ id: Mocks.Product1.id, value })
      );
      expect(result.entities[Mocks.Product1.id].rateType).toEqual(value);
    });
  });

  describe('SET_VIA', () => {
    it('should set the via of a product', () => {
      const value = RecipeId.AdvancedOilProcessing;
      const result = productsReducer(
        state,
        new Actions.SetViaAction({ id: Mocks.Product1.id, value })
      );
      expect(result.entities[Mocks.Product1.id].viaId).toEqual(value);
    });
  });

  describe('RESET_VIA', () => {
    it('should reset the via of a product', () => {
      let result = productsReducer(
        state,
        new Actions.SetViaAction({
          id: Mocks.Product1.id,
          value: RecipeId.AdvancedOilProcessing,
        })
      );
      result = productsReducer(
        result,
        new Actions.ResetViaAction(Mocks.Product1.id)
      );
      expect(result.entities[Mocks.Product1.id].viaId).toBeUndefined();
    });
  });

  describe('ADJUST_DISPLAY_RATE', () => {
    it('should adjust rates for products when display rate changes', () => {
      const result = productsReducer(
        state,
        new Actions.AdjustDisplayRateAction('1/60')
      );
      expect(result.entities[Mocks.Product1.id].rate).toEqual('1');
    });

    it('should not adjust rates when rate type unaffected by display rate', () => {
      let result = productsReducer(
        state,
        new Actions.SetRateTypeAction({ id: '1', value: RateType.Belts })
      );
      result = productsReducer(
        result,
        new Actions.AdjustDisplayRateAction('1/60')
      );
      expect(result.entities[Mocks.Product1.id].rate).toEqual('60');
    });
  });

  it('should return default state', () => {
    expect(productsReducer(state, { type: 'Test' } as any)).toBe(state);
  });
});
