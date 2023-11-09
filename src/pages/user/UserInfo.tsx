import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Modal, Select, Skeleton } from 'antd';
import Button from '@/antd/Button';
import { useAddUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '@/api/userApi';
import { Role } from '@/constants/enum';
import drinkCoffeeAvatar from '@/images/drink_coffee_male.svg';
import { RootState } from '@/reducers/store';
import { User } from '@/types/user';
import { detectFormChanged } from '@/utils';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';

type Props = {
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UserInfo({ userId, open, setOpen }: Props) {
  const isNew = userId === '';
  const [form] = Form.useForm<User>();

  const { data: user, isLoading } = useGetUserByIdQuery(userId, { skip: isNew });
  const { user: currentUser } = useSelector((state: RootState) => state.auth) as { user: User };

  const profileImage = Form.useWatch('profileImage', form) || drinkCoffeeAvatar;

  const [onAdd, { isLoading: isAdding }] = useAddUserMutation();
  const [onUpdate, { isLoading: isUpdating }] = useUpdateUserMutation();

  const onFinish = handleFetch(async (formData: User) => {
    if (!isNew) detectFormChanged(formData, user as User);

    if (user) formData._id = user._id;
    if (currentUser._id === formData._id && currentUser.role !== formData.role) {
      notify.error('You can not change your role');
      return;
    }

    const res = await (isNew ? onAdd(formData).unwrap() : onUpdate(formData).unwrap());

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
          {isNew ? 'Add user' : user ? (user.name ? user.name : user.email) : 'Update'}
        </p>
      }
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
      centered
    >
      {isLoading ? (
        <Skeleton paragraph={{ rows: 8 }} />
      ) : (
        <Form
          layout='vertical'
          onFinish={onFinish}
          form={form}
          requiredMark={false}
          autoComplete='off'
          initialValues={user ? user : { role: Role.User }}
          className='myflix-form'
        >
          <div className=' flex-center'>
            <img
              src={profileImage}
              onError={(e) => (e.currentTarget.src = drinkCoffeeAvatar)}
              className=' aspect-square w-24 rounded-full'
            />
          </div>
          <Form.Item label='Name' name='name'>
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            hasFeedback
            rules={[
              { required: true, message: 'Email is required' },
              {
                type: 'email',
                message: 'Invalid email'
              }
            ]}
          >
            <Input type='email' />
          </Form.Item>
          <Form.Item label='Profile Image' name='profileImage' rules={[]}>
            <Input allowClear />
          </Form.Item>
          <Form.Item label='Role' name='role'>
            <Select
              options={[
                { value: Role.Admin, label: 'Admin' },
                { value: Role.User, label: 'User' }
              ]}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
