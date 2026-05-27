import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const SkeletonRow = styled.tr`
  border-bottom: 1px solid #e0e5eb;

  &:last-child {
    border-bottom: none;
  }
`;

const SkeletonCell = styled.td`
  padding: 0 12px;
  height: 52px;
  vertical-align: middle;
`;

const SkeletonBar = styled.span<{ $w?: string }>`
  display: block;
  height: 12px;
  width: ${({ $w }) => $w ?? '70%'};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f3f7 25%, #e4e8ef 50%, #f0f3f7 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

const COLS: Array<{ w: string }> = [
  { w: '50%' },
  { w: '60%' },
  { w: '70%' },
  { w: '40%' },
  { w: '55%' },
  { w: '80%' },
  { w: '65%' },
  { w: '0%' },
];

export function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => (
        <SkeletonRow key={i}>
          {COLS.map((col, j) => (
            <SkeletonCell key={j}>
              {col.w !== '0%' && <SkeletonBar $w={col.w} />}
            </SkeletonCell>
          ))}
        </SkeletonRow>
      ))}
    </>
  );
}
