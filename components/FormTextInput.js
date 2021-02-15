import React from 'react';
import {Input} from 'react-native-elements';
import PropTypes from 'prop-types';

const FormTextInput = ({style, ...otherProps}) => {
  return <Input {...otherProps} />;
};

FormTextInput.propTypes = {
  style: PropTypes.object,
};

export default FormTextInput;
