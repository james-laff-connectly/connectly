import React, { useState, useEffect } from 'react';
import Chart from '../components/Chart';
import PurchaseDemo from '../components/PurchaseDemo';

export default function MainContainer() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [id, setId] = useState(103650829078443);
  const [name, setName] = useState('Connectly');
  const [scores, setScores] = useState([]);
  
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`/business/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then(data => {
          if (!data.err) {
            setScores(data.scores);
          }
          else console.error(data.err) ;
        });
    }
  }, []);
  
  return (
    <div className="dashboard">
      <h1>Connectly Dashboard</h1>
      {scores && <Chart scores={scores} />}
      <PurchaseDemo id={id} />
    </div>
  );
}