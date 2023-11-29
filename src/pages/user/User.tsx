import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Modal, Select } from 'antd';
import { Button } from '@/antd';
import { useAddUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '@/api/userApi';
import { Role } from '@/constants';
import drinkCoffeeAvatar from '@/images/drink_coffee_male.svg';
import { RootState } from '@/reducers/store';
import { Avatar, FormItem } from '@/shared';
import { IUser } from '@/types';
import { handleFetch, notify, detectFormChanged } from '@/utils';

type Props = {
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UserInfo({ userId, open, setOpen }: Props) {
  const isNew = userId === '';
  const [form] = Form.useForm<IUser>();

  const { data: user, isLoading } = useGetUserByIdQuery(userId, { skip: isNew });
  const { user: currentUser } = useSelector((state: RootState) => state.auth) as { user: IUser };

  const initialValues = isNew ? { role: Role.User } : user ? user : undefined;

  const profileImage = Form.useWatch('profileImage', form) || drinkCoffeeAvatar;

  const [onAdd, { isLoading: isAdding }] = useAddUserMutation();
  const [onUpdate, { isLoading: isUpdating }] = useUpdateUserMutation();

  const onFinish = handleFetch(async (formData: IUser) => {
    if (user) formData._id = user._id;
    if (!isNew) detectFormChanged(formData, user as IUser);

    if (currentUser._id === formData._id && currentUser.role !== formData.role) {
      notify.error('You can not change your role');
      return;
    }

    if (isNew) {
      const res = await onAdd(formData).unwrap();
      notify.success(res.message);
      return form.resetFields();
    }

    const res = await onUpdate(formData).unwrap();
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
      title={<p className=' pb-4 text-center'>{isNew ? 'Add user' : 'Update User'}</p>}
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
      centered
    >
      <div className=' flex-center'>
        <Avatar src={profileImage} className=' w-24' key={profileImage} />
      </div>
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        requiredMark={false}
        autoComplete='off'
        initialValues={initialValues}
        className='myflix-form'
        key={user?._id}
      >
        <FormItem label='Name' name='name' isLoading={isLoading}>
          <Input />
        </FormItem>
        <FormItem
          label='Email'
          name='email'
          isLoading={isLoading}
          rules={[
            { required: true, message: 'Email is required' },
            {
              type: 'email',
              message: 'Invalid email'
            }
          ]}
        >
          <Input />
        </FormItem>
        <FormItem label='Profile Image' name='profileImage' isLoading={isLoading}>
          <Input allowClear />
        </FormItem>
        <FormItem label='Role' name='role' isLoading={isLoading}>
          <Select
            options={[
              { value: Role.Admin, label: 'Admin' },
              { value: Role.User, label: 'User' }
            ]}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
