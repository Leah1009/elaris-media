export function FormField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  errors,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  errors?: string[];
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-charcoal">
        {label}
        {required ? <span className="text-gold-deep"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={errors && errors.length > 0 ? "true" : undefined}
        aria-describedby={errors && errors.length > 0 ? `${name}-error` : undefined}
        className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none transition focus:border-gold-deep"
      />
      {errors && errors.length > 0 ? (
        <p id={`${name}-error`} role="alert" className="text-sm text-danger">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
