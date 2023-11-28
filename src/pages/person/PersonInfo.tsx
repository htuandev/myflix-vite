import { Dispatch, SetStateAction } from 'react';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import Button from '@/antd/Button';
import { useAddPersonMutation, useGetPersonByIdQuery, useUpdatePersonMutation } from '@/api/personApi';
import { Gender } from '@/constants/enum';
import rules from '@/constants/rules';
import FormItem from '@/shared/FormItem';
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
  const initialValues = person && transformPerson(person);

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
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        requiredMark={false}
        autoComplete='off'
        initialValues={initialValues}
        className='myflix-form'
        key={person?._id}
      >
        <FormItem label='Name' name='name' isLoading={isLoading} rules={[rules.required('Name')]}>
          <Input allowClear />
        </FormItem>

        <FormItem label='Known as' name='knownAs' isLoading={isLoading}>
          <Select
            className='myflix-select'
            mode='tags'
            onChange={(values: string[]) =>
              form.setFieldValue(
                'knownAs',
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
        </FormItem>

        <FormItem
          label='Profile Image'
          name='profileImage'
          isLoading={isLoading}
          rules={[rules.required('Profile image'), rules.imageTMDB]}
          validateTrigger='onChange'
          validateDebounce={100}
        >
          <Input
            allowClear
            onChange={(e) => {
              form.setFieldValue('profileImage', handleImageUrl({ url: e.target.value }));
              form.validateFields(['profileImage']);
            }}
          />
        </FormItem>

        <FormItem label='Birthday' name='birthday' isLoading={isLoading} rules={[rules.birthday]}>
          <DatePicker className=' w-full' showToday={false} />
        </FormItem>

        <FormItem label='Gender' name='gender' isLoading={isLoading} rules={[rules.selectRequired('Gender')]}>
          <Select
            options={[
              { value: Gender.Female, label: 'Female' },
              { value: Gender.Male, label: 'Male' }
            ]}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
