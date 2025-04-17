export const publicUserToken = 'gwJ1CgG1keVVigouqkp1CVF0Zeqj-z6p';
const directusAPIUrl = 'https://xn--80aimpg.xn--80aqfsg.xn--p1ai';
export const getImageURL = (imageId) => `${directusAPIUrl}/assets/${imageId}?access_token=${publicUserToken}&q=100`
// export const getImageURL = async (imageId) => await directus.request(readAssetRaw(imageId, { quality: 100, access_token: publicUserToken }));
