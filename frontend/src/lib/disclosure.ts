import { createStore, useStore } from "zustand";

type DisclosureStoreType<T> = {
  isOpen: boolean;
  data?: T;
};

export const createDisclosureStore = <T>(initialData?: T) => {
  const store = createStore<DisclosureStoreType<T>>(() => ({
    isOpen: false,
    data: initialData,
  }));

  const onOpen = (data?: T) => {
    store.setState({
      isOpen: true,
      data,
    });
  };

  const onClose = () => {
    store.setState({ isOpen: false });
  };

  const setOpen = (isOpen: boolean, data?: T) => {
    store.setState({ isOpen, data });
  };

  const useState = () => {
    return useStore(store);
  };

  return { store, useState, onOpen, onClose, setOpen };
};

export type DisclosureType<T = unknown> = ReturnType<
  typeof createDisclosureStore<T>
>;
