import { useState } from 'react';
import { FaPenToSquare } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Button from '@/antd/Button';
import { useGetCategoryQuery } from '@/api/categoryApi';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { Category, CategoryType } from '@/types/category';
import CategoryInfo from './CategoryInfo';

export default function ManageCategory({ type }: { type: CategoryType }) {
  const title = `Manage ${type}`;
  useDocumentTitle(title);

  const [open, setOpen] = useState(false);
  const { data, isFetching } = useGetCategoryQuery(type, { skip: open });

  const [categoryId, setCategoryId] = useState(-1);

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
      render: (_, { _id }) => (
        <div className=' flex-center gap-2'>
          <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => openModel(_id)} />
        </div>
      ),
      align: 'center',
      responsive: ['md'],
      width: 200
    }
  ];

  const openModel = (id: number) => {
    setCategoryId(id);
    setOpen(true);
  };

  return (
    <section className=' container'>
      <h1 className=' text-heading'>{title}</h1>
      <div className=' mb-4 flex justify-end gap-8'>
        <Button icon={<HiSquaresPlus />} onClick={() => openModel(-1)}>
          Add {location.pathname.replace('/admin/', '')}
        </Button>
      </div>
      <Table
        dataSource={data ? data : []}
        columns={columns}
        rowKey='_id'
        loading={{ size: 'large', spinning: isFetching }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={{ hideOnSinglePage: true, pageSize: 25, showSizeChanger: false }}
      />
      {open && <CategoryInfo type={type} categoryId={categoryId} open={open} setOpen={setOpen} />}
    </section>
  );
}
