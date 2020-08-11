import { network } from '$services';
import config from '$config/hostConfig';

export const getLocaleMessages = (locale) => {
  return network.get(`${config.api}/lang/${locale}.js?v=1.0.0`);
};
