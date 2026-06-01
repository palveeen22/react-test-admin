import { Component, type ErrorInfo, type ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 12px;
  font-family: 'Roboto', sans-serif;
  color: #1f2939;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

const Message = styled.pre`
  font-size: 12px;
  color: #b91c1c;
  background: #fff3f3;
  border: 1px solid #f5c6c6;
  border-radius: 6px;
  padding: 8px 12px;
  max-width: 560px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ReloadButton = styled.button`
  padding: 6px 18px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  color: #1f2939;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: #f1f5f9;
  }
`;

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <Wrapper>
          <span style={{ fontSize: 40 }}>💥</span>
          <Title>Что-то пошло не так</Title>
          <Message>{this.state.error.message}</Message>
          <ReloadButton onClick={() => window.location.reload()}>
            Перезагрузить страницу
          </ReloadButton>
        </Wrapper>
      );
    }
    return this.props.children;
  }
}
