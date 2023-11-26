import { Dispatch, SetStateAction, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import _ from 'lodash';
import Button from '@/antd/Button';
import { useAddCastMutation } from '@/api/castApi';
import { useGetPeopleQuery } from '@/api/personApi';
import FormItem from '@/shared/FormItem';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';

type Props = {
  movieId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type DataForm = { personId: string; character?: string };

export default function AddCast({ movieId, open, setOpen }: Props) {
  const [form] = Form.useForm<DataForm>();

  const [search, setSearch] = useState('');

  const debouncedSetState = _.debounce((value: string) => {
    setSearch(value);
  }, 300);

  const { data } = useGetPeopleQuery({ search, pageSize: 10 });

  const [onAdd, { isLoading }] = useAddCastMutation();

  const onFinish = handleFetch(async (formData: DataForm) => {
    const res = await onAdd({ id: movieId, formData }).unwrap();
    notify.success(res.message);
    form.resetFields();
    setSearch('');
  });

  const onCancel = () => setOpen(false);

  const footer = [
    <Button key='back' className=' h-9' onClick={onCancel}>
      Return
    </Button>,
    <Button key='submit' type='primary' className=' h-9' onClick={() => form.submit()} isLoading={isLoading}>
      Add Cast
    </Button>
  ];

  return (
    <Modal
      open={open}
      title={<p className=' pb-4 text-center'>Add Cast</p>}
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form layout='vertical' onFinish={onFinish} form={form} requiredMark={false} autoComplete='off'>
        <FormItem label='Search person' name='personId' rules={[{ required: true, message: 'Please choose a person' }]}>
          <Select
            className='myflix-select'
            notFoundContent={null}
            options={data?.results.map((person) => ({ value: person._id, label: person.name }))}
            showSearch
            onSearch={(value) => {
              debouncedSetState(value);
            }}
            filterOption={false}
          />
        </FormItem>
        <FormItem label='Character' name='character'>
          <Input allowClear />
        </FormItem>
      </Form>
    </Modal>
  );
}
