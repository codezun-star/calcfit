import { useState } from 'react';

interface ValidationConfig {
  min:       number;
  max:       number;
  fieldName: string;
  required?: boolean;
}

export function useValidation(config: ValidationConfig) {
  const [value,   setValue]   = useState('');
  const [touched, setTouched] = useState(false);

  const numVal = parseFloat(value);

  const error: string | null = touched
    ? !value
      ? `${config.fieldName} es requerido`
      : isNaN(numVal)
      ? `${config.fieldName} debe ser un número`
      : numVal < config.min
      ? `Mínimo ${config.min}`
      : numVal > config.max
      ? `Máximo ${config.max}`
      : null
    : null;

  return { value, setValue, numVal, error, isValid: !error && !!value, setTouched };
}
