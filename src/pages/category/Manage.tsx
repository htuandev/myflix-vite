import { useGetCategoryQuery } from '@/api/categoryApi';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { CategoryType } from '@/types/category';

export default function ManageCategory({ type }: { type: CategoryType }) {
  useDocumentTitle(`Manage ${type}`);

  const { data } = useGetCategoryQuery(type);

  if (data) {
    console.log(type, data);
  }

  return <section className=' container flex-center'>{type}</section>;
}
