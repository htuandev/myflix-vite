import { useEffect, useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { Tag, Table, Modal, ConfigProvider, Empty } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/antd';
import { useDeleteCastMutation, useGetCastsQuery } from '@/api/castApi';
import { Gender, routePaths } from '@/constants';
import { useDocumentTitle, useValidId } from '@/hooks';
import { Backdrop, Poster, ProfileImage } from '@/shared';
import { ICast } from '@/types';
import { handleFetch, notify } from '@/utils';
import AddCast from './AddCast';
import EditCast from './EditCast';

export default function ManageCast() {
  const { id } = useValidId(routePaths.movie);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [castId, setCastId] = useState('');
  const { data, error, isFetching } = useGetCastsQuery(id, { skip: open || openEdit });

  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      navigate(routePaths.movie);
    }
  }, [error, navigate]);

  const title = data ? `${data.movie.name} | Manage Cast` : 'Manage Cast';
  useDocumentTitle(title);

  const [onDelete] = useDeleteCastMutation();

  const handleDelete = handleFetch(async (id: string) => {
    const res = await onDelete(id).unwrap();

    notify.success(res.message);
  });

  const [modal, contextHolder] = Modal.useModal();

  const confirmDelete = ({ _id, name }: Pick<ICast, '_id' | 'name'>) =>
    modal.confirm({
      title: 'Delete Cast',
      content: `Do you want to delete ${name}?`,
      onOk: () => handleDelete(_id),
      okText: 'Delete',
      wrapClassName: 'myflix-modal-confirm',
      maskClosable: false
    });

  const columns: ColumnsType<ICast> = [
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
      title: 'Character',
      dataIndex: 'character',
      key: 'character',
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
      title: 'Added At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
          <FaPenToSquare
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => {
              setCastId(_id);
              setOpenEdit(true);
            }}
          />
          <FaTrash
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => confirmDelete({ _id, name })}
          />
        </div>
      ),
      align: 'center',
      responsive: ['md'],
      width: 120
    }
  ];

  return (
    <section className=' min-h-[calc(100vh-64px)]'>
      <Backdrop
        backdropUrl={data && (data.movie.backdrop || data.movie.thumbnail)}
        backdropColor={data && data.movie.backdropColor}
      >
        <div className='flex items-center gap-4'>
          <Poster src={data?.movie.poster} className=' w-20 rounded-md md:w-32 lg:w-44' size='lg' />
          <div>
            {data && (
              <h1 className=' text-heading'>
                {data.movie.name} <span className=' font-medium'>({data.movie.year})</span>
              </h1>
            )}
            <Button icon={<HiSquaresPlus />} type='primary' onClick={() => setOpen(true)} className=' hidden md:flex'>
              Add Cast
            </Button>
          </div>
        </div>
      </Backdrop>
      <div className=' p-4 lg:p-8'>
        <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}>
          <Table
            dataSource={data?.casts}
            columns={columns}
            rowKey='_id'
            scroll={{ scrollToFirstRowOnChange: true, x: true }}
            pagination={{ hideOnSinglePage: true, pageSize: 10, showSizeChanger: false }}
            loading={{ size: 'large', spinning: isFetching }}
          />
        </ConfigProvider>
      </div>
      {contextHolder}
      {open && <AddCast movieId={id} open={open} setOpen={setOpen} />}
      {openEdit && <EditCast castId={castId} open={openEdit} setOpen={setOpenEdit} />}
    </section>
  );
}
