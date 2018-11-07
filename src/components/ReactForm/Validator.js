import validator from 'validator';

export default fields => {
  const validateHelper = (values, acc, item) => {
    let result = { ...acc };
    const { validation, name } = item;

    const response = validation
      .map(validCheck => {
        switch (validCheck) {
          case 'required':
            if (!values[name]) return 'Required';
            break;
          case 'not_empty_array':
            if (Array.isArray(values[name]) && values[name].length === 0)
              return 'Required';
            break;
          case 'date':
            if (values[name] === 'MM/DD/YYYY') return 'Invalid date';
            break;
          case 'number':
            if (!validator.isNumeric(`${values[name]}`))
              return 'Invalid number';
            break;
          case 'email':
            if (!validator.isEmail(`${values[name]}`))
              return 'Invalid email address';
            break;
          case 'matchPassword':
            if (values.password !== values.confirmPassword)
              return 'Passwords do not match';
            break;
          default:
            break;
        }
        return null;
      })
      .filter(n => n);

    if (response && response.length > 0)
      result = { ...result, name: response[0] };
    return result;
  };

  return values =>
    fields.reduce((acc, item) => {
      let result = { ...acc };
      if (Array.isArray(item)) {
        result = item.reduce(
          (res, it) => validateHelper(values, res, it),
          result
        );
        return result;
      }
      result = validateHelper(values, result, item);
      return result;
    }, {});
};
