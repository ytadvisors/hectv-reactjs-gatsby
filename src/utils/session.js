export function isLoggedIn() {
  const user = localStorage.getItem('user');
  const userObject = user ? JSON.parse(user) : {};
  return userObject.token;
}

export function getUser() {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return {};
}

export function getUserToken() {
  const user = getUser();
  return user.token ? user.token : '';
}

export function getUserId() {
  const user = getUser();
  return user.id ? user.id : '';
}

export function getPlanId() {
  const user = getUser();
  return user.planId ? user.planId : '';
}

export function setUserToken(token) {
  const user = getUser();
  user.token = token;
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}
export function setUserId(id) {
  const user = getUser();
  user.id = id;
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}

export function deleteUser() {
  localStorage.removeItem('user');
}

export function setPlanId(planId) {
  const user = getUser();
  user.planId = planId;
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}

export function getPlanPrice(price) {
  // TODO: Automate price based on api for plan pricing.
  const priceValue = price.match(/[0-9]+/);
  const value = priceValue && priceValue.length > 0 ? priceValue[0] : '';
  switch (getPlanId()) {
    case 'bronze_monthly':
    case 'silver_monthly':
    case 'gold_monthly':
      return value - value * 0.25;
    case 'platinum_monthly':
      return value - value * 0.3;
    default:
      return value;
  }
}
