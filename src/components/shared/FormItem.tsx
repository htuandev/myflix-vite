import { Form } from 'antd';
import { FormItemProps as AntdFormItemProps } from 'antd/es/form/FormItem';
import { twMerge } from 'tailwind-merge';
import { Prettify } from '@/types';

interface Props extends AntdFormItemProps {
  isLoading?: boolean;
  isTextarea?: boolean;
}

type FormItemProps = Prettify<Props>;

export default function FormItem({ isLoading, children, className, isTextarea, name, ...props }: FormItemProps) {
  return (
    <Form.Item {...props} name={!isLoading && name} className={twMerge('w-full', className)}>
      {isLoading ? (
        <div className={twMerge('animate-skeleton h-10 w-full rounded-md', isTextarea && 'h-52')} />
      ) : (
        children
      )}
    </Form.Item>
  );
}
