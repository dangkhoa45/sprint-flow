import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  styled,
} from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
    
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginRight: 0,
  },
}));

const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  size = 'medium',
  error = false,
  helperText,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <StyledTextField
      variant={variant}
      size={size}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ) : undefined,
      }}
      {...props}
    />
  );
};

export default Input; 