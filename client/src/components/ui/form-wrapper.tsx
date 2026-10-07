'use client';

import React from 'react';
import {
  useForm,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  DefaultValues
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

export interface FormWrapperProps<TFormValues extends FieldValues> {
  schema: ZodType<TFormValues, any, any>;
  defaultValues?: DefaultValues<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  submitText?: string;
  isLoading?: boolean;
  serverError?: string | null;
  className?: string;
}

export function FormWrapper<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  submitText = 'Submit',
  isLoading = false,
  serverError = null,
  className
}: FormWrapperProps<TFormValues>) {
  const methods = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      {serverError && (
        <div className="flex items-center gap-2 p-3.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {children(methods)}

      <div className="pt-4">
        <Button
          type="submit"
          variant="saffron"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
}
