import { Dispatch, SetStateAction } from 'react';
import { Form, Input, Modal } from 'antd';
import { Button } from '@/antd';
import { useAddCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation } from '@/api/categoryApi';
import { FormItem } from '@/shared';
import { ICategory, CategoryType } from '@/types';
import { handleFetch, notify, detectFormChanged, handleSlug } from '@/utils';

type Props = {
  type: CategoryType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  categoryId: number;
  categoryType: string;
};

export default function CategoryInfo({ type, open, setOpen, categoryId, categoryType }: Props) {
  const isNew = categoryId === -1;
  const [form] = Form.useForm<ICategory>();

  const { data: category, isLoading } = useGetCategoryByIdQuery({ type, id: categoryId }, { skip: isNew });

  const [onAdd, { isLoading: isAdding }] = useAddCategoryMutation();
  const [onUpdate, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const onFinish = handleFetch(async ({ name }: Pick<ICategory, 'name'>) => {
    if (!isNew) detectFormChanged({ name }, { name: category?.name });

    const slug = handleSlug(name);

    const formData = { ...category, name, slug } as ICategory;

    if (isNew) {
      const res = await onAdd({ type, formData }).unwrap();
      notify.success(res.message);
      return form.resetFields();
    }

    const res = await onUpdate({ type, formData }).unwrap();
    notify.success(res.message);
    form.setFieldsValue(res.data);
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
      title={<p className=' pb-4 text-center'>{isNew ? `Add ${categoryType}` : `Update ${categoryType}`}</p>}
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        requiredMark={false}
        autoComplete='off'
        initialValues={category}
        key={category?._id}
      >
        <FormItem
          label='Name'
          name='name'
          isLoading={isLoading}
          rules={[
            { required: true, message: 'Name is required' },
            { max: 30, message: 'Too long. Maximum length is 30 characters' }
          ]}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
}
