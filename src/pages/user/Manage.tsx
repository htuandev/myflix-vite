import { useState, useEffect } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Form, Input, Modal, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';
import Button from '@/antd/Button';
import { useDeleteUserMutation, useGetUsersQuery } from '@/api/userApi';
import colors from '@/constants/colors';
import { Role } from '@/constants/enum';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import drinkCoffeeAvatar from '@/images/drink_coffee_male.svg';
import { User } from '@/types/user';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';
import UserInfo from './UserInfo';

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

  const openModel = (id: string) => {
    setUserId(id);
    setOpen(true);
  };

  const [onDelete] = useDeleteUserMutation();

  const handleDelete = handleFetch(async (id: string) => {
    const res = await onDelete(id).unwrap();

    notify.success(res.message);
  });

  const [modal, contextHolder] = Modal.useModal();

  const confirmDeleteConfig = ({ _id, name, email }: Pick<User, '_id' | 'name' | 'email'>) => ({
    title: 'Delete user',
    content: `Do you want to delete ${name ? name : email}?`,
    onOk: () => handleDelete(_id),
    okText: 'Delete',
    wrapClassName: 'myflix-modal-confirm-delete',
    maskClosable: false
  });

  const columns: ColumnsType<User> = [
    {
      title: 'Avatar',
      dataIndex: 'profileImage',
      key: 'profileImage',
      render: (profileImage) => (
        <div className=' flex-center'>
          <img
            loading='lazy'
            src={profileImage || drinkCoffeeAvatar}
            onError={(e) => (e.currentTarget.src = drinkCoffeeAvatar)}
            className='aspect-square w-12 rounded-full'
          />
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
      render: (date) => <span>{moment(date).format('lll')}</span>,
      align: 'center',
      width: 200,
      responsive: ['xl']
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { _id, name, email }) => (
        <div className=' flex-center gap-4'>
          <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => openModel(_id)} />
          <FaTrash
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => modal.confirm(confirmDeleteConfig({ _id, name, email }))}
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
            <Form>
              <Input
                placeholder={`Search ${data.length} ${data.length === 1 ? 'user' : 'users'} by email`}
                className=' w-full md:w-80'
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
        <Button icon={<HiSquaresPlus />} onClick={() => openModel('')}>
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
      {open && <UserInfo userId={userId} open={open} setOpen={setOpen} />}
      {contextHolder}
    </section>
  );
}
