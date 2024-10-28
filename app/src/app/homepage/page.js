import React from 'react';
import '../components/amerove_komponente/css/MainSection.css'; 
import MultiActionAreaCard  from '../components/amerove_komponente/komponente/MultiActionAreaCard';
import CardGrid from '../components/amerove_komponente/komponente/Card';
import TestimonialCard from '../components/amerove_komponente/komponente/Tcard';
import SubscriptionPlans from '../components/amerove_komponente/komponente/SubscriptionPlans';
import TeamSection from '../components/amerove_komponente/komponente/TeamSection';
import ContactForm from '../components/amerove_komponente/komponente/ContactForm';
import Xtreme from '../components/amerove_komponente/komponente/Xtreme';

function App() {

  return (
      <div className="App">
        <Xtreme />
        <MultiActionAreaCard />
        <CardGrid />
        <TestimonialCard/>
        <SubscriptionPlans />
        <TeamSection/>
        <ContactForm/>
      </div>
  );
}

export default App;