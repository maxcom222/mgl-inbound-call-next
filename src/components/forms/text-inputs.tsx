import React from 'react';

export const TextInput: React.FunctionComponent<any> = (props) => (
  <>
    <label className="block">
      <span className="text-sm text-default">{props.label}</span>

      <input
        name={props.name}
        type="text"
        ref={props.Ref}
        className="text-sm form-input block w-full border"
        placeholder={props.placeholder}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={(e) => {
          if(typeof props.onChange !== 'undefined') props.onChange(e.target.value);
        }}
      />
    </label>

    {typeof props.error !== 'undefined' && props.error !== '' && (
      <p className="mt-1 text-xs text-red-500 capitalize">{props.error}</p>
    )}
  </>
);

export const NumberInput: React.FunctionComponent<any> = (props) => {
  const value = (typeof props.value !== 'undefined' && props.value !== null) ? props.value : '';
  const min = typeof props.min !== 'undefined' ? props.min : null;
  const max = typeof props.max !== 'undefined' ? props.max : null;
  const integer = typeof props.integer !== 'undefined' ? props.integer : false;

  let width = 72;

  if(typeof props.width !== 'undefined'){
    if(props.width === 'xs'){
      width = 16;
    }else if(props.width === 'sm'){
      width = 24;
    }else if(props.width === 'lg'){
      width = 48;
    }else if(props.width === 'xl'){
      width = 84;
    }
  }

  const validate = (v):boolean => {
    console.log('val', v);
    let isValidate = true;

    if(v !== ''){
      if(Number(v).toString() !== v){
        isValidate = false;
      }

      if(min !== null){
        if(Number(v) < min){
          isValidate = false;
        }
      }

      if(max !== null){
        if(Number(v) > max){
          isValidate = false;
        }
      }
    }

    return isValidate;
  }

  return (
    <>
      <label className="block">
        <span className="text-sm text-default">{props.label}</span>
        <input
          name={props.name}
          type="number"
          className={`text-sm form-input block border-underline w-${width}`}
          placeholder={props.placeholder}
          value={value}
          onKeyDown={(e) => {
            if(e.key === 'e') e.preventDefault();
            if(integer){
              if(e.key === '.'){
                e.preventDefault();
              }
            }
            if(min === 0){
              if(e.key === '-'){
                e.preventDefault();
              }
            }
          }}
          onChange={(e) => {
            if(validate(e.target.value) && typeof props.onChange !== 'undefined') props.onChange(e.target.value);
          }}
        />
      </label>

      {typeof props.error !== 'undefined' && props.error !== '' && (
        <p className="mt-1 text-xs text-red-500 capitalize">{props.error}</p>
      )}
    </>
  );
};
