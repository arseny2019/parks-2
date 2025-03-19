import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('https://dir.parksdev.ru/').with(rest(
    {
        onRequest: (options) => ({ ...options, cache: 'no-store' }),
    }
));

export default directus;
