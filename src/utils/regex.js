export const REGEX = {
    OTP: /^\d{6}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    MOBILE: /^[6-9]\d{9}$/,  // Indian Mobile No only
 
};