import { createContext } from 'react';
import { UIStore } from './uiStore';
import CounterStore from './counterStore';

interface Store {
  counterStore: CounterStore;
  uiStore: UIStore;
}

export const store: Store = {
  counterStore: new CounterStore(),
  uiStore: new UIStore(),
};

export const StoreContext = createContext(store);
