import dayjs from 'dayjs'

/**
 * 
 * @param {date} date 
 * @returns formatted date string in 'YYYY-MM-DD' format
 */
const formattedDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
};

/**
 *  Format date to MMM DD, YYYY
 * @param {date} date
 * @returns formatted date string in 'MMM DD, YYYY' format
 */
const formattedDateMMM = (date) => {
    return dayjs(date).format('MMM DD, YYYY');
};


/**
 *  Format currency
 * @param {integer} value
 * @returns formatted currency string in PHP (Philippine Peso) format
 */
const formatCurency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(value);
};


/**
 * Trim string to a certain length
 * @param {string} str 
 * @param {integer} maxLength 
 * @returns trimmed string
 */
const trimString = (str, maxLength) => {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
};

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns string with first letter capitalized
 */

const firstLetterUppercase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { formattedDate, formattedDateMMM, formatCurency, trimString, firstLetterUppercase };