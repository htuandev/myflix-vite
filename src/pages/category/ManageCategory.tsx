import { useState, useEffect } from 'react';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Input, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/antd';
import { useDeleteCategoryMutation, useGetCategoryQuery } from '@/api/categoryApi';
import { useDocumentTitle } from '@/hooks';
import { Icon } from '@/shared';
import { ICategory, CategoryType } from '@/types';
import { confirmDelete, handleFetch, notify } from '@/utils';
import Category from './Category';

export default function ManageCategory({ type }: { type: CategoryType }) {
  const categoryType = type === 'Countries' ? 'Country' : type === 'Genres' ? 'Genre' : 'Network';

  const title = `Manage ${type}`;
  useDocumentTitle(title);

  const [open, setOpen] = useState(false);
  const { data, isFetching } = useGetCategoryQuery(type, { skip: open });

  const [categories, setCategories] = useState(data);
  useEffect(() => {
    setCategories(data);
  }, [data]);

  const [onDelete] = useDeleteCategoryMutation();

  const [categoryId, setCategoryId] = useState(-1);

  const openModel = (id: number) => {
    setCategoryId(id);
    setOpen(true);
  };

  const handleDelete = handleFetch(async (id: number) => {
    const res = await onDelete({ type, id }).unwrap();

    notify.success(res.message);
  });

  const [{ confirm }, contextHolder] = Modal.useModal();

  const columns: ColumnsType<ICategory> = [
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
      render: (_, { _id, name }) => (
        <div className=' flex-center gap-4'>
          <Icon action='edit' onClick={() => openModel(_id)} />
          <Icon
            action='delete'
            id={_id.toString()}
            onClick={() => confirmDelete({ confirm, _id, name, type: categoryType, onDelete: () => handleDelete(_id) })}
          />
        </div>
      ),
      align: 'center',
      responsive: ['md'],
      width: 200
    }
  ];

  return (
    <section className=' container'>
      <h1 className=' text-heading'>{title}</h1>
      <div
        className={twMerge('flex-center mb-4 gap-8', data && data.length > 0 ? 'md:justify-between' : 'md:justify-end')}
      >
        {data && data.length > 0 && (
          <Input
            placeholder={`Search ${data.length} ${type.toLowerCase()}`}
            className=' hidden w-full md:flex md:w-80'
            name='search'
            onChange={(e) => {
              const value = e.target.value;
              const filtered = data.filter((category) => category.name.includes(value));
              setCategories(filtered);
            }}
            allowClear
          />
        )}
        <Button icon={<HiSquaresPlus />} onClick={() => openModel(-1)}>
          Add {categoryType}
        </Button>
      </div>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey='_id'
        loading={{ size: 'large', spinning: isFetching }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={{ hideOnSinglePage: true, pageSize: 25, showSizeChanger: false }}
      />
      {open && (
        <Category type={type} categoryId={categoryId} open={open} setOpen={setOpen} categoryType={categoryType} />
      )}
      {contextHolder}
    </section>
  );
}
