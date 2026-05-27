import { observer } from 'mobx-react-lite';
import { useStore } from '../providers/useStore';
import { ConfirmModal } from '../../shared/ui/ConfirmModal';

export const ModalRoot = observer(function ModalRoot() {
  const { modal } = useStore();
  return <ConfirmModal store={modal} />;
});
