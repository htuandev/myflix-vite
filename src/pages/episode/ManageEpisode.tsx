import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { HiSquaresPlus } from 'react-icons/hi2';
import { IoPersonAdd } from 'react-icons/io5';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ConfigProvider, Empty, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Button, Pagination } from '@/antd';
import { useDeleteEpisodeMutation, useGetEpisodesQuery } from '@/api/episodeApi';
import { ContentType, routePaths } from '@/constants';
import { useDocumentTitle, useValidId } from '@/hooks';
import { Backdrop, Icon, Thumbnail, VideoPlayer } from '@/shared';
import { IEpisodeInfo } from '@/types';
import { confirmDelete, handleFetch, infoPreview, notify } from '@/utils';
import AddEpisodes from './AddEpisodes';
import Episode from './Episode';

export default function ManageEpisode() {
  const { id } = useValidId(routePaths.movie);

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

  const { data, error, isFetching, isLoading } = useGetEpisodesQuery({ id, page }, { skip: open });

  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      navigate(pathname);
    }
  }, [error, navigate, pathname]);

  const title = data ? `${data.movie.name} | Manage Episode` : 'Manage Episode';
  useDocumentTitle(title);

  const [onDelete] = useDeleteEpisodeMutation();
  const handleDelete = handleFetch(async (_id: string) => {
    const res = await onDelete(_id).unwrap();
    notify.success(res.message);
  });

  const [{ confirm, info }, contextHolder] = Modal.useModal();

  const previewVideo = (title: string, id: string, source: string, thumbnail: string) =>
    infoPreview({ info, id, title, content: <VideoPlayer source={source} thumbnail={thumbnail} />, width: 800 });

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
            key={thumbnail}
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
      render: (_, { _id, name, link, thumbnail }) => {
        const previewId = `preview_${_id}`;
        return (
          <div className=' flex-center gap-4'>
            <Icon action='edit' onClick={() => openModel(_id)} />
            <Icon
              action='preview'
              id={previewId}
              onClick={() => previewVideo(name, previewId, link, thumbnail || data?.movie.thumbnail || '')}
            />
            <Icon
              action='delete'
              id={_id}
              onClick={() => confirmDelete({ confirm, _id, name, type: 'Episode', onDelete: () => handleDelete(_id) })}
            />
          </div>
        );
      },
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
        isLoading={isLoading}
      >
        <div className=' flex gap-4'>
          {data &&
            (data.movie.type === ContentType.Movie
              ? data.episodes.length === 0
              : data.totalEpisodes < (data.movie.episodes as number)) && (
              <Button icon={<HiSquaresPlus />} type='primary' onClick={() => openModel()} className=' hidden md:flex'>
                Add Episode
              </Button>
            )}
          {data && data.movie.type === ContentType.TVSeries && data.totalEpisodes < (data.movie.episodes as number) && (
            <Button icon={<HiSquaresPlus />} onClick={() => setOpenAdd(true)} className=' hidden md:flex'>
              Add Episodes
            </Button>
          )}
        </div>
      </Backdrop>
      <div className=' max-screen p-4 pt-0 lg:p-8 lg:pt-0'>
        {data && (
          <div className=' flex-center mb-4 justify-between gap-4'>
            <Link to={`${routePaths.movie}/${data.movie.slug}-${data.movie._id}`}>
              <Button icon={<FaEdit />}>Edit Movie</Button>
            </Link>
            <Link to={`${routePaths.cast}/${data.movie.slug}-${data.movie._id}`}>
              <Button icon={<IoPersonAdd />}>Manage Cast</Button>
            </Link>
          </div>
        )}
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
