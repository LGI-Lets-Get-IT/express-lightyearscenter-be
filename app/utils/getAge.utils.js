const { addMonths } = require("date-fns/addMonths");
const { addYears } = require("date-fns/addYears");
const { differenceInDays } = require("date-fns/differenceInDays");
const { differenceInMonths } = require("date-fns/differenceInMonths");
const { differenceInYears } = require("date-fns/differenceInYears");
const { parseISO } = require("date-fns/parseISO");

const getAgeInYearsMonthDays = (birthDate) => {
    const start = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const end = new Date();

    const years = differenceInYears(end, start);
    const dateAfterYears = addYears(start, years);
    const months = differenceInMonths(end, dateAfterYears);
    const dateAfterMonths = addMonths(dateAfterYears, months);
    const days = differenceInDays(end, dateAfterMonths);
    
    return `${years} years, ${months} months, ${days} days`;
}

module.exports = { getAgeInYearsMonthDays }