import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { IMeter } from '../model/MeterModel';
import type { IArea } from '../../area';
import { MeterTypeIcon } from '../../../shared/ui/MeterTypeIcon';
import { formatDate } from '../../../shared/lib/formatDate';
import { DeleteButton } from '../../../features/delete-meter';

interface Props {
  meter: IMeter;
  index: number;
  area: IArea | null;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const Row = styled.tr`
  background: #ffffff;
  border-bottom: 1px solid #e0e5eb;
  cursor: pointer;
  transition: background 0.1s;


  &:hover {
    background: #f7f8f9;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover td:last-child > button {
    visibility: visible;
  }
`;

const Td = styled.td`
  padding: 0 12px;
  height: 52px;
  vertical-align: middle;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #1f2939;
  white-space: nowrap;
`;

const TdNum = styled(Td)`
  text-align: center;
  color: #5e6674;
  width: 48px;
`;

const TdAddress = styled(Td)`
  white-space: normal;
  min-width: 430px;
`;

const TdNote = styled(Td)`
  white-space: normal;
  color: #5e6674;
`;

const TdDelete = styled(Td)`
  width: 64px;
  text-align: right;
`;

function buildAddress(area: IArea | null): string {
  if (!area) return '—';
  return `${area.house.address}, ${area.str_number_full}`;
}

export const MeterRow = observer(function MeterRow({
  meter,
  index,
  area,
  onDelete,
  isDeleting,
}: Props) {
  return (
    <Row>
      <TdNum>{index}</TdNum>
      <Td style={{ width: 120 }}>
        <MeterTypeIcon types={meter._type} />
      </Td>
      <Td style={{ width: 160 }}>{formatDate(meter.installation_date)}</Td>
      <Td style={{ width: 128 }}>
        {meter.is_automatic === null ? '—' : meter.is_automatic ? 'да' : 'нет'}
      </Td>
      <Td style={{ width: 146 }}>
        {meter.initial_values.join(', ') || '—'}
      </Td>
      <TdAddress>{buildAddress(area)}</TdAddress>
      <TdNote>{meter.description ?? '—'}</TdNote>
      <TdDelete>
        <DeleteButton
          onDelete={() => onDelete(meter.id)}
          disabled={isDeleting}
          hidden
        />
      </TdDelete>
    </Row>
  );
});
