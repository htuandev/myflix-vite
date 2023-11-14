import { Rule } from 'antd/es/form';
import { transformDate } from '@/utils';

const required = (record: string): Rule => ({
  required: true,
  message: `${record} is required`
});

const imageTMDB: Rule = {
  pattern: /^https:\/\/image\.tmdb\.org\/t\/p\/original\//,
  message: 'Only accept image from The Movie DB'
};

const isPastDate = (record: string): Rule => ({
  validator(_rule, value, callback) {
    transformDate(value).isPastDate() ? callback() : callback(`${record} must be a date in the past`);
  }
});

const birthday: Rule = {
  validator(_, value, callback) {
    if (!value) return callback('Date of birth is required');
    return transformDate(value).isPastDate() ? callback() : callback('Date of birth must be a date in the past');
  }
};

const rules = { required, imageTMDB, isPastDate, birthday };
export default rules;
