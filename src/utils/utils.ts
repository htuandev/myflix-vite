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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
