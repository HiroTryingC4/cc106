// Currency formatting utility for Philippine Peso
export const formatCurrency = (amount) => {
  return `₱${Number(amount).toLocaleString('en-PH', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  })}`;
};

export const CURRENCY_SYMBOL = '₱';
export const CURRENCY_CODE = 'PHP';
