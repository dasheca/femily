import axios from 'axios';
import Specialist from '../components/Specialist';
import '../components/styles.css';
import React, { useState, useEffect } from 'react';
import Footer from '../components/Futter';

const SpecialistsPage = () => {
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/specialist`);
        setSpecialists(response.data);
      } catch (error) {
        console.error('Error fetching specialists:', error);
      }
    };

    fetchSpecialists();
  }, []);

  return (
    <div className="container">
      <div className="row">
      <p style={{textAlign: 'center', fontSize: '2vw', fontFamily: 'Cormorant sans-serif'}}>НАШИ СПЕЦИАЛИСТЫ</p>
        <Specialist specialists={specialists} />
        <Footer />
      </div>
    </div>
  );
};

export default SpecialistsPage;
