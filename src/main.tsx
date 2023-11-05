import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider, Empty } from 'antd';
import App from './App.tsx';
import './assets/styles/index.css';
import themeConfig from './constants/themConfig.ts';
import { store } from './reducers/store.ts';

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
