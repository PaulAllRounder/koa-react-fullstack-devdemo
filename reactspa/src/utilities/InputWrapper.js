/*
 * Input wrapper for reactstrap, used by formik.
 * Wrapped <FormFeedback> behind input form formik validate.
 * props:
 *	custom - custom-control input, default is false
*/
import { Input, CustomInput, FormFeedback } from 'reactstrap';
import { PropTypes } from 'prop-types';

const InputWrapper = ({field, custom=false, form:{values, touched, errors}, ...props}) => {
  const MyInput = custom ? CustomInput : Input;
  return(
    <>
    <MyInput {...field} {...props}
			invalid={errors[field.name] && touched[field.name]}
    >
			{custom ?
				<FormFeedback>{errors[field.name]}</FormFeedback>
				: null
			}
    </MyInput>
			{!custom ?
				<FormFeedback>{errors[field.name]}</FormFeedback>
				: null
			}
    </>
  );
};

InputWrapper.propTypes = {
	custom: PropTypes.bool,
}

export default InputWrapper;
