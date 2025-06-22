import React from 'react';
import { Button as MuiButton, CircularProgress, styled } from '@mui/material';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  minWidth: 'auto',
  padding: '8px 16px',
  fontSize: '1rem',
  minHeight: '40px',

  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },

  '&:active': {
    transform: 'translateY(0)',
  },

  '&.Mui-disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  '&.loading': {
    color: 'transparent',
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      display: 'none',
    },
  },
}));

const LoadingSpinner = styled(CircularProgress)(() => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  marginLeft: -12,
  marginTop: -12,
  color: 'inherit',
}));

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <StyledButton
      variant="contained"
      size={size}
      disabled={disabled || loading}
      className={loading ? 'loading' : ''}
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
      {loading && <LoadingSpinner size={24} />}
    </StyledButton>
  );
};

export default Button; 