import { ThemeConfig, theme } from 'antd';
import colors from './colors';

const themeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontSize: 16,
    fontFamily: '"Roboto", sans-serif',
    lineWidth: 2,
    controlHeight: 40,
    controlOutline: 'none',
    screenSM: 640,
    screenSMMax: 767,
    screenSMMin: 640,
    screenMD: 768,
    screenMDMax: 1023,
    screenMDMin: 768,
    screenLG: 1024,
    screenLGMax: 1279,
    screenLGMin: 1024,
    screenXL: 1280,
    screenXLMax: 1535,
    screenXLMin: 1280,
    screenXXL: 1536,
    screenXXLMin: 1536,
    colorTextBase: colors.dark[200],
    colorBgBase: colors.body,
    colorBgContainer: colors.dark[950],
    colorBgElevated: colors.dark[925]
  },
  components: {
    Layout: {
      siderBg: colors.dark[950]
    },
    Tooltip: {
      colorBgSpotlight: colors.dark[900],
      controlHeight: 36
    }
  }
};

export default themeConfig;
