import crypto from 'crypto';
export const generateVerificationCode = () => {
    //3 bytes are enough to hold 6 digit code
    const hex = crypto.randomBytes(3).toString('hex');
    const int = parseInt(hex, 16);
    return int % 1000000;
} 
