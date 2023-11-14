import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider, Empty } from 'antd';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import App from './App.tsx';
import './assets/styles/index.css';
import themeConfig from './constants/themConfig.ts';
import { store } from './reducers/store.ts';

dayjs.extend(localizedFormat);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={themeConfig}
    renderEmpty={() => <Empty description={false} className=' flex-center min-h-[50vh]' />}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
