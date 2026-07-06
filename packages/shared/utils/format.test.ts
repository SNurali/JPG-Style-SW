import { describe, expect, it } from 'vitest';
import {
  formatPrice,
  slugify,
  generateOrderNumber,
  truncate,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from './format';

describe('formatPrice', () => {
  it('groups thousands with a space and appends the currency label', () => {
    expect(formatPrice(85000)).toBe('85 000 сўм');
    expect(formatPrice(500)).toBe('500 сўм');
    expect(formatPrice(1000000)).toBe('1 000 000 сўм');
  });
});

describe('slugify', () => {
  it('lowercases, strips punctuation and joins words with dashes', () => {
    expect(slugify('Dry Fog 450ml')).toBe('dry-fog-450ml');
    expect(slugify('Multiple   spaces')).toBe('multiple-spaces');
  });
});

describe('generateOrderNumber', () => {
  it('produces an SW-prefixed 5-digit order number', () => {
    expect(generateOrderNumber()).toMatch(/^SW-\d{5}$/);
  });
});

describe('truncate', () => {
  it('returns the original text when within the limit', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates and appends an ellipsis when over the limit', () => {
    expect(truncate('a long piece of text', 5)).toBe('a lon…');
  });
});

describe('getOrderStatusLabel', () => {
  it('maps known statuses to Russian labels', () => {
    expect(getOrderStatusLabel('pending')).toBe('Ожидает');
    expect(getOrderStatusLabel('delivered')).toBe('Доставлен');
  });

  it('falls back to the raw status for unknown values', () => {
    expect(getOrderStatusLabel('unknown-status')).toBe('unknown-status');
  });
});

describe('getPaymentStatusLabel', () => {
  it('maps known payment statuses to Russian labels', () => {
    expect(getPaymentStatusLabel('paid')).toBe('Оплачено');
  });

  it('falls back to the raw status for unknown values', () => {
    expect(getPaymentStatusLabel('unknown-status')).toBe('unknown-status');
  });
});
