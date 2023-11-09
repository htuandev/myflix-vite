import { ThemeConfig, theme } from 'antd';
import { hexToRgb } from '@/utils';
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
    colorTextBase: colors.dark[100],
    colorBgBase: colors.body,
    colorBgContainer: colors.dark[950],
    colorBgElevated: colors.dark[925],
    colorPrimary: colors.primary,
    colorLink: colors.primary
  },
  components: {
    Layout: {
      siderBg: colors.dark[950]
    },
    Tooltip: {
      colorBgSpotlight: colors.dark[900],
      controlHeight: 36
    },
    Button: {
      defaultShadow: 'none',
      primaryShadow: 'none',
      dangerShadow: 'none'
    },
    Table: {
      cellPaddingBlock: 8,
      cellPaddingInline: 8
    },
    Modal: {
      colorBgElevated: colors.dark[950]
    },
    Select: {
      optionSelectedBg: hexToRgb(colors.primary, 0.4).rgba,
      optionActiveBg: hexToRgb(colors.primary, 0.1).rgba,
      colorBgElevated: colors.dark[910]
    }
  }
};

export default themeConfig;
