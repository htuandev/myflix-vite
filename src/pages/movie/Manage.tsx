import { useState } from 'react';
import { HiSquaresPlus } from 'react-icons/hi2';
import { Link, useSearchParams } from 'react-router-dom';
import { Input } from 'antd';
import { twMerge } from 'tailwind-merge';
import Button from '@/antd/Button';
import { useGetMoviesQuery } from '@/api/movieApi';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function Manage() {
  const title = 'Manage Movie';
  useDocumentTitle(title);

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || undefined;
  const [search, setSearch] = useState('');

  const { data, isFetching } = useGetMoviesQuery({ page, search });
  console.log('🚀 ~ file: Manage.tsx:19 ~ Manage ~ data:', data);

  return (
    <section className=' container'>
      <h1 className=' text-heading'>{title}</h1>
      <div className={twMerge('flex-center mb-4 gap-8', data ? 'md:justify-between' : 'md:justify-end')}>
        {data && (
          <Input.Search
            className='myflix-search w-full md:w-80'
            allowClear
            enterButton='Search'
            onSearch={(value) => setSearch(value)}
            loading={isFetching}
          />
        )}
        <Link to='/admin/person/add'>
          <Button icon={<HiSquaresPlus />}>Add person</Button>
        </Link>
      </div>
    </section>
  );
}
