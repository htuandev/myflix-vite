import { Input } from 'antd';
import { SearchProps } from 'antd/es/input';
import { twMerge } from 'tailwind-merge';

export default function Search({ className, allowClear, name, enterButton, autoComplete, ...props }: SearchProps) {
  return (
    <Input.Search
      {...props}
      className={twMerge('myflix-search w-full md:w-96', className)}
      allowClear={allowClear ? allowClear : true}
      autoComplete={autoComplete ? autoComplete : 'off'}
      name={name ? name : 'search'}
      enterButton={enterButton ? enterButton : 'Search'}
    />
  );
}
