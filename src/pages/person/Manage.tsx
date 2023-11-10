import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
import { Modal, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';
import { useDeletePersonMutation, useGetPeopleQuery } from '@/api/personApi';
import { Gender } from '@/constants/enum';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import Avatar from '@/shared/Avatar';
import { Person } from '@/types/person';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';

export default function Manage() {
  const title = 'Manage Person';
  useDocumentTitle(title);

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || undefined;

  const { data, isFetching } = useGetPeopleQuery({ search: '', page });
  const [onDelete] = useDeletePersonMutation();

  const handleDelete = handleFetch(async (id: string) => {
    const res = await onDelete(id).unwrap();

    notify.success(res.message);
  });

  const [modal, contextHolder] = Modal.useModal();

  const confirmDeleteConfig = ({ _id, name }: Pick<Person, '_id' | 'name'>) => ({
    title: 'Delete Person',
    content: `Do you want to delete ${name}?`,
    onOk: () => handleDelete(_id),
    okText: 'Delete',
    wrapClassName: 'myflix-modal-confirm-delete',
    maskClosable: false
  });

  const columns: ColumnsType<Person> = [
    {
      title: 'Avatar',
      dataIndex: 'profileImage',
      key: 'profileImage',
      render: (profileImage) => (
        <div className=' flex-center'>
          <Avatar src={profileImage} className=' w-16' />
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
      render: (birthday) => <span>{moment(birthday, 'DD/MM/YYYY').format('DD/MM/YYYY')}</span>,
      align: 'center',
      width: 150,
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
      render: (_, { _id, name }) => (
        <div className=' flex-center gap-4'>
          <FaPenToSquare
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => console.log('Update')}
          />
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
