import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaFileCirclePlus } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, Table, Modal, ConfigProvider, Empty } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/antd';
import { useDeleteCastMutation, useGetCastsQuery } from '@/api/castApi';
import { Gender, routePaths } from '@/constants';
import { useDocumentTitle, useValidId } from '@/hooks';
import { Backdrop, Icon, ProfileImage } from '@/shared';
import { ICast } from '@/types';
import { confirmDelete, handleFetch, notify } from '@/utils';
import Person from '../person/Person';
import AddCast from './AddCast';
import EditCast from './EditCast';

export default function ManageCast() {
  const { id } = useValidId(routePaths.movie);

  const [open, setOpen] = useState(false);
  const [openPerson, setOpenPeron] = useState(false);

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

  const [{ confirm }, contextHolder] = Modal.useModal();

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
          <Icon
            action='edit'
            onClick={() => {
              setCastId(_id);
              setOpenEdit(true);
            }}
          />
          <Icon
            action='delete'
            id={_id}
            onClick={() => confirmDelete({ confirm, _id, name, type: 'Cast', onDelete: () => handleDelete(_id) })}
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
        poster={data && data.movie.poster}
        name={data && data.movie.name}
        year={data && data.movie.year}
      >
        <div className=' flex gap-4'>
          <Button icon={<HiSquaresPlus />} type='primary' onClick={() => setOpen(true)} className=' hidden md:flex'>
            Add Cast
          </Button>
          <Button icon={<HiSquaresPlus />} onClick={() => setOpenPeron(true)} className=' hidden md:flex'>
            Add Person
          </Button>
        </div>
      </Backdrop>
      <div className=' max-screen p-4 pt-0 lg:p-8 lg:pt-0'>
        {data && (
          <div className=' flex-center mb-4 justify-between gap-4'>
            <Link to={`${routePaths.movie}/${data.movie.slug}-${data.movie._id}`}>
              <Button icon={<FaEdit />}>Edit Movie</Button>
            </Link>
            <Link to={`${routePaths.episode}/${data.movie.slug}-${data.movie._id}`}>
              <Button icon={<FaFileCirclePlus />}>Manage Episode</Button>
            </Link>
          </div>
        )}
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
      {openPerson && <Person open={openPerson} setOpen={setOpenPeron} />}
    </section>
  );
}
