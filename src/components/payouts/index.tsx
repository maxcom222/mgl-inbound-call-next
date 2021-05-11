import React, {useState} from 'react';
import {Button} from 'components/buttons';
import Card from 'components/card';
import PayoutForm from './payout-form';

const Payouts: React.FunctionComponent<any> = (props) => {
  const emptyPayout = {
    payoutType: 'FIXED_AMOUNT',
    payoutValue: '',
    conversionType: '',

    conversionValue: 0, // not used

    deDupeSetting: {
      secondsFromLastCall: -1
    },

    schedule: {
      allTimeCap: -1,
      allTimeSumCap: -1,
      monthlyCap: -1,
      monthlySumCap: -1,
      dailyCap: -1,
      dailySumCap: -1,
      hourlyCap: -1,
      hourlySumCap: -1,
      concurrencyCap: -1,

      timeZoneId: '',

      hoursOfOperation: [],
    },

    criteria: [
      {
        tagRoutableRule: []
      }
    ]
  };

  const payouts = props.value;
  const [payoutOpen, setPayoutOpen] = useState({
    new: false,
    index: -1
  });

  return (
    <div>
      <Button
        outlined
        size="lg"
        rightIcon="Plus"
        className="w-full mb-2"
        disabled={payoutOpen.index !== -1}
        onClick={() => {
          const newPayouts = [...payouts];
          newPayouts.splice(0, 0, emptyPayout);
          props.onChange(newPayouts);
          setPayoutOpen({
            new: true,
            index: 0
          });
        }}
      >
        {props.btnLabel}
      </Button>
      {payouts.map((el, key:number) => (
        <Card
          key={key}
          borderLeft
        >
          <div className="flex justify-between">
            <div className="flex">
              <div className="mr-2">{key + 1}</div>
              <div className="h-full bg-gray-500" style={{width: 2}}></div>
              <div className="ml-2">
                {el.type === 'FIXED_AMOUNT' ? `$${el.payoutValue}` : `${el.payoutValue  }%`} on {el.payoutType}
              </div>
            </div>
            <div className="flex">
              {typeof props.controllable &&
                <>
                  <Button
                    flat
                    icon
                    leftIcon="Edit"
                    className="mr-2"
                    onClick={() => {
                      setPayoutOpen({
                        new: false,
                        index: key
                      });
                    }}
                    disabled={payoutOpen.index !== -1}
                  />
                  <Button
                    flat
                    icon
                    leftIcon="X"
                    className="mr-2"
                    onClick={() =>  {
                      const newPayouts = [...payouts];
                      newPayouts.splice(key, 1);
                      props.onChange(newPayouts);
                      setPayoutOpen({
                        new: false,
                        index: -1
                      });
                    }}
                    disabled={payoutOpen.index !== -1}
                  />
                </>
              }
            </div>
          </div>
          {payoutOpen.index === key &&
            <div className="pt-3">
              <PayoutForm
                value={el}
                new={payoutOpen.new}
                onChange={(value) => {
                  const newPayouts = [...payouts];
                  newPayouts[key] = value;
                  props.onChange(newPayouts);
                  setPayoutOpen({
                    new: false,
                    index: -1
                  });
                }}
                onCancel={() => {
                  setPayoutOpen({
                    new: false,
                    index: -1
                  });
                }}
                onDelete={() => {
                  const newPayouts = [...payouts];
                  newPayouts.splice(0, 1);
                  props.onChange(newPayouts);
                  setPayoutOpen({
                    new: false,
                    index: -1
                  });
                }}
              />
            </div>
          }
        </Card>
      ))}
    </div>
  );
}

export default Payouts;