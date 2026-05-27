import styled from 'styled-components';

const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Th = styled.th`
  padding: 8px 12px;
  text-align: left;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #697180;
  background: #f0f3f7;
  white-space: nowrap;
  height: 32px;
`;

const ThCenter = styled(Th)`
  text-align: center;
`;

export function MetersTableHeader() {
  return (
    <Thead>
      <tr>
        <ThCenter style={{ width: 48 }}>№</ThCenter>
        <Th style={{ width: 120 }}>Тип</Th>
        <Th style={{ width: 160 }}>Дата установки</Th>
        <Th style={{ width: 128 }}>Автоматический</Th>
        <Th style={{ width: 146 }}>Текущие показания</Th>
        <Th style={{ minWidth: 430 }}>Адрес</Th>
        <Th>Примечание</Th>
        <Th style={{ width: 64 }} />
      </tr>
    </Thead>
  );
}
