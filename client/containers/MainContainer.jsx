import React, { Fragment, useState, useEffect } from 'react';
import Chart from '../components/Chart';

export default function MainContainer() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [id, setId] = useState(103650829078443);
  const [name, setName] = useState('Connectly');
  const [scores, setScores] = useState([]);
  
  useEffect(() => {
    if (!isLoggedIn) {
      fetch(`/business/${id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.err) {
            setScores(data);
          }
          else console.error(data.err) ;
        });
    }
  }, []);
  
  return (
    <div className="dashboard">
      <h1>Connectly Dashboard</h1>
      {isLoggedIn && <Fragment>
        <Chart data={scores} />
      </Fragment>
      }
    </div>
  );
}