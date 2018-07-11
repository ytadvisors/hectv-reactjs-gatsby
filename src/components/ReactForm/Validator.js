import validator from 'validator';

export default fields => {
  function validateHelper(values, result, item) {
    let key = item.name;
    let validation = item.validation.map(valid_check => {
      switch (valid_check) {
        case 'required':
          if (!values[key]) return 'Required';
          break;
        case 'not_empty_array':
          if (Array.isArray(values[key]) && values[key].length === 0)
            return 'Required';
          break;
        case 'date':
          if (values[key] === 'MM/DD/YYYY') return 'Invalid date';
          break;
        case 'number':
          if (!validator.isNumeric('' + values[key])) return 'Invalid number';
          break;
        case 'email':
          if (!validator.isEmail('' + values[key]))
            return 'Invalid email address';
          break;
        case 'match_password':
          if (values['password'] !== values['confirm_password'])
            return 'Passwords do not match';
          break;
      }
    });
    if (validation)
      result[key] = validation.filter(function(n) {
        return n !== undefined;
      })[0];
    return result;
  }

  return values => {
    return fields.reduce((result, item) => {
      if (Array.isArray(item)) {
        result = item.reduce((res, it) => {
          return validateHelper(values, res, it);
        }, result);
        return result;
      } else {
        result = validateHelper(values, result, item);
        return result;
      }
    }, {});
  };
};
