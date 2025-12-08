/**
 * Application constants
 */

export const PAGE_SIZE = 10;

export const SORT_OPTIONS = {
  DATE: 'date',
  QUANTITY: 'quantity',
  CUSTOMER_NAME: 'customerName',
};

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

export const DEFAULT_SORT = {
  sortBy: SORT_OPTIONS.DATE,
  sortOrder: SORT_ORDERS.DESC,
};

