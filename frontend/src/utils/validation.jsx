export const validRequired = (value) => {
  return !value ? "값이 없습니다." : undefined;
};

export const validEmail = (value, message) => {
  const regExp = new RegExp(/^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+/);
  const hint = message || "올바르지 않은 이메일 양식입니다.";
  return value && !regExp.test(value) ? hint : undefined;
};

export const validRange = (value, min, max) => {
  console.log("value, min, max", parseInt(value), min, max);
  const intValue = parseInt(value);
  if (min && max) {
    return intValue && intValue >= min && intValue <= max ? undefined : `값은 ${min} 이상 ${max} 이하여야 합니다.`;
  } else if (min && !max) {
    return intValue && intValue >= min ? undefined : `값은 ${min} 이상이어야 합니다.`;
  } else if (!min && max) {
    return intValue && intValue <= min ? undefined : `값은 ${max} 이하여야 합니다.`;
  } else {
    return !intValue ? "값이 없습니다." : undefined;
  }
};
