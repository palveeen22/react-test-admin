import { useEffect } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useStore } from '../../../app/providers/useStore';
import { MeterRow } from '../../../entities/meter/ui/MeterRow';
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
  color: #1D2432;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
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

  return (
    <ScrollWrapper>
      <Table>
        <MetersTableHeader />
        <tbody data-full={meters.items.length === 20 ? true : undefined}>
          {meters.isLoading ? (
            <SkeletonRows />
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
            meters.items.map((meter, i) => (
              <MeterRow
                key={meter.id}
                meter={meter}
                index={meters.offset + i + 1}
                area={areas.cache.get(meter.area.id) ?? null}
                onDelete={(id) => handleDeleteRequest(id, meters.offset + i + 1)}
                isDeleting={meters.isDeleting}
              />
            ))
          )}
        </tbody>
      </Table>
    </ScrollWrapper>
  );
});
