import { StoreProvider } from './providers/StoreProvider';
import { GlobalStyles } from './styles/GlobalStyles';
import { MetersPage } from '../pages/meters-page';
import { IconSprite } from '../shared/ui/IconSprite';
import { ModalRoot } from './ui/ModalRoot';
import { ErrorBoundary } from '../shared/ui/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <IconSprite />
        <GlobalStyles />
        <MetersPage />
        <ModalRoot />
      </StoreProvider>
    </ErrorBoundary>
  );
}
