import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Link, useSearchParams } from 'react-router-dom';
import { Input, Modal, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import Button from '@/antd/Button';
import { useDeleteMovieMutation, useGetMoviesQuery } from '@/api/movieApi';
import { ContentType } from '@/constants/enum';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import Poster from '@/shared/Poster';
import { Movie } from '@/types/movie';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';

export default function Manage() {
  const title = 'Manage Movie';
  useDocumentTitle(title);

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || undefined;
  const [search, setSearch] = useState('');

  const { data, isFetching } = useGetMoviesQuery({ page, search });
  const [onDelete] = useDeleteMovieMutation();

  const handleDelete = handleFetch(async (id: string) => {
    const res = await onDelete(id).unwrap();

    notify.success(res.message);
  });

  const [modal, contextHolder] = Modal.useModal();

  const confirmDeleteConfig = ({ _id, name }: Pick<Movie, '_id' | 'name'>) => ({
    title: 'Delete Movie',
    content: `Do you want to delete ${name}?`,
    onOk: () => handleDelete(_id),
    okText: 'Delete',
    wrapClassName: 'myflix-modal-confirm-delete',
    maskClosable: false
  });

  const columns: ColumnsType<Movie> = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      render: (poster) => (
        <div className=' flex-center p-2'>
          <Poster src={poster} className=' w-12 ' />
        </div>
      ),
      align: 'center',
      width: 100
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { aka }) => (
        <>
          <p>{name}</p>
          <p className=' text-sm text-dark-100/60'>{aka[0]}</p>
        </>
      )
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['lg']
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = type === ContentType.Movie ? { children: 'Movie' } : { children: 'TV Series' };
        return (
          <div className=' flex-center'>
            <Tag
              {...config}
              className={twMerge(
                'flex-center h-8 w-20 select-none border-info bg-transparent text-base',
                type === ContentType.TVSeries && 'border-primary'
              )}
            />
          </div>
        );
      },
      align: 'center',
      width: 120,
      responsive: ['md']
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      align: 'center',
      width: 150,
      responsive: ['md']
    },
    {
      title: 'Update At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: Date) => <span>{dayjs(date).format('lll')}</span>,
      align: 'center',
      width: 200,
      responsive: ['xl']
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { _id, name, slug }) => (
        <div className=' flex-center gap-4'>
          <Link to={`/admin/movie/${slug}-${_id}`}>
            {' '}
            <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' />
          </Link>
          <FaTrash
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => modal.confirm(confirmDeleteConfig({ _id, name }))}
          />
        </div>
      ),
      align: 'center',
      responsive: ['md'],
      width: 120
    }
  ];

  return (
    <section className=' container'>
      <h1 className=' text-heading'>{title}</h1>
      <div className={twMerge('flex-center mb-4 gap-8', data ? 'md:justify-between' : 'md:justify-end')}>
        {data && (
          <Input.Search
            className='myflix-search w-full md:w-80'
            allowClear
            enterButton='Search'
            onSearch={(value) => setSearch(value)}
            loading={isFetching}
          />
        )}
        <Link to='/admin/movie/add'>
          <Button icon={<HiSquaresPlus />}>Add movie</Button>
        </Link>
      </div>
      <Table
        dataSource={data?.results}
        columns={columns}
        rowKey='_id'
        loading={{ size: 'large', spinning: isFetching }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={false}
      />
      {contextHolder}
    </section>
  );
}
