import styled from 'styled-components';
import { Icon } from './Icon';

const TYPE_MAP: Record<string, { label: string; iconId: string }> = {
  HotWaterAreaMeter: { label: 'ГВС', iconId: 'counter-hot' },
  ColdWaterAreaMeter: { label: 'ХВС', iconId: 'counter-cold' },
  ElectricAreaMeter: { label: 'ЭЛДТ', iconId: 'counter-electric' },
  HeatAreaMeter: { label: 'ТПЛ', iconId: 'counter-heat' },
};

const FALLBACK = { label: '—', iconId: '' };

interface Props {
  types: string[];
}

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #1d2432;
`;

export function MeterTypeIcon({ types }: Props) {
  const key = types.find((t) => t !== 'AreaMeter') ?? '';
  const { label, iconId } = TYPE_MAP[key] ?? FALLBACK;

  return (
    <Wrapper>
      {iconId && <Icon id={iconId} size={16} />}
      {label}
    </Wrapper>
  );
}
