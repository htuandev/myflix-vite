import { useState, useEffect } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useGetUsersQuery } from '@/api/userApi';
import colors from '@/constants/colors';
import { Role } from '@/constants/enum';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { User } from '@/types/user';

export default function ManageUser() {
  const title = 'Manage Users';
  useDocumentTitle(title);

  const { data, isFetching } = useGetUsersQuery();

  const [users, setUsers] = useState(data);
  useEffect(() => {
    setUsers(data);
  }, [data]);

  const defaultProfileImage = 'https://image.tmdb.org/t/p/w470_and_h470_face/uqZ8aIFiitJhs2aP2hkVGgqEV1E.jpg';

  const columns: ColumnsType<User> = [
    {
      title: 'Avatar',
      dataIndex: 'profileImage',
      key: 'profileImage',
      render: (profileImage) => (
        <div className=' flex-center'>
          <img src={profileImage || defaultProfileImage} loading='lazy' className=' w-12 rounded-full' />
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
          role === Role.Admin ? { color: colors.primary, children: 'Admin' } : { color: colors.info, children: 'User' };
        return <Tag {...config} className=' min-w-[60px] text-center' />;
      },
      align: 'center',
      filters: [
        {
          text: 'Admin',
          value: Role.Admin
        },
        {
          text: 'User',
          value: Role.User
        }
      ],
      onFilter: (value, record) => record.role === value,
      width: 120,
      responsive: ['lg']
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
      render: () => (
        <div className=' flex-center gap-4'>
          <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => console.log('Edit')} />
          <FaTrash className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => console.log('Delete')} />
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
      <Table
        dataSource={users}
        columns={columns}
        rowKey='_id'
        loading={{ size: 'large', spinning: isFetching }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={{ hideOnSinglePage: true, pageSize: 25, showSizeChanger: false }}
      />
    </section>
  );
}
