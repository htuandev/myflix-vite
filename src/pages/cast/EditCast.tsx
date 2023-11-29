import { Dispatch, SetStateAction } from 'react';
import { Form, Input, Modal } from 'antd';
import { Button } from '@/antd';
import { useGetCastByIdQuery, useUpdateCharacterMutation } from '@/api/castApi';
import { FormItem } from '@/shared';
import { ICharacter } from '@/types';
import { capitalizeName, detectFormChanged, handleFetch, notify } from '@/utils';

type Props = {
  castId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function EditCast({ castId, open, setOpen }: Props) {
  const [form] = Form.useForm();
  const { data, isLoading } = useGetCastByIdQuery(castId);
  const [onUpdate, { isLoading: isUpdating }] = useUpdateCharacterMutation();

  const onFinish = handleFetch(async ({ character }: Pick<ICharacter, 'character'>) => {
    detectFormChanged({ character }, { character: data?.character });
    const res = await onUpdate({ _id: castId, character }).unwrap();
    notify.success(res.message);
  });

  const onCancel = () => setOpen(false);

  const footer = [
    <Button key='back' className=' h-9' onClick={onCancel}>
      Return
    </Button>,
    <Button key='submit' type='primary' className=' h-9' onClick={() => form.submit()} isLoading={isUpdating}>
      Update
    </Button>
  ];
  return (
    <Modal
      open={open}
      title={<p className=' pb-4 text-center'>Update Character</p>}
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        className='myflix-form'
        requiredMark={false}
        autoComplete='off'
        initialValues={
          data
            ? {
                person: data.person.name,
                character: data.character
              }
            : undefined
        }
        key={data?._id}
      >
        <FormItem label='Search person' name='person' isLoading={isLoading}>
          <Input allowClear disabled />
        </FormItem>
        <FormItem label='Character' name='character' isLoading={isLoading}>
          <Input
            allowClear
            onBlur={(e) => e.target.value && form.setFieldValue('character', capitalizeName(e.target.value))}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
