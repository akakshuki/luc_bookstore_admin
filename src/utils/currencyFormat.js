export const currencyFormat = (number) => {
  if (!number) return "0 £";
  if (isNaN(String(number).replace(",", "."))) return "0 £";
  return new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  }).format(number);
};

const locale = "en-UK";
export const currencyParser = (val) => {
  try {
    // for when the input gets clears
    if (typeof val === "string" && !val.length) {
      val = "0.0";
    }

    var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
    var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
    var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
    reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
    reversedVal = reversedVal.replace(/[^0-9.]/g, "");
    const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
    const needsDigitsAppended = digitsAfterDecimalCount > 2;
    if (needsDigitsAppended) {
      reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
    }
    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  } catch (error) {
    console.error(error);
  }
};
