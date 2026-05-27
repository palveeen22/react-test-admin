import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import styled, { keyframes } from 'styled-components';
import type { IConfirmModalStore } from '../../model/ConfirmModalStore';

interface Props {
  store: IConfirmModalStore;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(31, 41, 57, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.15s ease;
`;

const Dialog = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 28px 28px 24px;
  width: 400px;
  max-width: calc(100vw - 32px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: ${slideUp} 0.18s ease;
`;

const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #1f2939;
  margin-bottom: 8px;
`;

const Message = styled.p`
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #5e6674;
  margin-bottom: 24px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const BtnBase = styled.button`
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  transition: background 0.15s;
`;

const CancelBtn = styled(BtnBase)`
  background: #f2f5f8;
  color: #1f2939;

  &:hover {
    background: #e4e8ef;
  }
`;

const ConfirmBtn = styled(BtnBase)`
  background: #fee3e3;
  color: #c53030;

  &:hover {
    background: #FED7D7;
  }
`;

export const ConfirmModal = observer(function ConfirmModal({ store }: Props) {
  useEffect(() => {
    if (!store.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') store.close();
      if (e.key === 'Enter') store.confirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [store, store.isOpen]);

  if (!store.isOpen) return null;

  return createPortal(
    <Overlay onClick={store.close}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{store.title}</Title>
        <Message>{store.message}</Message>
        <Actions>
          <CancelBtn onClick={store.close}>Отмена</CancelBtn>
          <ConfirmBtn onClick={store.confirm}>Удалить</ConfirmBtn>
        </Actions>
      </Dialog>
    </Overlay>,
    document.body
  );
});
