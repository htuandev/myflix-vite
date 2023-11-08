import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useGetCategoryQuery } from '@/api/categoryApi';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { Category, CategoryType } from '@/types/category';

export default function ManageCategory({ type }: { type: CategoryType }) {
  const title = `Manage ${type}`;
  useDocumentTitle(title);

  const { data, isFetching } = useGetCategoryQuery(type);

  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 120
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['lg']
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <div className=' d-center gap-2'></div>,
      align: 'center',
      responsive: ['md'],
      width: 200
    }
  ];

  return (
    <section className=' container'>
      <h1 className=' text-heading'>{title}</h1>
      <Table
        dataSource={data ? data : []}
        columns={columns}
        rowKey='_id'
        loading={isFetching}
        scroll={{ scrollToFirstRowOnChange: true }}
        pagination={{ hideOnSinglePage: true }}
        onRow={(category) => {
          return {
            onDoubleClick: () => {
              console.log('🚀 ~ ManageCategory:', category);
            }
          };
        }}
      />
    </section>
  );
}
