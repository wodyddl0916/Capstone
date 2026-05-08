<<<<<<< HEAD
import React from 'react';

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  full = false,
  children,
  ...props
}) {
  return (
    <div className={`signupform-group${full ? ' full' : ''}`}>
      <label>{label}</label>
      {children || (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
    </div>
  );
}
=======
import React from 'react';

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  full = false,
  children,
  ...props
}) {
  return (
    <div className={`signupform-group${full ? ' full' : ''}`}>
      <label>{label}</label>
      {children || (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
    </div>
  );
}
>>>>>>> b4d3830969fa17d2913c8ec95249291cdb1d25fd
