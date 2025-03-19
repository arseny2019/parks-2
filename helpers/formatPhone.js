export const formatPhone = phone => {
    if (!phone) {
        return '';
    }

    const hasPlus = phone.startsWith('+');
    const digitsOnly = phone.replace(/\D/g, '');

    let formattedNumber = '';
    if (hasPlus) {
        formattedNumber += '+';
    }
    formattedNumber += digitsOnly;

    return formattedNumber;
}
