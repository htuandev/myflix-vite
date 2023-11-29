import { useEffect, useState } from 'react';
import { FaEye, FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ConfigProvider, Empty, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Button, Pagination } from '@/antd';
import { useDeleteEpisodeMutation, useGetEpisodesQuery } from '@/api/episodeApi';
import { ContentType } from '@/constants';
import { useDocumentTitle, useValidId } from '@/hooks';
import { Backdrop, Poster, Thumbnail, VideoPlayer } from '@/shared';
import { IEpisodeInfo } from '@/types';
import { handleFetch, notify } from '@/utils';
import AddEpisodes from './AddEpisodes';
import Episode from './Episode';

export default function ManageEpisode() {
  const { id } = useValidId('/admin/movie');

  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [episodeId, setEpisodeId] = useState('');

  const openModel = (id = '') => {
    setEpisodeId(id);
    setOpen(true);
  };
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';

  const { data, error, isFetching } = useGetEpisodesQuery({ id, page }, { skip: open });

  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      navigate(pathname);
    }
  }, [error, navigate, pathname]);

  const title = data ? `${data.movie.name} | Manage Episode` : 'Manage Episode';
  useDocumentTitle(title);

  const [onDelete] = useDeleteEpisodeMutation();

  const [modal, contextHolder] = Modal.useModal();

  const confirmDeleteConfig = ({ _id, name }: Pick<IEpisodeInfo, '_id' | 'name'>) =>
    modal.confirm({
      title: 'Delete Episode',
      content: `Do you want to delete ${name}?`,
      onOk: handleFetch(async () => {
        const res = await onDelete(_id).unwrap();

        notify.success(res.message);
      }),
      okText: 'Delete',
      wrapClassName: 'myflix-modal-confirm',
      maskClosable: false
    });

  const previewVideo = (name: string, source: string, thumbnail: string) =>
    modal.info({
      title: <span className=' flex-center'>{name}</span>,
      content: <VideoPlayer source={source} thumbnail={thumbnail} />,
      maskClosable: false,
      wrapClassName: 'myflix-modal-confirm preview',
      centered: true,
      okText: 'Back',
      width: 800,
      zIndex: 5000
    });

  const columns: ColumnsType<IEpisodeInfo> = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail) => (
        <div className=' flex-center p-2'>
          <Thumbnail
            src={data?.movie.type === ContentType.Movie ? data?.movie.thumbnail : thumbnail}
            className=' w-full'
          />
        </div>
      ),
      align: 'center',
      width: 160
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      responsive: ['lg']
    },
    {
      title: 'Updated At',
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
      render: (_, { _id, name, link, thumbnail }) => (
        <div className=' flex-center gap-4'>
          <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' onClick={() => openModel(_id)} />
          {data && (
            <FaEye
              className=' cursor-pointer text-xl hover:text-dark-100'
              onClick={() => previewVideo(name, link, thumbnail || data.movie.thumbnail)}
            />
          )}
          <FaTrash
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => confirmDeleteConfig({ _id, name })}
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
                {data.movie.name} {data.movie.year}
              </h1>
            )}
            <div className=' flex gap-4'>
              {data &&
                (data.movie.type === ContentType.Movie
                  ? data.episodes.length === 0
                  : data.totalEpisodes < (data.movie.episodes as number)) && (
                  <Button
                    icon={<HiSquaresPlus />}
                    type='primary'
                    onClick={() => openModel()}
                    className=' hidden md:flex'
                  >
                    Add Episode
                  </Button>
                )}
              {data &&
                data.movie.type === ContentType.TVSeries &&
                data.totalEpisodes < (data.movie.episodes as number) && (
                  <Button icon={<HiSquaresPlus />} onClick={() => setOpenAdd(true)} className=' hidden md:flex'>
                    Add Episodes
                  </Button>
                )}
            </div>
          </div>
        </div>
      </Backdrop>
      <div className=' p-4 lg:p-8'>
        <ConfigProvider renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}>
          <Table
            dataSource={data?.episodes}
            columns={columns}
            rowKey='_id'
            scroll={{ scrollToFirstRowOnChange: true, x: true }}
            pagination={{ hideOnSinglePage: true, pageSize: 24, showSizeChanger: false }}
            loading={{ size: 'large', spinning: isFetching }}
            key={data?.movie._id}
          />
        </ConfigProvider>
        {data && data.totalPages > 1 && <Pagination page={page} totalResults={data.totalEpisodes} />}
      </div>
      {contextHolder}
      {open && data && (
        <Episode
          movieId={id}
          episodeId={episodeId}
          episodes={data.totalEpisodes + 1}
          type={data.movie.type}
          open={open}
          setOpen={setOpen}
        />
      )}
      {openAdd && <AddEpisodes movieId={id} open={openAdd} setOpen={setOpenAdd} />}
    </section>
  );
}
