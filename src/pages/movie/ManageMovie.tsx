import { useState } from 'react';
import { FaFileCirclePlus, FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { IoPersonAdd } from 'react-icons/io5';
import { Link, useSearchParams } from 'react-router-dom';
import { Form, Modal, Select, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';
import { Button, Pagination, Search } from '@/antd';
import { useDeleteMovieMutation, useGetMoviesQuery } from '@/api/movieApi';
import { ContentType, Status, SubtitleType, routePaths } from '@/constants';
import { useDocumentTitle } from '@/hooks';
import { FormItem, Poster } from '@/shared';
import { IMovie, MovieParams } from '@/types';
import { handleFetch, notify } from '@/utils';

export default function ManageMovie() {
  const title = 'Manage Movie';
  useDocumentTitle(title);

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';
  const [params, setParams] = useState<MovieParams>({});

  const { data, isFetching } = useGetMoviesQuery({ ...params, page, search: '' });
  const [onDelete] = useDeleteMovieMutation();

  const handleDelete = handleFetch(async (id: string) => {
    const res = await onDelete(id).unwrap();

    notify.success(res.message);
  });

  const [modal, contextHolder] = Modal.useModal();

  const confirmDelete = ({ _id, name }: Pick<IMovie, '_id' | 'name'>) =>
    modal.confirm({
      title: 'Delete Movie',
      content: `Do you want to delete ${name}?`,
      onOk: () => handleDelete(_id),
      okText: 'Delete',
      wrapClassName: 'myflix-modal-confirm',
      maskClosable: false
    });

  const columns: ColumnsType<IMovie> = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      render: (poster) => (
        <div className=' flex-center p-2'>
          <Poster src={poster} className=' w-12 ' />
        </div>
      ),
      align: 'center',
      width: 100
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { knownAs }) => (
        <>
          <p>{name}</p>
          <p className=' text-sm text-dark-100/60'>{knownAs[0]}</p>
        </>
      )
    },

    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = type === ContentType.Movie ? { children: 'Movie' } : { children: 'TV Series' };
        return (
          <div className=' flex-center'>
            <Tag
              {...config}
              className={twMerge(
                'flex-center h-8 w-24 select-none border-info bg-transparent text-base',
                type === ContentType.TVSeries && 'border-primary'
              )}
            />
          </div>
        );
      },
      align: 'center',
      width: 120,
      responsive: ['lg']
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      align: 'center',
      width: 150,
      responsive: ['md']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config =
          status === Status.Ended
            ? { children: 'End' }
            : status === Status.OnGoing
            ? { children: 'On Going' }
            : status === Status.Released
            ? { children: 'Released' }
            : status === Status.Trailer
            ? { children: 'Trailer' }
            : { children: 'Upcoming' };
        return (
          <div className=' flex-center'>
            <Tag
              {...config}
              className={twMerge(
                'flex-center h-8 w-24 select-none border-info bg-transparent text-base',
                (status === Status.Released || status === Status.Ended) && 'border-primary',
                status === Status.OnGoing && 'border-dark-800'
              )}
            />
          </div>
        );
      },
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
      render: (_, { _id, name, slug }) => (
        <div className=' flex-center gap-4'>
          <Link to={`${routePaths.movie}/${slug}-${_id}`}>
            <FaPenToSquare className=' cursor-pointer text-xl hover:text-dark-100' />
          </Link>
          <Link to={`${routePaths.cast}/${slug}-${_id}`}>
            <IoPersonAdd className=' cursor-pointer text-xl hover:text-dark-100' />
          </Link>
          <Link to={`${routePaths.episode}/${slug}-${_id}`}>
            <FaFileCirclePlus className=' cursor-pointer text-xl hover:text-dark-100' />
          </Link>
          <FaTrash
            className=' cursor-pointer text-xl hover:text-dark-100'
            onClick={() => confirmDelete({ _id, name })}
          />
        </div>
      ),
      align: 'center',
      responsive: ['md'],
      width: 180
    }
  ];

  const { useForm, useWatch } = Form;
  const [form] = useForm<MovieParams>();
  const type = useWatch('type', form);

  const statusOptions = !_.isNumber(type)
    ? [
        { label: 'OnGoing', value: Status.OnGoing },
        { label: 'Released', value: Status.Released },
        { label: 'Ended', value: Status.Ended }
      ]
    : type === ContentType.Movie
    ? [{ label: 'Released', value: Status.Released }]
    : [
        { label: 'OnGoing', value: Status.OnGoing },
        { label: 'Ended', value: Status.Ended }
      ];

  return (
    <section className=' container'>
      <h1 className=' text-heading'>{title}</h1>
      <div className='flex-center mb-4 gap-8 md:justify-between'>
        {data && (
          <div className=' flex-center w-full gap-4 md:w-auto'>
            <Search
              onSearch={(value) => {
                const formData = form.getFieldsValue();

                setParams((prev) => ({ ...prev, search: value, ...formData }));
              }}
              disabled={isFetching}
              placeholder={`Search ${data.totalRecords} movies/series`}
            />
            <Button onClick={() => form.resetFields()} className=' hidden lg:flex'>
              Reset Filter
            </Button>
          </div>
        )}
        <Link to={`${routePaths.movie}/add`} className='hidden md:block'>
          <Button icon={<HiSquaresPlus />}>Add movie</Button>
        </Link>
      </div>
      <Form
        className=' myflix-form mb-4 hidden min-h-[40px] w-full justify-start gap-y-4 lg:flex'
        form={form}
        layout='inline'
        initialValues={{
          type: '',
          status: '',
          subtitleType: '',
          year: '',
          genre: '',
          network: '',
          country: ''
        }}
      >
        {data && (
          <>
            <FormItem name='type' className=' w-36'>
              <Select
                notFoundContent={null}
                options={[
                  { value: '', label: 'Content Type' },
                  { value: ContentType.Movie, label: 'Movie' },
                  { value: ContentType.TVSeries, label: 'TV Series' }
                ]}
                onChange={() => {
                  const status = form.getFieldValue('status');
                  if ([Status.Ended, Status.OnGoing, Status.Released].includes(status))
                    form.setFieldValue('status', '');
                }}
              />
            </FormItem>
            <FormItem name='status' className=' w-28'>
              <Select
                options={[
                  { value: '', label: 'Status' },
                  { value: Status.Trailer, label: 'Trailer' },
                  ...statusOptions
                ]}
                key={type}
              />
            </FormItem>
            <FormItem className=' w-36' name='subtitleType'>
              <Select
                options={[
                  { value: '', label: 'Subtitle Type' },
                  { value: SubtitleType.VietSub, label: 'Subtitled' },
                  { value: SubtitleType.VietDub, label: 'Dubbed' }
                ]}
              />
            </FormItem>
            <FormItem className=' w-24' name='year'>
              <Select
                options={[{ value: '', label: 'Year' }, ...data.options.years.map((year) => ({ value: year }))]}
              />
            </FormItem>
            <FormItem className=' w-40' name='genre'>
              <Select options={[{ value: '', label: 'Genre' }, ...data.options.genres]} />
            </FormItem>
            <FormItem className=' w-36' name='country'>
              <Select options={[{ value: '', label: 'Country' }, ...data.options.countries]} />
            </FormItem>
            <FormItem className=' w-32' name='network'>
              <Select options={[{ value: '', label: 'Network' }, ...data.options.networks]} />
            </FormItem>
          </>
        )}
      </Form>
      <Table
        dataSource={data?.movies}
        columns={columns}
        rowKey='_id'
        loading={{ size: 'large', spinning: isFetching }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        pagination={false}
      />
      {data && data.totalPages > 1 && <Pagination page={page} totalResults={data.totalMovies} />}
      {contextHolder}
    </section>
  );
}
