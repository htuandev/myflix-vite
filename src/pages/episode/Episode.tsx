import { Dispatch, SetStateAction } from 'react';
import { Form, Input, Modal } from 'antd';
import { Button } from '@/antd';
import { useAddEpisodeMutation, useGetEpisodeByIdQuery, useUpdateEpisodeMutation } from '@/api/episodeApi';
import { ContentType, rules } from '@/constants';
import { FormItem, Thumbnail } from '@/shared';
import { IEpisodeInfo } from '@/types';
import { handleFetch, notify, detectFormChanged, handleSlug, handleImageUrl } from '@/utils';

type Props = {
  movieId: string;
  episodeId: string;
  type: ContentType;
  episodes: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Episode({ movieId, episodeId, type, episodes, open, setOpen }: Props) {
  const isNew = episodeId === '';
  const [form] = Form.useForm<IEpisodeInfo>();
  const thumbnail = Form.useWatch('thumbnail', form);

  const { data, isLoading } = useGetEpisodeByIdQuery(episodeId, { skip: isNew });

  const initialValues = isNew
    ? type === ContentType.Movie
      ? { name: 'Full' }
      : { name: `Tập ${episodes}` }
    : data
    ? data
    : undefined;

  const [onAdd, { isLoading: isAdding }] = useAddEpisodeMutation();
  const [onUpdate, { isLoading: isUpdating }] = useUpdateEpisodeMutation();

  const onFinish = handleFetch(async (formData: IEpisodeInfo) => {
    formData.slug = handleSlug(formData.name);

    if (data) {
      formData._id = data._id;
    }

    if (!isNew) detectFormChanged(formData, data as IEpisodeInfo);

    if (isNew) {
      const res = await onAdd({ id: movieId, formData }).unwrap();
      notify.success(res.message);
      return setOpen(false);
    }

    const res = await onUpdate(formData).unwrap();
    notify.success(res.message);
    setOpen(false);
  });

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const footer = [
    <Button key='back' className=' h-9' onClick={onCancel}>
      Return
    </Button>,
    <Button
      key='submit'
      type='primary'
      className=' h-9'
      onClick={() => form.submit()}
      isLoading={isNew ? isAdding : isUpdating}
    >
      {isNew ? 'Add' : 'Update'}
    </Button>
  ];

  return (
    <Modal
      open={open}
      title={<p className=' pb-4 text-center'>{isNew ? 'Add Episode' : 'Update Episode'}</p>}
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
      centered
    >
      {type === ContentType.TVSeries && (
        <div className=' flex-center mb-4'>
          <Thumbnail src={thumbnail} size='md' className=' w-3/5' key={thumbnail} />
        </div>
      )}
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        requiredMark={false}
        autoComplete='off'
        initialValues={initialValues}
        className='myflix-form'
        key={data?._id}
      >
        <FormItem label='Name' name='name' isLoading={isLoading} rules={[rules.required('Name')]}>
          <Input allowClear disabled={type === ContentType.Movie} />
        </FormItem>

        <FormItem label='Link' name='link' isLoading={isLoading} rules={[rules.m3u8]}>
          <Input allowClear />
        </FormItem>
        {type === ContentType.TVSeries && (
          <FormItem label='Thumbnail' name='thumbnail' isLoading={isLoading} rules={[rules.imageTMDB]}>
            <Input
              allowClear
              onChange={(e) => {
                form.setFieldValue('thumbnail', handleImageUrl({ url: e.target.value }));
                form.validateFields(['thumbnail']);
              }}
            />
          </FormItem>
        )}
      </Form>
    </Modal>
  );
}
