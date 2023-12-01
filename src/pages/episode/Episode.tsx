import { Dispatch, SetStateAction } from 'react';
import { Form, Input, Modal } from 'antd';
import { Button } from '@/antd';
import { useAddEpisodeMutation, useGetEpisodeByIdQuery, useUpdateEpisodeMutation } from '@/api/episodeApi';
import { ContentType, rules } from '@/constants';
import { FormItem, Thumbnail } from '@/shared';
import { IEpisodeInfo } from '@/types';
import { handleFetch, notify, detectFormChanged, handleImageUrl, capitalizeName } from '@/utils';

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
  const handleAdd = async (formData: IEpisodeInfo) => {
    const res = await onAdd({ id: movieId, formData }).unwrap();
    notify.success(res.message);
    return setOpen(false);
  };

  const [onUpdate, { isLoading: isUpdating }] = useUpdateEpisodeMutation();
  const handleUpdate = async (formData: IEpisodeInfo) => {
    formData._id = data?._id as string;
    detectFormChanged(formData, data as IEpisodeInfo);
    const res = await onUpdate(formData).unwrap();
    notify.success(res.message);
    setOpen(false);
  };

  const onFinish = handleFetch(async (formData: IEpisodeInfo) =>
    isNew ? handleAdd(formData) : handleUpdate(formData)
  );

  const onCancel = () => setOpen(false);

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
          <Input
            allowClear
            disabled={type === ContentType.Movie}
            onBlur={(e) => form.setFieldValue('name', capitalizeName(e.target.value))}
          />
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
