import { useParams, useNavigate } from 'react-router-dom';

export const useValidId = (to: string, onlyNumber = false) => {
  const navigate = useNavigate();
  const { slug } = useParams() as { slug: string };

  const creating = slug === 'add';

  const regexOnlyNumber = /^\d{6}$/;
  const regexMixed = /^[a-z]{3}[a-zA-Z0-9]{9}$/;
  const regex = onlyNumber ? regexOnlyNumber : regexMixed;

  const parts = slug.split('-');

  const id = parts[parts.length - 1];
  const isValidId = creating ? true : regex.test(id);

  if (!isValidId) navigate(to);

  return { id };
};
