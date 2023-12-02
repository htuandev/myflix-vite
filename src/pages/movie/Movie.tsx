import { ChangeEvent, useEffect } from 'react';
import { FaEye, FaFileCirclePlus } from 'react-icons/fa6';
import { HiSquaresPlus } from 'react-icons/hi2';
import { IoPersonAdd } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { ColorPicker, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Button } from '@/antd';
import { useGetCategoriesQuery } from '@/api/categoryApi';
import { useAddMovieMutation, useGetMovieByIdQuery, useUpdateMovieMutation } from '@/api/movieApi';
import { ContentType, Status, SubtitleType, BACKDROP_COLOR, rules, routePaths } from '@/constants';
import { useDocumentTitle, useGlightbox, useValidId } from '@/hooks';
import noImage from '@/images/no-image.svg';
import { FormItem, Backdrop, Thumbnail, Poster, Icon } from '@/shared';
import { Prettify, ICategory, IMovie } from '@/types';
import {
  detectFormChanged,
  handleYoutubeId,
  transformDate,
  handleFetch,
  notify,
  handleImageUrl,
  capitalizeName,
  infoPreview
} from '@/utils';

type MovieForm = Prettify<Omit<IMovie, 'releaseDate'> & { releaseDate?: dayjs.Dayjs }>;

