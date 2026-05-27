import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useStore } from '../../../app/providers/useStore';
import { MetersTable } from '../../../widgets/meters-table';
import { Pagination } from '../../../features/meters-pagination';
import { METERS_PER_PAGE } from '../../../shared/config/constants';

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  height: 100vh;
  height: 100dvh;
  background: #f8f9fa;
  position: relative;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    gap: 8px;
  }
`;

const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #1f2939;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 18px;
    line-height: 24px;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e5eb;
  border-radius: 12px;
  overflow: hidden;
  flex: 1;
  min-height: 0;
  width: 100%;
`;

function getPageFromUrl(): number {
  const p = Number(new URLSearchParams(window.location.search).get('page'));
  return p >= 1 ? p : 1;
}

function setPageInUrl(page: number) {
  const params = new URLSearchParams(window.location.search);
  params.set('page', String(page));
  history.replaceState(null, '', `?${params}`);
}

export const MetersPage = observer(function MetersPage() {
  const { meters } = useStore();

  useEffect(() => {
    const page = getPageFromUrl();
    meters.fetchMeters((page - 1) * METERS_PER_PAGE);
  }, []);

  function handlePageChange(page: number) {
    setPageInUrl(page);
    meters.goToPage(page);
  }

  return (
    <PageLayout>
      <Title>Список счётчиков</Title>
      <Card>
        <MetersTable />
        <Pagination
          currentPage={meters.currentPage}
          totalPages={meters.totalPages}
          onPageChange={handlePageChange}
        />
      </Card>
    </PageLayout>
  );
});
