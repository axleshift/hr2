import dayjs from 'dayjs'

const hours = Math.floor(Math.random() * 24)
const minutes = Math.floor(Math.random() * 60)
const seconds = Math.floor(Math.random() * 60)

/**
 *  Format date to MMM DD, YYYY
 * @param {date} date
 * @returns formatted date string in 'MMM DD, YYYY' format
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  return dayjs(date).format(format)
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
export const trimString = (str = '', maxLength = 10) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...'
  }
  return str
}

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export const randomTime = () => {
  return new Date(1970, 0, 1, hours, minutes, seconds)
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

/**
 *
 * @param {string} time
 * @param {string} clock
 * @returns formatted time string
 *
 * formatTime('2021-09-01T12:00:00', '12')
 */
export const formatTime = (timeString = '00:00', format = '12h') => {
  const [hours, minutes] = timeString.split(':')
  const hour = hours % 12 || 12
  const modifier = hours < 12 ? 'AM' : 'PM'
  return `${hour}:${minutes} ${modifier}`
}

/**
 * Format time string to HH:mm:ss
 * @param {string} timeString
 * @returns formatted time string in 'HH:mm:ss' format
 *
 * formatTimeString('12:00:00')
 */

export const formatTimeString = (timeString) => {
  // validate time string
  if (!timeString.match(/\d{2}:\d{2}:\d{2}/)) {
    throw new Error('Invalid time format')
  }

  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const UTCDate = (date) => {
  return new Date(date).toUTCString()
}

export const daysLeft = (date) => {
  const today = new Date()
  const eventDate = new Date(date)

  // Ensure valid date
  if (isNaN(eventDate)) {
    throw new Error('Invalid date format')
  }

  // Calculate difference in days
  const diffTime = eventDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Return 0 if the event date is today or in the past
  return diffDays > 0 ? diffDays : 0
}
