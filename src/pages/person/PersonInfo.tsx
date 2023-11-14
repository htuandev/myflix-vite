import { Dispatch, SetStateAction } from 'react';
import { DatePicker, Form, Input, Modal, Select, Skeleton } from 'antd';
import dayjs from 'dayjs';
import Button from '@/antd/Button';
import { useAddPersonMutation, useGetPersonByIdQuery, useUpdatePersonMutation } from '@/api/personApi';
import { Gender } from '@/constants/enum';
import rules from '@/constants/rules';
import ProfileImage from '@/shared/ProfileImage';
import { Prettify } from '@/types';
import { Person } from '@/types/person';
import { detectFormChanged, handleSlug, transformDate } from '@/utils';
import { handleFetch } from '@/utils/api';
import notify from '@/utils/notify';
import { handleImageUrl } from '@/utils/tmdb';

type Props = {
  personId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type PersonForm = Prettify<Omit<Person, 'birthday'> & { birthday: dayjs.Dayjs }>;

export default function PersonInfo({ personId, open, setOpen }: Props) {
  const isNew = personId === '';
  const [form] = Form.useForm<PersonForm>();

  const { data: person, isLoading } = useGetPersonByIdQuery(personId, { skip: isNew });

  const profileImage = Form.useWatch('profileImage', form);
  const gender = Form.useWatch('gender', form);

  const [onAdd, { isLoading: isAdding }] = useAddPersonMutation();
  const [onUpdate, { isLoading: isUpdating }] = useUpdatePersonMutation();

  const onFinish = handleFetch(async (formData: Person) => {
    formData.birthday = transformDate(formData.birthday).toString();
    formData.slug = handleSlug(formData.name);

    if (person) {
      formData._id = person._id;
      formData.credits = person.credits;
    }

    if (!isNew) detectFormChanged(formData, person as Person);

    if (isNew) {
      const res = await onAdd(formData).unwrap();
      notify.success(res.message);
      return form.resetFields();
    }

    const res = await onUpdate(formData).unwrap();
    notify.success(res.message);
    form.setFieldsValue(transformPerson(res.data));
  });

  const transformPerson = (person: Person) => ({ ...person, birthday: transformDate(person.birthday).toDayjs() });

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
      title={<p className=' pb-4 text-center'>{isNew ? 'Add person' : 'Update Person'}</p>}
      footer={footer}
      classNames={{ footer: 'flex items-center justify-end' }}
      onCancel={onCancel}
      maskClosable={false}
      centered
    >
      <div className=' flex-center'>
        <ProfileImage src={profileImage} gender={gender} className=' w-24' size='sm' type='circle' key={profileImage} />
      </div>
      {isLoading ? (
        <Skeleton paragraph={{ rows: 8 }} />
      ) : (
        <Form
          layout='vertical'
          onFinish={onFinish}
          form={form}
          requiredMark={false}
          autoComplete='off'
          initialValues={person && transformPerson(person)}
          className='myflix-form'
        >
          <Form.Item label='Name' name='name' rules={[rules.required('Name')]} hasFeedback>
            <Input allowClear />
          </Form.Item>
          <Form.Item label='As known as' name='aka'>
            <Select
              className='myflix-select'
              mode='tags'
              onChange={(values: string[]) =>
                form.setFieldValue(
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
          </Form.Item>
          <Form.Item
            label='Profile Image'
            name='profileImage'
            rules={[rules.required('Profile image'), rules.imageTMDB]}
            hasFeedback
          >
            <Input
              allowClear
              onChange={(e) => {
                form.setFieldValue('profileImage', handleImageUrl({ url: e.target.value }));
                form.validateFields();
              }}
            />
          </Form.Item>
          <Form.Item label='Birthday' name='birthday' rules={[rules.birthday]} hasFeedback>
            <DatePicker className=' w-full' showToday={false} />
          </Form.Item>
          <Form.Item label='Gender' name='gender' rules={[rules.required('Gender')]} hasFeedback>
            <Select
              options={[
                { value: Gender.Female, label: 'Female' },
                { value: Gender.Male, label: 'Male' }
              ]}
              disabled={!isNew}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
