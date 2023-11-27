import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination as AntdPagination } from 'antd';

type Props = {
  page: string;
  totalResults: number;
};

export default function Pagination({ page, totalResults }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <AntdPagination
      className='myflix-pagination mt-4 flex flex-wrap items-center justify-end gap-y-4'
      current={parseInt(page)}
      pageSize={24}
      total={totalResults}
      showSizeChanger={false}
      responsive
      hideOnSinglePage
      onChange={(page) => navigate(`${pathname}?page=${page}`)}
    />
  );
}
