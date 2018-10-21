export function isLoggedIn() {
  let user = localStorage.getItem('user');
  let user_object = user ? JSON.parse(user) : {};
  return user_object.token;
  return {};
}

export function getUser() {
  let user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return {};
}

export function getUserToken() {
  let user = getUser();
  return user.token ? user.token : '';
}

export function getUserId() {
  let user = getUser();
  return user.id ? user.id : '';
}

export function getPlanId() {
  let user = getUser();
  return user.plan_id ? user.plan_id : '';
}

export function setUserToken(token) {
  let user = getUser();
  user.token = token;
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}
export function setUserId(id) {
  let user = getUser();
  user.id = id;
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}

export function deleteUser() {
  localStorage.removeItem('user');
}

export function setPlanId(plan_id) {
  let user = getUser();
  user.plan_id = plan_id;
  localStorage.setItem('user', JSON.stringify(user));
  return true;
}

export function getPlanPrice(price) {
  //TODO: Automate price based on api for plan pricing.
  const price_value = price.match(/[0-9]+/);
  const value = price_value && price_value.length > 0 ? price_value[0] : '';
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
