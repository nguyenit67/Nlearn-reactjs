// @ts-ignore
import {
  Box,
  Button,
  FormHelperText,
  makeStyles,
  OutlinedInput,
  Typography,
  withStyles,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { Add, Remove } from '@material-ui/icons';
import { MAX_PRODUCT_QUANTITY, MIN_PRODUCT_QUANTITY } from 'constants/index';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { getErrorMessageRHF, numberParsePositiveInt, productQuantityClamp } from 'utils';

/**
 * @typedef {import('@material-ui/core').ButtonProps} ButtonProps
 */

QuantityField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  submitCallback: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  root: {},
  inputGroup: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'stretch',
    minWidth: '135px',
    maxWidth: '200px',

    '& .MuiInputBase-root': {
      borderRadius: 0,
    },
  },
  left: {
    borderRadius: '50px 0 0 50px !important',
  },
  right: {
    borderRadius: '0 50px 50px 0 !important',
  },
  input: {
    textAlign: 'center',
  },
}));

const AdjustButton = withStyles({
  root: {
    borderRadius: 0,
    minWidth: 40,
    '& .MuiSvgIcon-root': {
      fontSize: 14,
    },
  },
})((/** @type {ButtonProps} */ props) => <Button variant="outlined" size="small" {...props} />);

export default function QuantityField(props) {
  const classes = useStyles();
  const { form, name, label, disabled } = props;
  const { hasError, errorMessage } = getErrorMessageRHF(form, name);

  // const fieldValueSnapshot = form.watch(name);
  // useEffect(() => {
  //   props?.submitCallback();
  // }, [fieldValueSnapshot]);

  const addQuantity = (value, add) => {
    const newValue = numberParsePositiveInt(value) + add;
    form.setValue(name, newValue);
    props?.submitCallback();
  };

  const updateValueOnBlur = (name, value) => {
    const parsedValue = numberParsePositiveInt(value);
    form.setValue(name, parsedValue);
  };

  return (
    <FormControl error={hasError} fullWidth margin="normal" variant="outlined" size="small">
      <Typography>{label}</Typography>

      <Controller
        name={name}
        control={form.control}
        render={({ onChange, onBlur, value, name }) => {
          console.log('Update field', name, value);

          return (
            <Box className={classes.inputGroup}>
              <AdjustButton
                className={classes.left}
                disabled={disabled || value <= MIN_PRODUCT_QUANTITY}
                onClick={() => addQuantity(value, -1)}
              >
                <Remove />
              </AdjustButton>

              <OutlinedInput
                color="secondary"
                classes={{
                  input: classes.input,
                }}
                id={name}
                type="number"
                disabled={disabled}
                // bind render props of Controller
                value={productQuantityClamp(value)}
                onChange={onChange}
                onBlur={(e) => {
                  const parsedValue = numberParsePositiveInt(e.target.value);
                  updateValueOnBlur(name, parsedValue);
                  // onBlur();
                }}
              />

              <AdjustButton
                className={classes.right}
                disabled={disabled || value >= MAX_PRODUCT_QUANTITY}
                onClick={() => addQuantity(value, +1)}
              >
                <Add />
              </AdjustButton>
            </Box>
          );
        }}
      />
      {/* validation error message */}
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
}
