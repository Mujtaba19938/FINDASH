// Input Validators
// Validate inputs for API routes

/**
 * Validate user ID
 */
export function validateUserId(userId: string | undefined | null): string {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('Valid user ID is required');
  }
  return userId.trim();
}

/**
 * Validate months parameter for forecasts
 */
export function validateMonths(months: number | string | undefined, defaultMonths: number = 6): number {
  if (months === undefined) {
    return defaultMonths;
  }

  const monthsNum = typeof months === 'string' ? parseInt(months, 10) : months;

  if (isNaN(monthsNum) || monthsNum < 1 || monthsNum > 24) {
    throw new Error('Months must be a number between 1 and 24');
  }

  return monthsNum;
}

/**
 * Validate amount (must be positive number)
 */
export function validateAmount(amount: number | string | undefined): number {
  if (amount === undefined) {
    throw new Error('Amount is required');
  }

  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(amountNum) || amountNum <= 0) {
    throw new Error('Amount must be a positive number');
  }

  return amountNum;
}

/**
 * Validate percentage (must be between -100 and 1000)
 */
export function validatePercent(percent: number | string | undefined): number {
  if (percent === undefined) {
    throw new Error('Percent is required');
  }

  const percentNum = typeof percent === 'string' ? parseFloat(percent) : percent;

  if (isNaN(percentNum) || percentNum < -100 || percentNum > 1000) {
    throw new Error('Percent must be between -100 and 1000');
  }

  return percentNum;
}
