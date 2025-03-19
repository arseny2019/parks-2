export function validateEmail (email){
    // A reasonably good email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhoneNumber(phoneNumber) {
    // Remove all non-digit characters (except the +)
    const cleanedPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');

    // Check if the phone number starts with +7
    if (!cleanedPhoneNumber.startsWith('+7')) {
        return false;
    }

    // Check if the phone number is of the correct length (12 digits including +7)
    if (cleanedPhoneNumber.length !== 12) {
        return false;
    }

    // Check the region code and subscriber number format (more strict)
    const regex = /^\+7(4|8|9)\d{9}$/;
    return regex.test(cleanedPhoneNumber);
}
