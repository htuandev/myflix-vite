import { Dispatch, SetStateAction } from 'react';
import { Form, Input, Modal } from 'antd';
import { Button } from '@/antd';
import { useAddEpisodesMutation } from '@/api/episodeApi';
import { m3u8Pattern, onlyNumbersPattern, rules } from '@/constants';
import { FormItem } from '@/shared';
import { handleFetch, notify } from '@/utils';

type Props = {
  movieId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddEpisodes({ movieId, open, setOpen }: Props) {
  const [form] = Form.useForm<{ episodes: string }>();

  const onCancel = () => setOpen(false);
  const [onAdd, { isLoading }] = useAddEpisodesMutation();

  const footer = [
    <Button key='back' className=' h-9' onClick={onCancel}>
      Return
    </Button>,
    <Button key='submit' type='primary' className=' h-9' onClick={() => form.submit()} isLoading={isLoading}>
      Add
    </Button>
  ];

  const onFinish = handleFetch(async (formData: { episodes: string }) => {
    const episodes = formData.episodes
      .split('\n')
      .map((str) => str.split('|'))
      .filter((x) => onlyNumbersPattern.test(x[0]) && m3u8Pattern.test(x[1]))
      .sort((a, b) => (parseInt(a[0]) < parseInt(b[0]) ? -1 : 1))
      .map((x) => ({
        name: `Tập ${x[0]}`,
        link: x[1],
        thumbnail: x[2]
      }));

    const res = await onAdd({ id: movieId, episodes }).unwrap();
    notify.success(res.message);
    setOpen(false);
  });

  return (
    <Modal
      open={open}
      title={<p className=' pb-4 text-center'>Add Episodes</p>}
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
      centered
      width={800}
    >
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        requiredMark={false}
        autoComplete='off'
        className='myflix-form'
      >
        <FormItem name='episodes' rules={[rules.required('Episodes')]}>
          <Input.TextArea rows={12} />
        </FormItem>
      </Form>
    </Modal>
  );
}
