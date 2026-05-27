import { types } from 'mobx-state-tree';

export const ConfirmModalStore = types
  .model('ConfirmModalStore', {
    isOpen: types.optional(types.boolean, false),
    title: types.optional(types.string, ''),
    message: types.optional(types.string, ''),
  })
  .volatile(() => ({
    onConfirm: null as (() => void) | null,
  }))
  .actions((self) => ({
    open({
      title,
      message,
      onConfirm,
    }: {
      title: string;
      message: string;
      onConfirm: () => void;
    }) {
      self.title = title;
      self.message = message;
      self.onConfirm = onConfirm;
      self.isOpen = true;
    },
    confirm() {
      self.onConfirm?.();
      self.isOpen = false;
      self.onConfirm = null;
    },
    close() {
      self.isOpen = false;
      self.onConfirm = null;
    },
  }));

export type IConfirmModalStore = typeof ConfirmModalStore.Type;
