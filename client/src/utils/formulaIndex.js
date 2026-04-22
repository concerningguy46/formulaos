import Fuse from 'fuse.js';

/**
 * Built-in formula index — 80+ standard spreadsheet formulas
 * with descriptions and keywords for fuzzy search.
 */
const BUILT_IN_FORMULAS = [
  // Math & Arithmetic
  { name: 'SUM', syntax: '=SUM(range)', category: 'Math', description: 'Adds up all numbers in a range of cells', keywords: ['add', 'total', 'sum', 'plus', 'aggregate'] },
  { name: 'AVERAGE', syntax: '=AVERAGE(range)', category: 'Math', description: 'Calculates the average (mean) of numbers', keywords: ['average', 'mean', 'avg'] },
  { name: 'MAX', syntax: '=MAX(range)', category: 'Math', description: 'Returns the largest number in a range', keywords: ['maximum', 'largest', 'biggest', 'highest', 'top'] },
  { name: 'MIN', syntax: '=MIN(range)', category: 'Math', description: 'Returns the smallest number in a range', keywords: ['minimum', 'smallest', 'lowest', 'bottom'] },
  { name: 'COUNT', syntax: '=COUNT(range)', category: 'Math', description: 'Counts cells that contain numbers', keywords: ['count', 'how many', 'number of'] },
  { name: 'COUNTA', syntax: '=COUNTA(range)', category: 'Math', description: 'Counts cells that are not empty', keywords: ['count', 'non-empty', 'filled'] },
  { name: 'PRODUCT', syntax: '=PRODUCT(range)', category: 'Math', description: 'Multiplies all numbers in a range', keywords: ['multiply', 'product', 'times'] },
  { name: 'ROUND', syntax: '=ROUND(number, digits)', category: 'Math', description: 'Rounds a number to specified digits', keywords: ['round', 'decimal', 'precision'] },
  { name: 'ROUNDUP', syntax: '=ROUNDUP(number, digits)', category: 'Math', description: 'Rounds a number up', keywords: ['round up', 'ceiling'] },
  { name: 'ROUNDDOWN', syntax: '=ROUNDDOWN(number, digits)', category: 'Math', description: 'Rounds a number down', keywords: ['round down', 'floor'] },
  { name: 'ABS', syntax: '=ABS(number)', category: 'Math', description: 'Returns the absolute value', keywords: ['absolute', 'positive'] },
  { name: 'POWER', syntax: '=POWER(number, power)', category: 'Math', description: 'Returns a number raised to a power', keywords: ['power', 'exponent', 'squared', 'cubed'] },
  { name: 'SQRT', syntax: '=SQRT(number)', category: 'Math', description: 'Returns the square root', keywords: ['square root', 'sqrt'] },
  { name: 'MOD', syntax: '=MOD(number, divisor)', category: 'Math', description: 'Returns the remainder after division', keywords: ['remainder', 'modulo', 'mod'] },
  { name: 'INT', syntax: '=INT(number)', category: 'Math', description: 'Rounds down to the nearest integer', keywords: ['integer', 'whole number', 'truncate'] },
  { name: 'MEDIAN', syntax: '=MEDIAN(range)', category: 'Math', description: 'Returns the middle value', keywords: ['median', 'middle'] },
  { name: 'SUMPRODUCT', syntax: '=SUMPRODUCT(array1, array2)', category: 'Math', description: 'Multiplies corresponding ranges and sums the results', keywords: ['sum product', 'weighted'] },
  { name: 'RAND', syntax: '=RAND()', category: 'Math', description: 'Returns a random number between 0 and 1', keywords: ['random', 'rand'] },
  { name: 'RANDBETWEEN', syntax: '=RANDBETWEEN(low, high)', category: 'Math', description: 'Returns a random integer between two values', keywords: ['random', 'between'] },

  // Percentage & Financial
  { name: 'Percentage', syntax: '=(part/total)*100', category: 'Finance', description: 'Calculate what percentage a part is of a total', keywords: ['percentage', 'percent', '%', 'ratio'] },
  { name: 'Percentage Change', syntax: '=((new-old)/old)*100', category: 'Finance', description: 'Calculate percentage increase or decrease', keywords: ['percentage change', 'growth', 'increase', 'decrease'] },
  { name: 'Profit Margin', syntax: '=((revenue-cost)/revenue)*100', category: 'Finance', description: 'Calculate profit margin as a percentage', keywords: ['profit', 'margin', 'profit margin'] },
  { name: 'PMT', syntax: '=PMT(rate, periods, principal)', category: 'Finance', description: 'Calculate loan payment amount', keywords: ['payment', 'loan', 'mortgage', 'EMI'] },
  { name: 'FV', syntax: '=FV(rate, periods, payment)', category: 'Finance', description: 'Calculate future value of an investment', keywords: ['future value', 'investment', 'compound'] },
  { name: 'PV', syntax: '=PV(rate, periods, payment)', category: 'Finance', description: 'Calculate present value', keywords: ['present value', 'today'] },
  { name: 'NPV', syntax: '=NPV(rate, range)', category: 'Finance', description: 'Calculate net present value', keywords: ['net present value', 'npv', 'investment'] },
  { name: 'IRR', syntax: '=IRR(range)', category: 'Finance', description: 'Calculate internal rate of return', keywords: ['internal rate of return', 'irr'] },

  // Logical
  { name: 'IF', syntax: '=IF(condition, true_value, false_value)', category: 'Logical', description: 'Returns one value if true, another if false', keywords: ['if', 'condition', 'check', 'test', 'compare'] },
  { name: 'IFS', syntax: '=IFS(cond1, val1, cond2, val2, ...)', category: 'Logical', description: 'Checks multiple conditions in order', keywords: ['multiple if', 'conditions', 'nested if'] },
  { name: 'AND', syntax: '=AND(condition1, condition2)', category: 'Logical', description: 'Returns TRUE if all conditions are true', keywords: ['and', 'all', 'both'] },
  { name: 'OR', syntax: '=OR(condition1, condition2)', category: 'Logical', description: 'Returns TRUE if any condition is true', keywords: ['or', 'any', 'either'] },
  { name: 'NOT', syntax: '=NOT(condition)', category: 'Logical', description: 'Reverses a logical value', keywords: ['not', 'opposite', 'reverse', 'negate'] },
  { name: 'IFERROR', syntax: '=IFERROR(value, error_value)', category: 'Logical', description: 'Returns a value if error, otherwise the original', keywords: ['error', 'catch', 'fallback', 'handle error'] },
  { name: 'SWITCH', syntax: '=SWITCH(expr, val1, result1, ...)', category: 'Logical', description: 'Matches an expression against a list of values', keywords: ['switch', 'match', 'case'] },

  // Lookup & Reference
  { name: 'VLOOKUP', syntax: '=VLOOKUP(lookup, table, col_index, [match])', category: 'Lookup', description: 'Look up a value in the first column and return from another column', keywords: ['vlookup', 'search', 'find', 'lookup', 'match value'] },
  { name: 'HLOOKUP', syntax: '=HLOOKUP(lookup, table, row_index, [match])', category: 'Lookup', description: 'Look up a value in the first row and return from another row', keywords: ['hlookup', 'horizontal lookup'] },
  { name: 'INDEX', syntax: '=INDEX(range, row, col)', category: 'Lookup', description: 'Returns a value at a specific position in a range', keywords: ['index', 'position', 'get value'] },
  { name: 'MATCH', syntax: '=MATCH(value, range, [type])', category: 'Lookup', description: 'Returns the position of a value in a range', keywords: ['match', 'find position', 'locate'] },
  { name: 'XLOOKUP', syntax: '=XLOOKUP(lookup, lookup_range, return_range)', category: 'Lookup', description: 'Modern lookup — searches and returns from any column', keywords: ['xlookup', 'modern lookup', 'search'] },
  { name: 'CHOOSE', syntax: '=CHOOSE(index, val1, val2, ...)', category: 'Lookup', description: 'Returns a value from a list based on index number', keywords: ['choose', 'select', 'pick'] },

  // Text
  { name: 'CONCATENATE', syntax: '=CONCATENATE(text1, text2)', category: 'Text', description: 'Joins two or more text strings together', keywords: ['join', 'combine', 'merge', 'concatenate', 'text together'] },
  { name: 'LEFT', syntax: '=LEFT(text, num_chars)', category: 'Text', description: 'Returns characters from the left side', keywords: ['left', 'first characters', 'beginning'] },
  { name: 'RIGHT', syntax: '=RIGHT(text, num_chars)', category: 'Text', description: 'Returns characters from the right side', keywords: ['right', 'last characters', 'end'] },
  { name: 'MID', syntax: '=MID(text, start, num_chars)', category: 'Text', description: 'Returns characters from the middle', keywords: ['middle', 'extract', 'substring'] },
  { name: 'LEN', syntax: '=LEN(text)', category: 'Text', description: 'Returns the number of characters', keywords: ['length', 'count characters', 'size'] },
  { name: 'TRIM', syntax: '=TRIM(text)', category: 'Text', description: 'Removes extra spaces from text', keywords: ['trim', 'remove spaces', 'clean'] },
  { name: 'UPPER', syntax: '=UPPER(text)', category: 'Text', description: 'Converts text to uppercase', keywords: ['uppercase', 'capitalize', 'upper'] },
  { name: 'LOWER', syntax: '=LOWER(text)', category: 'Text', description: 'Converts text to lowercase', keywords: ['lowercase', 'lower'] },
  { name: 'PROPER', syntax: '=PROPER(text)', category: 'Text', description: 'Capitalizes the first letter of each word', keywords: ['proper case', 'title case', 'capitalize'] },
  { name: 'SUBSTITUTE', syntax: '=SUBSTITUTE(text, old, new)', category: 'Text', description: 'Replaces specific text in a string', keywords: ['replace', 'substitute', 'swap', 'change text'] },
  { name: 'TEXT', syntax: '=TEXT(value, format)', category: 'Text', description: 'Formats a number as text with a specific format', keywords: ['format', 'text', 'number format', 'display'] },
  { name: 'FIND', syntax: '=FIND(find_text, within_text)', category: 'Text', description: 'Finds the position of text within another text', keywords: ['find', 'search text', 'position'] },

  // Date & Time
  { name: 'TODAY', syntax: '=TODAY()', category: 'Date', description: "Returns today's date", keywords: ['today', 'current date', 'now'] },
  { name: 'NOW', syntax: '=NOW()', category: 'Date', description: 'Returns current date and time', keywords: ['now', 'current time', 'timestamp'] },
  { name: 'DATE', syntax: '=DATE(year, month, day)', category: 'Date', description: 'Creates a date from year, month, day', keywords: ['date', 'create date'] },
  { name: 'YEAR', syntax: '=YEAR(date)', category: 'Date', description: 'Extracts the year from a date', keywords: ['year', 'extract year'] },
  { name: 'MONTH', syntax: '=MONTH(date)', category: 'Date', description: 'Extracts the month from a date', keywords: ['month', 'extract month'] },
  { name: 'DAY', syntax: '=DAY(date)', category: 'Date', description: 'Extracts the day from a date', keywords: ['day', 'extract day'] },
  { name: 'DATEDIF', syntax: '=DATEDIF(start, end, unit)', category: 'Date', description: 'Returns the difference between two dates', keywords: ['date difference', 'days between', 'age', 'duration'] },
  { name: 'WEEKDAY', syntax: '=WEEKDAY(date)', category: 'Date', description: 'Returns the day of the week (1-7)', keywords: ['weekday', 'day of week'] },
  { name: 'EDATE', syntax: '=EDATE(start_date, months)', category: 'Date', description: 'Adds months to a date', keywords: ['add months', 'future date'] },
  { name: 'NETWORKDAYS', syntax: '=NETWORKDAYS(start, end)', category: 'Date', description: 'Count working days between two dates', keywords: ['working days', 'business days', 'weekdays'] },

  // Conditional Aggregation
  { name: 'COUNTIF', syntax: '=COUNTIF(range, criteria)', category: 'Conditional', description: 'Counts cells that match a condition', keywords: ['count if', 'conditional count', 'how many match'] },
  { name: 'COUNTIFS', syntax: '=COUNTIFS(range1, criteria1, range2, criteria2)', category: 'Conditional', description: 'Counts cells that match multiple conditions', keywords: ['count if multiple', 'multiple criteria count'] },
  { name: 'SUMIF', syntax: '=SUMIF(range, criteria, [sum_range])', category: 'Conditional', description: 'Adds up cells that match a condition', keywords: ['sum if', 'conditional sum', 'add if'] },
  { name: 'SUMIFS', syntax: '=SUMIFS(sum_range, range1, criteria1, ...)', category: 'Conditional', description: 'Sum cells matching multiple conditions', keywords: ['sum if multiple', 'multiple criteria sum'] },
  { name: 'AVERAGEIF', syntax: '=AVERAGEIF(range, criteria, [avg_range])', category: 'Conditional', description: 'Average of cells that match a condition', keywords: ['average if', 'conditional average'] },
  { name: 'MAXIFS', syntax: '=MAXIFS(max_range, range1, criteria1)', category: 'Conditional', description: 'Max value among cells matching conditions', keywords: ['max if', 'conditional max'] },
  { name: 'MINIFS', syntax: '=MINIFS(min_range, range1, criteria1)', category: 'Conditional', description: 'Min value among cells matching conditions', keywords: ['min if', 'conditional min'] },

  // Data Analysis
  { name: 'UNIQUE', syntax: '=UNIQUE(range)', category: 'Data', description: 'Returns unique values from a range', keywords: ['unique', 'distinct', 'remove duplicates', 'deduplicate'] },
  { name: 'SORT', syntax: '=SORT(range, col, order)', category: 'Data', description: 'Sorts a range by a column', keywords: ['sort', 'order', 'arrange', 'rank'] },
  { name: 'FILTER', syntax: '=FILTER(range, criteria)', category: 'Data', description: 'Filters a range based on criteria', keywords: ['filter', 'select', 'where'] },
  { name: 'RANK', syntax: '=RANK(number, range)', category: 'Data', description: 'Returns the rank of a number in a list', keywords: ['rank', 'position', 'standing'] },
  { name: 'LARGE', syntax: '=LARGE(range, k)', category: 'Data', description: 'Returns the k-th largest value', keywords: ['largest', 'top n', 'nth biggest'] },
  { name: 'SMALL', syntax: '=SMALL(range, k)', category: 'Data', description: 'Returns the k-th smallest value', keywords: ['smallest', 'bottom n', 'nth smallest'] },
  { name: 'STDEV', syntax: '=STDEV(range)', category: 'Data', description: 'Calculates standard deviation', keywords: ['standard deviation', 'stdev', 'variability'] },
  { name: 'VAR', syntax: '=VAR(range)', category: 'Data', description: 'Calculates variance', keywords: ['variance', 'var', 'spread'] },
];

/**
 * Fuse.js instance configured for fuzzy formula search.
 * Searches across name, description, and keywords.
 */
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'keywords', weight: 0.3 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
};

const fuseInstance = new Fuse(BUILT_IN_FORMULAS, fuseOptions);

/**
 * Search built-in formulas using fuzzy matching.
 * Returns top results sorted by relevance.
 */
export const searchBuiltInFormulas = (query) => {
  if (!query || query.length < 2) return BUILT_IN_FORMULAS.slice(0, 10);
  return fuseInstance.search(query).map((result) => result.item);
};

/** Get all categories for built-in formulas */
export const getFormulaCategories = () => {
  return [...new Set(BUILT_IN_FORMULAS.map((f) => f.category))];
};

/** Get formulas by category */
export const getFormulasByCategory = (category) => {
  return BUILT_IN_FORMULAS.filter((f) => f.category === category);
};

export default BUILT_IN_FORMULAS;
