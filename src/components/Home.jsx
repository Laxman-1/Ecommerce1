import React from 'react';

import LatestProduct from './common/LatestProduct';
import FeaturedProduct from './common/FeaturedProduct';
import Hero from './common/Hero';
import Layout from './common/layout';
//import SliderTwoImg from '../assets/images/banner-2.jpg'

const Home = () => {
  return (
<>
<Layout>

  <Hero/>
 <LatestProduct/>
 <FeaturedProduct/>

</Layout>


</>
   
  );
}

export default Home;
