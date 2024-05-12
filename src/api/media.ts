import axios from 'axios';

import { baseURL } from '@app/constants';

export default axios.create({
  baseURL: `${baseURL}/api/v1/media`,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
});
