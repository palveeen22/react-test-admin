import { StoreProvider } from './providers/StoreProvider';
import { GlobalStyles } from './styles/GlobalStyles';
import { MetersPage } from '../pages/meters-page';
import { IconSprite } from '../shared/ui/IconSprite';
import { ModalRoot } from './ui/ModalRoot';

export function App() {
  return (
    <StoreProvider>
      <IconSprite />
      <GlobalStyles />
      <MetersPage />
      <ModalRoot />
    </StoreProvider>
  );
}
