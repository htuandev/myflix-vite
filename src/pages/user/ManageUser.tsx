import { useState, useEffect } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Form, Input, Modal, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/antd';
import { useDeleteUserMutation, useGetUsersQuery } from '@/api/userApi';
import { Role, colors } from '@/constants';
import { useDocumentTitle } from '@/hooks';
import { Avatar } from '@/shared';
import { IUser } from '@/types';
import { handleFetch, notify } from '@/utils';
import User from './User';

export default function ManageUser() {
  const title = 'Manage Users';
  useDocumentTitle(title);

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const { data, isFetching } = useGetUsersQuery(null, { skip: open });

  const [users, setUsers] = useState(data);
  useEffect(() => {
    setUsers(data);
  }, [data]);

  const openModal = (id: string) => {
    setUserId(id);
    setOpen(true);
  };

  const [onDelete] = useDeleteUserMutation();

  const handleDelete = handleFetch(async (id: string) => {
    const res = await onDelete(id).unwrap();

    notify.success(res.message);
  });

  const [modal, contextHolder] = Modal.useModal();

  const confirmDelete = ({ _id, name, email }: Pick<IUser, '_id' | 'name' | 'email'>) =>
    modal.confirm({
      title: 'Delete user',
      content: `Do you want to delete ${name ? name : email}?`,
      onOk: () => handleDelete(_id),
      okText: 'Delete',
      wrapClassName: 'myflix-modal-confirm',
      maskClosable: false
    });

  const columns: ColumnsType<IUser> = [
    {
      title: 'Avatar',
      dataIndex: 'profileImage',
      key: 'profileImage',
      render: (profileImage) => (
        <div className=' flex-center'>
          <Avatar src={profileImage} className=' w-12' key={profileImage}/>
        </div>
      ),
      align: 'center',
      width: 80
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['lg']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const config =
          role === Role.Admin
            ? { color: colors.primary, children: 'Admin' }
            : { color: colors.dark[700], children: 'User' };
        return <Tag {...config} className=' min-w-[60px] text-center' />;
      },
      align: 'center',
      width: 120,
      responsive: ['md']
    },
    {
      title: 'Update At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => <span>{dayjs(date).format('lll')}</span>,
      align: 'center',
      width: 200,
      responsive: ['xl']
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { _id, name, email }) => (
        <div className=' flex-center gap-4'>
          <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => openModal(_id)} />
          <FaTrash
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => confirmDelete({ _id, name, email })}
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
      <h1 className='text-heading'>{title}</h1>
      <div
        className={twMerge('flex-center mb-4 gap-8', data && data.length > 0 ? 'md:justify-between' : 'md:justify-end')}
      >
        {data && data.length > 0 && (
          <div className=' hidden md:flex md:gap-4'>
            <Form autoComplete='off'>
              <Input
                placeholder={`Search ${data.length} ${data.length === 1 ? 'user' : 'users'} by email`}
                className=' w-full md:w-80'
                name='search'
                onChange={(e) => {
                  const value = e.target.value;
                  const filtered = data.filter((user) => user.email.includes(value));
                  setUsers(filtered);
                }}
                allowClear
              />
            </Form>
            <Select
              options={[
                { value: '', label: 'All User' },
                { value: Role.Admin, label: 'Admin' },
                { value: Role.User, label: 'User' }
              ]}
              defaultValue=''
              className=' w-28'
              onChange={(value) => {
                const filtered = data.filter((user) => (value === '' ? user : user.role === value));
                setUsers(filtered);
              }}
            />
          </div>
        )}
        <Button icon={<HiSquaresPlus />} onClick={() => openModal('')}>
          Add user
        </Button>
      </div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey='_id'
        loading={{ size: 'large', spinning: isFetching }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={{ hideOnSinglePage: true, pageSize: 25, showSizeChanger: false }}
      />
      {open && <User userId={userId} open={open} setOpen={setOpen} />}
      {contextHolder}
    </section>
  );
}
