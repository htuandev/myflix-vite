import { Rule } from 'antd/es/form';
import dayjs from 'dayjs';
import _ from 'lodash';
import { transformDate } from '@/utils';
import { ContentType, Status } from './enum';

const required = (record: string): Rule => ({
  required: true,
  whitespace: true,
  message: `${record} is required`
});

const selectRequired = (record: string): Rule => ({
  required: true,
  message: `${record} is required`
});

const imageTMDB: Rule = {
  pattern: /^https:\/\/image\.tmdb\.org\/t\/p\/original\//,
  message: 'Only accept image from The Movie DB'
};

const isPastDate = (record: string): Rule => ({
  validator(_rule, value) {
    transformDate(value).isPastDate()
      ? Promise.resolve()
      : Promise.reject(new Error(`${record} must be a date in the past`));
  }
});

const birthday: Rule = {
  validator(_, value) {
    if (!value) return Promise.reject(new Error('Date of birth is required'));
    return dayjs().isBefore(value, 'D')
      ? Promise.reject(new Error('Date of birth must be a date in the past'))
      : Promise.resolve();
  }
};

const toTalEpisodes = (type: ContentType): Rule => ({
  validator(_rule, value) {
    return !value && type !== ContentType.Movie
      ? Promise.reject(new Error('Total episode is required'))
      : Promise.resolve();
  }
});

const runtime = (type: ContentType): Rule => ({
  validator(_rule, value) {
    return !value && type === ContentType.Movie ? Promise.reject(new Error('Runtime is required')) : Promise.resolve();
  }
});

const releaseDate = (status: Status): Rule => ({
  validator(_rule, value) {
    if (status) {
      if (status === Status.Trailer) return Promise.resolve();

      if (status === Status.Upcoming) {
        if (dayjs().isAfter(value, 'D')) return Promise.reject(new Error('Release date must be a date in the future'));

        return Promise.resolve();
      }

      if (_.isNil(value)) return Promise.reject(new Error('Release date is required'));
      if (dayjs().isBefore(value, 'D')) return Promise.reject(new Error('Release date must be a date in the past'));
      return Promise.resolve();
    }

    Promise.resolve();
  }
});

const rules = { required, selectRequired, imageTMDB, isPastDate, birthday, toTalEpisodes, releaseDate, runtime };
export default rules;
