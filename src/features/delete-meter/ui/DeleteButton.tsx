import styled from 'styled-components';
import { Icon } from '../../../shared/ui/Icon';

interface Props {
  onDelete: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

const Button = styled.button<{ $hidden?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #fee3e3;
  color: #c53030;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};

  &:hover {
    background: #FED7D7;
    color: #9B2C2C;
  }

  &:disabled {
    background: #f2f5f8;
    color: #9da6b4;
    cursor: not-allowed;
  }
`;

export function DeleteButton({ onDelete, disabled, hidden }: Props) {
  return (
    <Button
      onClick={onDelete}
      disabled={disabled}
      $hidden={hidden}
      title="Удалить счётчик"
    >
      <Icon id="trash" size={16} />
    </Button>
  );
}
