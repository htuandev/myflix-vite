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
