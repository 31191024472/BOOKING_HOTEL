import { parse, format } from 'date-fns';

/**
 * Định dạng một đối tượng Date trong JavaScript thành một chuỗi với định dạng "DD/MM/YYYY".
 *
 * @param date - Đối tượng Date cần định dạng.
 * @returns Một chuỗi đại diện cho ngày đã được định dạng.
 * @example formatDate(new Date('2022-01-01')) // "01/01/2022"
 */
function formatDate(date) {
  // Kiểm tra xem ngày có bị undefined hoặc không phải là đối tượng Date hợp lệ hay không
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return;
  }
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear().toString();

  day = day.length < 2 ? `0${day}` : day;
  month = month.length < 2 ? `0${month}` : month;
  return `${day}/${month}/${year}`;
}

/**
 * Định dạng một chuỗi ngày theo định dạng "DD-MM-YYYY" thành một định dạng dễ đọc hơn.
 *
 * @param dateString - Chuỗi ngày cần định dạng.
 * @returns Một chuỗi đại diện cho ngày đã được định dạng.
 * @example getReadableMonthFormat('01-01-2022') // "1 Tháng 1 2022"
 */
function getReadableMonthFormat(dateString) {
  if (!dateString) {
    return '';
  }
  const months = {
    'January': 'Tháng 1',
    'February': 'Tháng 2',
    'March': 'Tháng 3',
    'April': 'Tháng 4',
    'May': 'Tháng 5',
    'June': 'Tháng 6',
    'July': 'Tháng 7',
    'August': 'Tháng 8',
    'September': 'Tháng 9',
    'October': 'Tháng 10',
    'November': 'Tháng 11',
    'December': 'Tháng 12'
  };
  const formattedDate = format(parse(dateString, 'dd-MM-yyyy', new Date()), 'd MMMM yyyy');
  return formattedDate.replace(/(\w+)/g, (match) => months[match] || match);
}

export { formatDate, getReadableMonthFormat };
