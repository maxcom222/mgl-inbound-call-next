import React from 'react';

const WizardForm: React.FunctionComponent<any> = (props) => {
  const steps = props.steps;
  // const width: number = typeof props.width === 'undefined' ? 700 : props.width;
  const step: number = typeof props.step === 'undefined' ? 0 : props.step;

  return (
    <div className="wizard-form">
      <div className="wizard-form-header flex">
        {steps.map((el, key:number) => (
            <div
              key={key}
              className="pb-4"
              style={{ width: '100%' }}
            >
              <div className="text-center" style={{ width: '15rem' }}>
                <p className="text-sm mb-1">
                  {step === key ? (
                    <b>{`${key + 1  }. ${el.title}`}</b>
                  ) : (
                    `${key + 1  }. ${el.title}`
                  )}
                </p>
                <p className="text-xs">{el.subTitle}</p>
              </div>
            </div>
          ))}
      </div>
      <hr className="mb-2" />
      <div className="wizard-form-body relative">
        <div className="flex justify-center">
          <div style={{ width: '100%' }}>
            {steps.map((el, key) => {
              if (step === key) {
                return <div key={key}>{el.component}</div>;
              }

              return <div key={key}></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardForm;
