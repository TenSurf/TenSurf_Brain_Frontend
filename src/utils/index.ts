export const isRTL = (text: string) => {
  const firstChar = text.trim().charAt(0);

  const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlChars.test(firstChar) ? 'rtl' : 'ltr';
};
