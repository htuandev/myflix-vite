import _ from 'lodash';
import slugify from 'slugify';
import { ObjectType } from '@/types';

export const detectFormChanged = (value: ObjectType, other: ObjectType) => {
  const isEqual = _.isEqual(value, other);
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

export const hexToRgb = (hex = '#200b0b', alpha = 1) => {
  hex = hex.replace('#', '');
  alpha = alpha < 0 ? 1 : alpha > 1 ? alpha / 100 : alpha;

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const rgb = `rgb(${r} ${g} ${b})`;
  const rgba = `rgba(${r} ${g} ${b} / ${alpha})`;

  return { rgb, rgba };
};
