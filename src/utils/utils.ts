import { ReactNode } from 'react';
import { HookAPI } from 'antd/es/modal/useModal';
import dayjs from 'dayjs';
import _ from 'lodash';
import slugify from 'slugify';
import { BACKDROP_COLOR, dateFormat } from '@/constants';
import { ObjectType } from '@/types';

export const detectFormChanged = <T extends ObjectType>(formData: T, value: T, keys?: (keyof T)[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, __v, year, slug, ...rest } = value;

  const updated: ObjectType = {};
  if (_.isUndefined(keys)) keys = ['name'];

  for (const [key, value] of Object.entries(formData)) {
    if (!_.isNil(value)) updated[key] = keys.includes(key) && _.isString(value) ? value.trim() : value;
  }

  const isEqual = _.isEqual(updated, rest);
  if (isEqual)
    throw {
      status: 304,
      data: {
        status: 'error',
        message: 'Nothing has changed'
      }
    };
};

export const handleSlug = (name: string) =>
  slugify(name, { replacement: '-', remove: /[$*_+~.()'"!\-:@]/g, lower: true, strict: true, locale: 'vi' });

export const hexToRgba = (hex = BACKDROP_COLOR, alpha = 1) => {
  hex = hex.replace('#', '');
  alpha = alpha < 0 ? 1 : alpha > 1 ? alpha / 100 : alpha;

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r} ${g} ${b} / ${alpha})`;
};

const today = dayjs().format(dateFormat);

export const transformDate = (dateString: string) => ({
  toString: () => dayjs(dateString).format(dateFormat),
  toDayjs: () => dayjs(dateString, dateFormat),
  isPastDate: () => dayjs(today, dateFormat).unix() > dayjs(dateString, dateFormat).unix(),
  isFutureDate: () => dayjs(today, dateFormat).unix() < dayjs(dateString, dateFormat).unix(),
  isToday: () => dayjs(dateString, dateFormat).unix() === dayjs(today, dateFormat).unix()
});

export const handleYoutubeId = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=|embed\/|v\/)?([a-zA-Z0-9\-_]+)/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : '';
};

export const capitalizeName = (str: string) =>
  str
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

type ConfirmDeleteFn = {
  confirm: HookAPI['confirm'];
  _id: string | number;
  name: string;
  type: 'User' | 'Genre' | 'Network' | 'Country' | 'Person' | 'Movie' | 'Cast' | 'Episode';
  onDelete: () => Promise<void>;
};

export const confirmDelete = ({ confirm, _id, name, type, onDelete }: ConfirmDeleteFn) => {
  const btn = document.getElementById(_id.toString()) as HTMLButtonElement;
  btn.disabled = true;

  confirm({
    title: `Delete ${type}`,
    content: `Do you want to delete ${name}?`,
    onOk: onDelete,
    okText: 'Delete',
    wrapClassName: 'myflix-modal-confirm',
    maskClosable: false,
    zIndex: 5000,
    afterClose: () => (btn.disabled = false)
  });
};

type InfoPreviewFn = {
  info: HookAPI['info'];
  id: string;
  title: string;
  content: ReactNode;
  width?: number;
};

export const infoPreview = ({ info, id, title, content, width = 416 }: InfoPreviewFn) => {
  const btn = document.getElementById(id) as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  info({
    title,
    content,
    width,
    maskClosable: false,
    wrapClassName: 'myflix-modal-confirm preview',
    centered: true,
    okText: 'Back',
    zIndex: 5000,
    afterClose: () => {
      if (btn) btn.disabled = false;
    }
  });
};
