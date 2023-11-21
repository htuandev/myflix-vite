import { useEffect } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { Tag, Table, Modal, ConfigProvider, Empty } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import Button from '@/antd/Button';
import { useDeleteCastMutation, useGetCastsQuery } from '@/api/castApi';
import { Gender } from '@/constants/enum';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useValidId from '@/hooks/useValidId';
import Hamster from '@/layouts/Hamster';
import Poster from '@/shared/Poster';
import ProfileImage from '@/shared/ProfileImage';
import { Cast } from '@/types/type';
import { hexToRgba } from '@/utils';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';

export default function ManageCast() {
  const { id } = useValidId('/admin/movie');
  const { data, error } = useGetCastsQuery(id);

  const backdropUrl = data?.movie.backdrop
    ? data?.movie.backdrop.replace('/original/', '/w1920_and_h427_multi_faces/')
    : data?.movie.thumbnail.replace('/original/', '/w1920_and_h427_multi_faces/');

  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      navigate('/admin/movie');
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

  const confirmDeleteConfig = ({ _id, name }: Pick<Cast, '_id' | 'name'>) => ({
    title: 'Delete Cast',
    content: `Do you want to delete ${name}?`,
    onOk: () => handleDelete(_id),
    okText: 'Delete',
    wrapClassName: 'myflix-modal-confirm',
    maskClosable: false
  });

  const columns: ColumnsType<Cast> = [
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

  return data ? (
    <section className=' min-h-[calc(100vh-64px)]'>
      <div className=' mb-4 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div
          style={{ backgroundColor: hexToRgba(data.movie.backdropColor, 0.8) }}
          className='p-4 pl-12 lg:p-8 lg:pl-16'
        >
          <div className='flex items-center gap-4'>
            <Poster src={data.movie.poster} className=' w-20 rounded-md md:w-32 lg:w-44' size='lg' />
            <div>
              <h1 className=' text-heading'>
                {data.movie.name} {data.movie.year}
              </h1>
              <Button icon={<HiSquaresPlus />} type='primary'>
                Add Cast
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className=' p-4 lg:p-8'>
        <ConfigProvider renderEmpty={() => <Empty  image={Empty.PRESENTED_IMAGE_SIMPLE} />}>
          <Table
            dataSource={data.casts}
            columns={columns}
            rowKey='_id'
            scroll={{ scrollToFirstRowOnChange: true, x: true }}
            pagination={{ hideOnSinglePage: true, pageSize: 5, showSizeChanger: false }}
          />
        </ConfigProvider>
      </div>
      {contextHolder}
    </section>
  ) : (
    <Hamster />
  );
}
