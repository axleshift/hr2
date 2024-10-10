import dayjs from 'dayjs'

const hours = Math.floor(Math.random() * 24)
const minutes = Math.floor(Math.random() * 60)
const seconds = Math.floor(Math.random() * 60)

/**
 *
 * @param {date} date
 * @returns formatted date string in 'YYYY-MM-DD' format
 */
export const formattedDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 *  Format date to MMM DD, YYYY
 * @param {date} date
 * @returns formatted date string in 'MMM DD, YYYY' format
 */
export const formattedDateMMM = (date) => {
  return dayjs(date).format('MMM DD, YYYY')
}

/**
 *  Format currency
 * @param {integer} value
 * @returns formatted currency string in PHP (Philippine Peso) format
 */
export const formatCurency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Trim string to a certain length
 * @param {string} str
 * @param {integer} maxLength
 * @returns trimmed string
 */
export const trimString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...'
  }
  return str
}

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns string with first letter capitalized
 */

export const firstLetterUppercase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export const randomTime = () => {
  return new Date(1970, 0, 1, hours, minutes, seconds)
}

const textToTime = (text) => {
  return text.match(/(\d+)(?::(\d\d))?\s*(p?)/)
}

/**
 * Convert 12-hour time to 24-hour time
 * @param {string} time12h
 * @returns 24-hour time string
 */

export const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')

  if (hours === '12') {
    hours = '00'
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12
  }

  return `${hours}:${minutes}`
}

export const convertTimeStringTo12Hour = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = hours % 12 || 12
  const modifier = hours < 12 ? 'AM' : 'PM'
  return `${hour}:${minutes} ${modifier}`
}

/**
 *
 * @param {string} time1
 * @param {string} time2
 * @param {string} format
 * @returns time difference in milliseconds
 *
 * timeComparator('12:00', '13:00', 'HH:mm')
 */
export const timeComparator = async (time1, time2) => {
  const [t1Hr, t1Min] = time1.split(':').map(Number)
  const [t2Hr, t2Min] = time2.split(':').map(Number)
  const t1TotalMin = t1Hr * 60 + t1Min
  const TotalMin = t2Hr * 60 + t2Min
  const diff = t1TotalMin - TotalMin
  return diff
}

export const formatTime = (time, clock) => {
  if (clock === '12') {
    return dayjs(time).format('hh:mm A') // 12-hour format with AM/PM
  }
  return dayjs(time).format('HH:mm:ss') // 24-hour format
}

export const formatTimeString = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
