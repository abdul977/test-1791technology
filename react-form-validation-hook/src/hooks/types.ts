// Type definitions for the form validation hook

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null | Promise<string | null>;
  message?: string;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface FormValues {
  [fieldName: string]: any;
}

export interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: { [fieldName: string]: boolean };
  isSubmitting: boolean;
  isValid: boolean;
}

export interface UseFormValidationOptions {
  initialValues?: FormValues;
  validationRules?: ValidationRules;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  debounceMs?: number;
}

export interface UseFormValidationReturn {
  values: FormValues;
  errors: FormErrors;
  touched: { [fieldName: string]: boolean };
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (onSubmit: (values: FormValues) => void | Promise<void>) => (event: React.FormEvent) => void;
  setFieldValue: (fieldName: string, value: any) => void;
  setFieldError: (fieldName: string, error: string) => void;
  setFieldTouched: (fieldName: string, touched?: boolean) => void;
  validateField: (fieldName: string) => Promise<void>;
  validateForm: () => Promise<boolean>;
  resetForm: (newValues?: FormValues) => void;
  clearErrors: () => void;
}