export default function Movie() {
  const { id } = useValidId(routePaths.movie);
  const isNew = id === 'add' ? true : false;

  const { data: movie, isLoading, error } = useGetMovieByIdQuery(id, { skip: isNew });
  const { data: categories } = useGetCategoriesQuery();

  const title = isNew ? 'Add Movie' : movie?.name;
  useDocumentTitle(title);

  const transformCategory = (category: ICategory[] | undefined) =>
    category?.map(({ _id, name }) => ({ value: _id, label: name }));

  const transformMovie = (movie: IMovie) => ({
    ...movie,
    releaseDate: _.isEmpty(movie.releaseDate) ? movie.releaseDate : transformDate(movie.releaseDate as string).toDayjs()
  });

  const initialValues = isNew
    ? { backdropColor: BACKDROP_COLOR, type: ContentType.TVSeries, subtitleType: SubtitleType.VietSub }
    : movie
    ? transformMovie(movie)
    : undefined;

  const { useWatch, useForm } = Form;
  const [form] = useForm<MovieForm>();
  const name = useWatch('name', form);
  const poster = useWatch('poster', form) || noImage;
  const type = useWatch('type', form);
  const status = useWatch('status', form);
  const trailer = useWatch('trailer', form) || '';
  const logo = useWatch('logo', form);
  const thumbnail = useWatch('thumbnail', form);
  const backdrop = useWatch('backdrop', form);
  const backdropColor = useWatch('backdropColor', form);

  useGlightbox(trailer);

  const statusOptions =
    type === ContentType.Movie
      ? [{ label: 'Released', value: Status.Released }]
      : [
          { label: 'OnGoing', value: Status.OnGoing },
          { label: 'Ended', value: Status.Ended }
        ];

  const setFieldValue = (key: keyof IMovie, value?: unknown) => form.setFieldValue(key, value);
  const validateField = (key: keyof IMovie) => form.validateFields([key]);

  const typeOnChange = (value: ContentType) => {
    if (status !== Status.Trailer) setFieldValue('status');
    const key = value === ContentType.Movie ? 'episodes' : 'runtime';
    setFieldValue(key);
    validateField(key);
  };

  const imageChange = (e: ChangeEvent<HTMLInputElement>, key: keyof IMovie, isLogo?: boolean) => {
    setFieldValue(key, handleImageUrl({ url: e.target.value, isLogo }));
    validateField(key);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate(routePaths.movie);
    }
  }, [error, navigate]);

  const [onAdd, { isLoading: isAdding }] = useAddMovieMutation();
  const handleAdd = async (formData: IMovie) => {
    const res = await onAdd(formData).unwrap();
    notify.success(res.message);
    movieInfo(res.data);
    form.resetFields();
  };

  const [onUpdate, { isLoading: isUpdating }] = useUpdateMovieMutation();
  const handleUpdate = async (formData: IMovie) => {
    if (movie) formData._id = movie._id;
    detectFormChanged(formData, movie as IMovie, ['name', 'overview']);
    const res = await onUpdate(formData).unwrap();
    notify.success(res.message);
  };

  const onFinish = handleFetch(async (formData: IMovie) => {
    if (formData.releaseDate) {
      formData.releaseDate = transformDate(formData.releaseDate).toString();
    }

    isNew ? await handleAdd(formData) : await handleUpdate(formData);

    window.scroll({ top: 0, behavior: 'smooth' });
  });

  const [{ info }, contextHolder] = Modal.useModal();

  const previewImage = (id: string, type: 'Poster' | 'Logo' | 'Thumbnail' | 'Backdrop') =>
    infoPreview({
      info,
      id,
      title: type ? type : 'Backdrop',
      width: 1000,
      content: (
        <div className=' flex-center'>
          {type === 'Poster' ? (
            <Poster src={poster} size='lg' className=' w-[300px]' />
          ) : type === 'Logo' ? (
            <img src={logo} className=' aspect-video h-40' />
          ) : type === 'Thumbnail' ? (
            <Thumbnail src={thumbnail} size='lg' className='w-full' />
          ) : (
            <Thumbnail src={backdrop} size='lg' className='w-full' />
          )}
        </div>
      )
    });

  const movieInfo = ({ name, slug, _id, poster }: IMovie) =>
    infoPreview({
      info,
      id: _id,
      title: name,
      content: (
        <>
          <div className=' flex-center mb-4'>
            <Poster src={poster} className=' w-20 md:w-32 lg:w-44' size='md' />
          </div>
          <div className=' flex-center gap-4'>
            <Link to={`${routePaths.cast}/${slug}-${_id}`}>
              <Button icon={<IoPersonAdd />} type='ghost' className='min-w-[180px]'>
                Manage Cast
              </Button>
            </Link>
            <Link to={`${routePaths.episode}/${slug}-${_id}`}>
              <Button icon={<FaFileCirclePlus />} type='ghost' className='min-w-[180px]'>
                Manage Episode
              </Button>
            </Link>
          </div>
        </>
      )
    });

  return (
    <section>
      <Backdrop
        backdropUrl={backdrop || thumbnail}
        backdropColor={backdropColor}
        poster={poster}
        name={name}
        isLoading={isLoading}
      >
        {movie && (
          <div className=' hidden gap-4 md:flex'>
            <Link to={`${routePaths.cast}/${movie.slug}-${movie._id}`}>
              <Button icon={<IoPersonAdd />}>Manage Cast</Button>
            </Link>
            <Link to={`${routePaths.episode}/${movie.slug}-${movie._id}`}>
              <Button icon={<FaFileCirclePlus />}>Manage Episode</Button>
            </Link>
            <Button icon={<HiSquaresPlus />} href={`${routePaths.movie}/add`}>
              Add New
            </Button>
          </div>
        )}
      </Backdrop>
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        requiredMark={false}
        key={movie?._id}
        initialValues={initialValues}
        autoComplete='off'
        className='myflix-form max-screen grid  grid-cols-1 gap-x-4 p-4 md:grid-cols-2 lg:p-8'
      >
        <FormItem label='Name' name='name' rules={[rules.required('Name')]} isLoading={isLoading}>
          <Input allowClear onBlur={(e) => form.setFieldValue('name', capitalizeName(e.target.value))} />
        </FormItem>

        <FormItem label='Known As' name='knownAs' isLoading={isLoading}>
          <Select
            className='myflix-select'
            mode='tags'
            onChange={(values: string[]) =>
              setFieldValue(
                'knownAs',
                values.map((value) => capitalizeName(value)).filter((value) => value !== '')
              )
            }
            notFoundContent={null}
            showSearch={false}
            maxTagCount='responsive'
            suffixIcon={null}
            tokenSeparators={[',']}
            popupClassName='myflix-select-tags'
          />
        </FormItem>

        <FormItem
          label='Poster'
          name='poster'
          rules={[rules.required('Poster'), rules.imageTMDB]}
          isLoading={isLoading}
        >
          <Input
            allowClear
            onChange={(e) => imageChange(e, 'poster')}
            suffix={
              poster && poster !== noImage ? (
                <Icon
                  className=' text-base text-dark-100/[0.45] hover:text-dark-100'
                  action='preview'
                  id='preview_poster'
                  onClick={(e) => {
                    e.stopPropagation();
                    previewImage('preview_poster', 'Poster');
                  }}
                />
              ) : (
                <span />
              )
            }
          />
        </FormItem>

        <FormItem label='Backdrop Color' name='backdropColor' isLoading={isLoading}>
          <ColorPicker
            showText
            disabledAlpha
            className=' w-full justify-start pl-2'
            onChange={(_, hex) => setFieldValue('backdropColor', hex)}
          />
        </FormItem>

        <FormItem
          label='Thumbnail'
          name='thumbnail'
          rules={[rules.required('Thumbnail'), rules.imageTMDB]}
          isLoading={isLoading}
        >
          <Input
            allowClear
            onChange={(e) => imageChange(e, 'thumbnail')}
            suffix={
              thumbnail ? (
                <Icon
                  className=' text-base text-dark-100/[0.45] hover:text-dark-100'
                  action='preview'
                  id='preview_thumbnail'
                  onClick={(e) => {
                    e.stopPropagation();
                    previewImage('preview_thumbnail', 'Thumbnail');
                  }}
                />
              ) : (
                <span />
              )
            }
          />
        </FormItem>

        <FormItem label='Backdrop' name='backdrop' rules={[rules.imageTMDB]} isLoading={isLoading}>
          <Input
            allowClear
            onChange={(e) => imageChange(e, 'backdrop')}
            suffix={
              backdrop ? (
                <Icon
                  className=' text-base text-dark-100/[0.45] hover:text-dark-100'
                  action='preview'
                  id='preview_backdrop'
                  onClick={(e) => {
                    e.stopPropagation();
                    previewImage('preview_backdrop', 'Backdrop');
                  }}
                />
              ) : (
                <span />
              )
            }
          />
        </FormItem>

        <FormItem label='Release Date' name='releaseDate' rules={[rules.releaseDate(status)]} isLoading={isLoading}>
          <DatePicker className=' w-full' showToday={false} />
        </FormItem>

        {type === ContentType.Movie ? (
          <FormItem label='Runtime' name='runtime' rules={[rules.runtime(type)]} isLoading={isLoading}>
            <InputNumber className='w-full' min={0} controls={false} />
          </FormItem>
        ) : (
          <FormItem label='Total Episodes' name='episodes' rules={[rules.toTalEpisodes(type)]} isLoading={isLoading}>
            <InputNumber className='w-full' min={0} controls={false} />
          </FormItem>
        )}

        <FormItem label='Logo' name='logo' rules={[rules.imageTMDB]} isLoading={isLoading}>
          <Input
            allowClear
            onChange={(e) => imageChange(e, 'logo', true)}
            suffix={
              logo ? (
                <Icon
                  className=' text-base text-dark-100/[0.45] hover:text-dark-100'
                  action='preview'
                  id='preview_logo'
                  onClick={(e) => {
                    e.stopPropagation();
                    previewImage('preview_logo', 'Logo');
                  }}
                />
              ) : (
                <span />
              )
            }
          />
        </FormItem>

        <FormItem label='Trailer' name='trailer' isLoading={isLoading}>
          <Input
            allowClear
            onChange={(e) => setFieldValue('trailer', handleYoutubeId(e.target.value))}
            suffix={
              trailer ? (
                <span
                  className='glightbox cursor-pointer text-dark-100/[0.45] hover:text-dark-100'
                  onClick={(e) => e.stopPropagation()}
                  children={<FaEye />}
                />
              ) : (
                <span />
              )
            }
          />
        </FormItem>

        <FormItem
          label='Overview'
          className='md:col-span-2'
          name='overview'
          rules={[{ required: true, min: 100, message: 'Overview must be at least 100 characters.' }]}
          isLoading={isLoading}
          isTextarea
        >
          <Input.TextArea showCount maxLength={1000} rows={8} />
        </FormItem>

        <FormItem label='Content Type' name='type' isLoading={isLoading}>
          <Select
            className='myflix-select'
            notFoundContent={null}
            options={[
              { value: ContentType.Movie, label: 'Movie' },
              { value: ContentType.TVSeries, label: 'TV Series' }
            ]}
            onChange={typeOnChange}
          />
        </FormItem>

        <FormItem label='Genres' name='genres' isLoading={isLoading}>
          <Select
            className='myflix-select'
            options={transformCategory(categories?.genres)}
            mode='multiple'
            notFoundContent={null}
            showSearch={false}
            maxTagCount='responsive'
          />
        </FormItem>

        <FormItem label='Subtitle Type' name='subtitleType' isLoading={isLoading}>
          <Select
            className='myflix-select'
            notFoundContent={null}
            options={[
              { value: SubtitleType.VietSub, label: 'Subtitled' },
              { value: SubtitleType.VietDub, label: 'Dubbed' }
            ]}
          />
        </FormItem>

        <FormItem label='Status' name='status' isLoading={isLoading} rules={[rules.selectRequired('Status')]}>
          <Select
            className='myflix-select'
            notFoundContent={null}
            options={[{ label: 'Trailer', value: Status.Trailer }, ...statusOptions]}
            onChange={() => validateField('releaseDate')}
          />
        </FormItem>

        <FormItem label='Countries' name='countries' isLoading={isLoading}>
          <Select
            className='myflix-select'
            options={transformCategory(categories?.countries)}
            mode='multiple'
            notFoundContent={null}
            showSearch={false}
            maxTagCount='responsive'
          />
        </FormItem>

        <FormItem label='Networks' name='networks' isLoading={isLoading}>
          <Select
            className='myflix-select'
            options={transformCategory(categories?.networks)}
            mode='multiple'
            notFoundContent={null}
            showSearch={false}
            maxTagCount='responsive'
          />
        </FormItem>

        <div className=' flex-center gap-4 md:col-span-2'>
          <Button children='Reset' htmlType='reset' className=' w-32 text-center' />
          <Button
            children={isNew ? 'Add' : 'Update'}
            htmlType='submit'
            type='primary'
            className=' w-32'
            isLoading={isNew ? isAdding : isUpdating}
          />
        </div>
      </Form>
      {contextHolder}
    </section>
  );
}
