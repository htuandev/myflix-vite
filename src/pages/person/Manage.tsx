import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Modal, Select, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import Button from '@/antd/Button';
import { useDeletePersonMutation, useGetPeopleQuery } from '@/api/personApi';
import { Gender } from '@/constants/enum';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import ProfileImage from '@/shared/ProfileImage';
import { SearchParams } from '@/types/api';
import { Person } from '@/types/person';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';
import PersonInfo from './PersonInfo';

export default function Manage() {
  const title = 'Manage Person';
  useDocumentTitle(title);

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || undefined;

  const [open, setOpen] = useState(false);
  const [personId, setPersonId] = useState('');

  const openModal = (id: string) => {
    setPersonId(id);
    setOpen(true);
  };

  const [params, setParams] = useState<SearchParams>({
    search: '',
    page,
    sorted: 'updatedAt'
  });

  const { data, isFetching } = useGetPeopleQuery(params, { skip: open });
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

  const [form] = Form.useForm<SearchParams>();

  const onFinish = (values: SearchParams) => setParams((params) => ({ ...params, ...values }));

  const columns: ColumnsType<Person> = [
    {
      title: 'Avatar',
      dataIndex: 'profileImage',
      key: 'profileImage',
      render: (profileImage, { gender }) => (
        <div className=' flex-center p-2'>
          <ProfileImage src={profileImage} gender={gender} size='sm' type='circle' className=' w-12 ' />
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
          <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => openModal(_id)} />
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
          <Form
            className='hidden md:flex'
            form={form}
            layout='inline'
            onFinish={onFinish}
            initialValues={params}
            autoComplete='off'
          >
            <Form.Item name='search' className='myflix-search w-full md:w-80'>
              <Input.Search
                allowClear
                enterButton='Search'
                onSearch={() => form.submit()}
                loading={isFetching && form.isFieldsTouched()}
              />
            </Form.Item>
            <Form.Item name='sorted' className='w-28 '>
              <Select
                placeholder='Sort by'
                options={[
                  { value: 'credits', label: 'Credits' },
                  { value: 'updatedAt', label: 'Updated' }
                ]}
              />
            </Form.Item>
          </Form>
        )}
        <Button icon={<HiSquaresPlus />} onClick={() => openModal('')}>
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
      <PersonInfo personId={personId} open={open} setOpen={setOpen} key={personId} />
      {contextHolder}
    </section>
  );
}
