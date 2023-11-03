import ReactDOM from 'react-dom/client';
import { ConfigProvider, Empty } from 'antd';
import App from './App.tsx';
import './assets/styles/index.css';
import themeConfig from './constants/themConfig.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={themeConfig}
    renderEmpty={() => <Empty description={false} className=' d-center min-h-[50vh]' />}
  >
    <App />
  </ConfigProvider>
);
