import _ from 'lodash';
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
