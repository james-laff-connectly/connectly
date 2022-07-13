import React, { useState } from 'react';

export default function PurchaseDemo({ id }) {
  const [psid, setPsid] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('Would you recommend us to a friend?');
  
  const demoTransaction = () => {
    fetch('/business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessPageId: id,
        reviewTypeId: 1,
        customerId: psid,
        feedbackMessage
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
        <label htmlFor='feedback'>
        Enter your desired feedback message:
        </label>
        <input type='text' id='feedback' name='feedback' value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)} placeholder={feedbackMessage} />
        <button id='transaction' type='button' onClick={demoTransaction}>
          Demo Transaction
        </button>
      </div>
    </div>
  );
}