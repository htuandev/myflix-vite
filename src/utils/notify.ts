import { toast } from 'react-toastify';

class Notify {
  success(message: string) {
    toast.success(message);
  }

  error(message: string) {
    toast.error(message);
  }

  info(message: string) {
    toast.info(message);
  }

  warning(message: string) {
    toast.warning(message);
  }

  dark(message: string) {
    toast.dark(message);
  }
}

const notify = new Notify();
export default notify;
