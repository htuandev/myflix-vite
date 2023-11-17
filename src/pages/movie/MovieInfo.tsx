import { ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorPicker, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import Button from '@/antd/Button';
import { useGetCategoriesQuery } from '@/api/categoryApi';
import { useAddMovieMutation, useGetMovieByIdQuery, useUpdateMovieMutation } from '@/api/movieApi';
import { ContentType, Status, SubtitleType } from '@/constants/enum';
import rules from '@/constants/rules';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useValidId from '@/hooks/useValidId';
import FormItem from '@/shared/FormItem';
import ProfileImage from '@/shared/ProfileImage';
import { Prettify } from '@/types';
import { Category } from '@/types/category';
import { Movie } from '@/types/movie';
import { detectFormChanged, transformDate } from '@/utils';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';
import { handleImageUrl } from '@/utils/tmdb';

type MovieForm = Prettify<Omit<Movie, 'releaseDate'> & { releaseDate?: dayjs.Dayjs }>;

export default function MovieInfo() {
  const { id } = useValidId('/admin/movie');
  const isNew = id === 'add' ? true : false;

  const { data: movie, isLoading, error } = useGetMovieByIdQuery(id, { skip: isNew });
  const { data: categories } = useGetCategoriesQuery();

  const title = isNew ? 'Add Movie' : movie?.name;
  useDocumentTitle(title);

  const transformCategory = (category: Category[] | undefined) =>
    category?.map(({ _id, name }) => ({ value: _id, label: name }));

  const { useWatch, useForm } = Form;
  const [form] = useForm<MovieForm>();
  const poster = useWatch('poster', form);
  const type = useWatch('type', form);
  const status = useWatch('status', form);

  const statusOptions =
    type === ContentType.Movie
      ? [
          { label: 'Upcoming', value: Status.Upcoming },
          { label: 'Released', value: Status.Released }
        ]
      : [
          { label: 'Upcoming', value: Status.Upcoming },
          { label: 'OnGoing', value: Status.OnGoing },
          { label: 'Ended', value: Status.Ended }
        ];

  const setValue = (key: keyof Movie, value?: unknown) => form.setFieldValue(key, value);
  const validate = (key: keyof Movie) => form.validateFields([key]);

  const typeOnChange = (value: ContentType) => {
    if (status !== Status.Upcoming) setValue('status');
    const key = value === ContentType.Movie ? 'episodes' : 'runtime';
    setValue(key);
    validate(key);
  };

  const imageChange = (e: ChangeEvent<HTMLInputElement>, key: keyof Movie, isLogo?: boolean) => {
    setValue(key, handleImageUrl({ url: e.target.value, isLogo }));
    validate(key);
  };

  const transformMovie = (movie: Movie) => ({
    ...movie,
    releaseDate: _.isEmpty(movie.releaseDate) ? movie.releaseDate : transformDate(movie.releaseDate as string).toDayjs()
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate('/admin/movie');
    }
  }, [error, navigate]);

  const [onAdd, { isLoading: isAdding }] = useAddMovieMutation();
  const [onUpdate, { isLoading: isUpdating }] = useUpdateMovieMutation();

  const onFinish = handleFetch(async (formData: Movie) => {
    if (formData.releaseDate) {
      formData.releaseDate = transformDate(formData.releaseDate).toString();
    }

    if (movie) {
      detectFormChanged(formData, movie as Movie, ['name', 'overview']);
      const res = await onUpdate({ ...formData, _id: movie._id }).unwrap();
      notify.success(res.message);
    } else {
      const res = await onAdd(formData).unwrap();
      notify.success(res.message);
      form.resetFields();
    }

    window.scroll({ top: 0, behavior: 'smooth' });
  });

  return (
    <section className=' container'>
      <div className=' flex-center mb-4'>
        <ProfileImage src={poster} gender={1} className=' w-24' size='sm' key={poster} />
      </div>
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        requiredMark={false}
        key={movie?._id}
        initialValues={
          movie
            ? transformMovie(movie)
            : { backdropColor: '#200b0b', type: ContentType.TVSeries, subtitleType: SubtitleType.VietSub }
        }
        autoComplete='off'
        className='myflix-form grid grid-cols-1 gap-x-4 md:grid-cols-12'
      >
        <FormItem
          label='Name'
          name='name'
          className='md:col-span-6'
          rules={[rules.required('Name')]}
          hasFeedback
          isLoading={isLoading}
        >
          <Input allowClear />
        </FormItem>

        <FormItem label='As known as' name='aka' className='md:col-span-6' isLoading={isLoading}>
          <Select
            className='myflix-select'
            mode='tags'
            onChange={(values: string[]) =>
              setValue(
                'aka',
                values.map((value) => value.trim()).filter((value) => value !== '')
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
          className='md:col-span-6'
          rules={[rules.required('Poster'), rules.imageTMDB]}
          hasFeedback
          isLoading={isLoading}
        >
          <Input allowClear onChange={(e) => imageChange(e, 'poster')} />
        </FormItem>

        <FormItem
          label='Thumbnail'
          name='thumbnail'
          className='md:col-span-6'
          rules={[rules.required('Thumbnail'), rules.imageTMDB]}
          hasFeedback
          isLoading={isLoading}
        >
          <Input allowClear onChange={(e) => imageChange(e, 'thumbnail')} />
        </FormItem>

        <FormItem
          label='Logo'
          name='logo'
          className='md:col-span-6'
          rules={[rules.imageTMDB]}
          hasFeedback
          isLoading={isLoading}
        >
          <Input allowClear onChange={(e) => imageChange(e, 'logo', true)} />
        </FormItem>

        <FormItem
          label='Backdrop'
          name='backdrop'
          className='md:col-span-6'
          rules={[rules.imageTMDB]}
          hasFeedback
          isLoading={isLoading}
        >
          <Input allowClear onChange={(e) => imageChange(e, 'backdrop')} />
        </FormItem>

        <FormItem
          label='Release Date'
          className='md:col-span-6'
          name='releaseDate'
          rules={[rules.releaseDate(status)]}
          isLoading={isLoading}
        >
          <DatePicker className=' w-full' showToday={false} />
        </FormItem>

        <FormItem label='Trailer' className='md:col-span-6' name='trailer' isLoading={isLoading}>
          <Input allowClear />
        </FormItem>

        <FormItem label='Backdrop Color' className='md:col-span-4' name='backdropColor' isLoading={isLoading}>
          <ColorPicker
            showText
            disabledAlpha
            className=' w-full justify-start pl-2'
            onChange={(_, hex) => setValue('backdropColor', hex)}
          />
        </FormItem>

        <FormItem
          label='Total Episodes'
          className='md:col-span-4'
          name='episodes'
          rules={[rules.toTalEpisodes(type)]}
          isLoading={isLoading}
        >
          <InputNumber className='w-full' min={0} controls={false} disabled={type === ContentType.Movie} />
        </FormItem>

        <FormItem
          label='Runtime'
          className='md:col-span-4'
          name='runtime'
          rules={[rules.runtime(type)]}
          isLoading={isLoading}
        >
          <InputNumber className='w-full' min={0} controls={false} disabled={type !== ContentType.Movie} />
        </FormItem>

        <FormItem
          label='Overview'
          className='md:col-span-12'
          name='overview'
          rules={[{ required: true, min: 200, message: 'Overview must be at least 200 characters.' }]}
          isLoading={isLoading}
          isTextarea
        >
          <Input.TextArea showCount maxLength={1000} rows={8} />
        </FormItem>

        <FormItem label='Content Type' className='md:col-span-6' name='type' isLoading={isLoading}>
          <Select
            className='myflix-select'
            notFoundContent={null}
            options={[
              { value: ContentType.Movie, label: 'Movie' },
              { value: ContentType.TVSeries, label: 'TV Series' },
              { value: ContentType.TVShow, label: 'TV Show' }
            ]}
            onChange={typeOnChange}
            disabled={!isNew}
          />
        </FormItem>

        <FormItem label='Genres' className='md:col-span-6' name='genres' isLoading={isLoading}>
          <Select
            className='myflix-select'
            options={transformCategory(categories?.genres)}
            mode='multiple'
            notFoundContent={null}
            showSearch={false}
            maxTagCount='responsive'
          />
        </FormItem>

        <FormItem label='Subtitle Type' className='md:col-span-6' name='subtitleType' isLoading={isLoading}>
          <Select
            className='myflix-select'
            notFoundContent={null}
            options={[
              { value: SubtitleType.VietSub, label: 'Vietnamese Subtitled' },
              { value: SubtitleType.EngSub, label: 'English Subtitled' },
              { value: SubtitleType.VietDub, label: 'Vietnamese Dubbed' }
            ]}
          />
        </FormItem>

        <FormItem
          label='Status'
          className='md:col-span-6'
          name='status'
          isLoading={isLoading}
          rules={[rules.selectRequired('Status')]}
        >
          <Select
            className='myflix-select'
            notFoundContent={null}
            options={statusOptions}
            onChange={() => validate('releaseDate')}
          />
        </FormItem>

        <FormItem label='Countries' className='md:col-span-6' name='countries' isLoading={isLoading}>
          <Select
            className='myflix-select'
            options={transformCategory(categories?.countries)}
            mode='multiple'
            notFoundContent={null}
            showSearch={false}
            maxTagCount='responsive'
          />
        </FormItem>

        <FormItem label='Networks' className='md:col-span-6' name='networks' isLoading={isLoading}>
          <Select
            className='myflix-select'
            options={transformCategory(categories?.networks)}
            mode='multiple'
            notFoundContent={null}
            showSearch={false}
            maxTagCount='responsive'
          />
        </FormItem>

        <div className=' flex-center gap-4 md:col-span-12'>
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
    </section>
  );
}
