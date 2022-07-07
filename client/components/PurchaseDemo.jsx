import React, { useState } from 'react';

export default function PurchaseDemo({ id }) {
  const [psid, setPsid] = useState('');
  
  const demoTransaction = () => {
    fetch('/business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessPageId: id,
        reviewTypeId: 1,
        customerId: psid
      }),
    });
  };
  
  return (
    <div className='purchase-demo'>
      <a href='https://www.messenger.com/t/103650829078443/'  target='_blank' rel='noopener noreferrer'>
      Click here for an interactive chatbot demo
      </a>
      <div>
        <label htmlFor='psid'>
        Enter your PSID to simulate a recently completed transaction:
        </label>
        <input type='text' id='psid' name='psid' value={psid}
          onChange={(e) => setPsid(e.target.value)} placeholder='123456789' />
        <button id='transaction' type='button' onClick={demoTransaction}>
          Demo Transaction
        </button>
      </div>
    </div>
  );
}