import styled from 'styled-components';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
  min-height: 48px;
  background: #ffffff;
  border-top: 1px solid #eef0f4;
  border-radius: 0 0 8px 8px;
  flex-shrink: 0;
  overflow-x: auto;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 8px 12px;
  border: 1px solid #ced5de;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? '#f2f5f8' : '#ffffff')};
  color: #1f2939;
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #f2f5f8;
  }

  &:disabled {
    color: #697180;
    cursor: default;
    background: #ffffff;
  }
`;

function buildPages(current: number, total: number): (number | '...')[] {
  if (total <= 8) return Array.from({ length: total }, (_, i) => i + 1);

  const show = new Set<number>();
  [1, 2, 3].forEach((p) => show.add(p));
  [total - 2, total - 1, total].forEach((p) => { if (p >= 1) show.add(p); });
  [current - 1, current, current + 1].forEach((p) => {
    if (p >= 1 && p <= total) show.add(p);
  });

  const sorted = [...show].sort((a, b) => a - b);
  const result: (number | '...')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('...');
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  return (
    <Wrapper>
      {pages.map((p, i) =>
        p === '...' ? (
          <PageBtn key={`ellipsis-${i}`} disabled>
            ...
          </PageBtn>
        ) : (
          <PageBtn
            key={p}
            $active={p === currentPage}
            onClick={() => p !== currentPage && onPageChange(p as number)}
          >
            {p}
          </PageBtn>
        )
      )}
    </Wrapper>
  );
}
