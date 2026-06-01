import { useEffect } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useStore } from '../../../app/providers/useStore';
import { MeterRow } from '../../../entities/meter/ui/MeterRow';
import { DeleteButton } from '../../../features/delete-meter';
import { MetersTableHeader } from './MetersTableHeader';
import { SkeletonRows } from './SkeletonRows';

const ScrollWrapper = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  min-height: 0;
  border-bottom: 1px solid #e0e5eb;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
  table-layout: fixed;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: #1d2432;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
`;

const RetryButton = styled.button`
  margin-top: 4px;
  padding: 6px 16px;
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

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fff3f3;
  border-bottom: 1px solid #f5c6c6;
  color: #b91c1c;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
`;

export const MetersTable = observer(function MetersTable() {
  const { meters, areas, modal } = useStore();

  useEffect(() => {
    return reaction(
      () => meters.items.map((m) => m.area.id),
      (ids) => areas.fetchAreas(ids),
      { fireImmediately: true }
    );
  }, []);

  function handleDeleteRequest(id: string, index: number) {
    modal.open({
      title: 'Удалить счётчик?',
      message: `Счётчик №${index} будет удалён без возможности восстановления.`,
      onConfirm: () => meters.deleteMeter(id),
    });
  }

  function renderDeleteButton(id: string, index: number) {
    return (
      <DeleteButton
        onDelete={() => handleDeleteRequest(id, index)}
        disabled={meters.isDeleting}
        hidden
      />
    );
  }

  return (
    <ScrollWrapper>
      {meters.deleteError && (
        <ErrorBanner>⚠ {meters.deleteError}</ErrorBanner>
      )}
      <Table>
        <MetersTableHeader />
        <tbody data-full={meters.items.length === 20 ? true : undefined}>
          {meters.isLoading ? (
            <SkeletonRows />
          ) : meters.error ? (
            <tr>
              <td colSpan={8} style={{ height: '100%' }}>
                <EmptyWrapper>
                  <span style={{ fontSize: 32 }}>⚠️</span>
                  <span>{meters.error}</span>
                  <RetryButton onClick={() => meters.retryFetch()}>
                    Повторить
                  </RetryButton>
                </EmptyWrapper>
              </td>
            </tr>
          ) : meters.items.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ height: '100%' }}>
                <EmptyWrapper>
                  <span style={{ fontSize: 32 }}>📭</span>
                  <span>Счётчики не найдены</span>
                </EmptyWrapper>
              </td>
            </tr>
          ) : (
            meters.items.map((meter, i) => {
              const globalIndex = meters.offset + i + 1;
              return (
                <MeterRow
                  key={meter.id}
                  meter={meter}
                  index={globalIndex}
                  area={areas.cache.get(meter.area.id) ?? null}
                  areaError={!!areas.error}
                  deleteSlot={renderDeleteButton(meter.id, globalIndex)}
                />
              );
            })
          )}
        </tbody>
      </Table>
    </ScrollWrapper>
  );
});
