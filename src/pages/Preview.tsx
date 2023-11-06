import { Link } from 'react-router-dom';

export default function Preview() {
  return (
    <section className=' flex-center min-h-screen'>
      <Link to='/admin' className=' animate-skeleton rounded-full p-8'>
        <img src='/myflix.svg' width={120} height={120} alt='Logo' />
      </Link>
    </section>
  );
}
