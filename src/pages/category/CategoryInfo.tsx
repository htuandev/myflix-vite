import { Dispatch, SetStateAction } from 'react';
import { Form, Input, Modal, Skeleton } from 'antd';
import Button from '@/antd/Button';
import { useAddCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation } from '@/api/categoryApi';
import { Prettify } from '@/types';
import { Category, CategoryType } from '@/types/category';
import { detectFormChanged, handleSlug } from '@/utils';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';

type Props = {
  type: CategoryType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  categoryId: number;
};

export default function CategoryInfo({ type, open, setOpen, categoryId }: Props) {
  const isNew = categoryId === -1;
  const [form] = Form.useForm<Category>();

  const { data: category, isLoading } = useGetCategoryByIdQuery({ type, id: categoryId }, { skip: isNew });

  const [onAdd, { isLoading: isAdding }] = useAddCategoryMutation();
  const [onUpdate, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const onFinish = handleFetch(async ({ name }: Prettify<Pick<Category, 'name'>>) => {
    if (!isNew) detectFormChanged({ name: category?.name }, { name: name.trim() });

    const slug = handleSlug(name);

    const formData = { ...category, name, slug } as Category;

    const res = await (isNew ? onAdd({ type, formData }).unwrap() : onUpdate({ type, formData }).unwrap());

    notify.success(res.message);
    if (isNew) form.resetFields();
  });

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
      title={
        <p className=' pb-4 text-center'>
          {isNew ? `Add ${location.pathname.replace('/admin/', '')}` : category ? category.name : 'Update'}
        </p>
      }
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
    >
      {isLoading ? (
        <>
          <Skeleton paragraph={{ rows: 2 }} />
        </>
      ) : (
        <Form
          layout='vertical'
          onFinish={onFinish}
          form={form}
          requiredMark={false}
          autoComplete='off'
          initialValues={category}
        >
          <Form.Item
            label='Name'
            name='name'
            hasFeedback
            rules={[
              { required: true, message: 'Name is required' },
              { max: 30, message: 'Too long. Maximum length is 30 characters' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
