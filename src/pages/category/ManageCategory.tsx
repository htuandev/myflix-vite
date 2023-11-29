import { useState, useEffect } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Input, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/antd';
import { useDeleteCategoryMutation, useGetCategoryQuery } from '@/api/categoryApi';
import { useDocumentTitle } from '@/hooks';
import { ICategory, CategoryType } from '@/types';
import { handleFetch, notify } from '@/utils';
import Category from './Category';

export default function ManageCategory({ type }: { type: CategoryType }) {
  const title = `Manage ${type}`;
  useDocumentTitle(title);

  const categoryType = location.pathname.replace('/', '');

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

  const [modal, contextHolder] = Modal.useModal();

  const confirmDelete = ({ _id, name }: Omit<ICategory, 'slug'>) =>
    modal.confirm({
      title: `Delete ${categoryType}`,
      content: `Do you want to delete ${name}?`,
      onOk: () => handleDelete(_id),
      okText: 'Delete',
      wrapClassName: 'myflix-modal-confirm',
      maskClosable: false
    });

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
          <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => openModel(_id)} />
          <FaTrash
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => confirmDelete({ _id, name })}
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
            placeholder={`Search ${data.length} ${data.length === 1 ? categoryType : type.toLowerCase()}`}
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
