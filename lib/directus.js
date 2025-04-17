import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('https://xn--80aimpg.xn--80aqfsg.xn--p1ai').with(rest(
    {
        onRequest: (options) => ({ ...options, cache: 'no-store' }),
    }
));

export default directus;
