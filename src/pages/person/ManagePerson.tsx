import { useEffect, useState } from 'react';
import { HiSquaresPlus } from 'react-icons/hi2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Modal, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { Button, Pagination, Search } from '@/antd';
import { useDeletePersonMutation, useGetPeopleQuery } from '@/api/personApi';
import { Gender, routePaths } from '@/constants';
import { useDocumentTitle } from '@/hooks';
import { Icon, ProfileImage } from '@/shared';
import { IPerson } from '@/types';
import { confirmDelete, handleFetch, notify } from '@/utils';
import Person from './Person';

export default function ManagePerson() {
  const title = 'Manage Person';
  useDocumentTitle(title);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';

  const [open, setOpen] = useState(false);
  const [personId, setPersonId] = useState('');

  const openModal = (id: string) => {
    setPersonId(id);
    setOpen(true);
  };

  const [search, setSearch] = useState('');

  const { data, isFetching, error } = useGetPeopleQuery({ search, page }, { skip: open });
  const [onDelete] = useDeletePersonMutation();

  useEffect(() => {
    if (error) {
      navigate(routePaths.person);
    }
  }, [error, navigate]);

  const handleDelete = handleFetch(async (id: string) => {
    const res = await onDelete(id).unwrap();
    notify.success(res.message);
  });

  const [{ confirm }, contextHolder] = Modal.useModal();

  const columns: ColumnsType<IPerson> = [
    {
      title: 'Avatar',
      dataIndex: 'profileImage',
      key: 'profileImage',
      render: (profileImage, { gender }) => (
        <div className=' flex-center p-2'>
          <ProfileImage
            src={profileImage}
            gender={gender}
            size='sm'
            type='circle'
            className=' w-12 '
            key={profileImage ? profileImage : gender}
          />
        </div>
      ),
      align: 'center',
      width: 100
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
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        const config = gender === Gender.Female ? { children: 'Female' } : { children: 'Male' };
        return (
          <div className=' flex-center'>
            <Tag
              {...config}
              className={twMerge(
                'flex-center h-8 w-20 select-none border-info bg-transparent text-base',
                gender === Gender.Female && 'border-primary'
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
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
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
      render: (_, { _id, name }) => (
        <div className=' flex-center gap-4'>
          <Icon action='edit' onClick={() => openModal(_id)} />
          <Icon
            action='delete'
            id={_id}
            onClick={() => confirmDelete({ confirm, _id, name, type: 'Person', onDelete: () => handleDelete(_id) })}
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
      <div className='flex-center mb-4 gap-8 md:justify-between'>
        {data && (
          <Search
            onSearch={(value) => setSearch(value.trim())}
            disabled={isFetching}
            placeholder={`Search ${data.totalRecords} people`}
          />
        )}
        <Button icon={<HiSquaresPlus />} onClick={() => openModal('')} className='hidden md:flex'>
          Add person
        </Button>
      </div>
      <Table
        dataSource={data?.results}
        columns={columns}
        rowKey='_id'
        loading={{ size: 'large', spinning: isFetching }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={false}
      />
      {data && data.totalPages > 1 && <Pagination page={page} totalResults={data.totalResults} />}
      {open && <Person personId={personId} open={open} setOpen={setOpen} key={personId} />}
      {contextHolder}
    </section>
  );
}
