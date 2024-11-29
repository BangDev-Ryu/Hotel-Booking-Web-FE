import { Container, Typography } from '@mui/material'
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import React from 'react'

const Offer = () => {
  return (
    <Container 
      id='offer'
      maxWidth='none' 
      sx={{
        width: '100%', 
        height: '100vh', 
        backgroundColor: '#f6f6f6',
        pt: '40px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}
    >
      <Typography 
        align="center" 
        fontSize='30px' 
        fontWeight='600' 
        fontFamily='monospace' 
        mb={4}
      >
        OFFERS
      </Typography>
      
      <Carousel 
        className="custom-carousel" 
        style={{ 
          height: '600px',
          width: '100%', 
          maxWidth: '900px' 
        }}
      >
        <Carousel.Item className="h-100">
          <img 
            className='w-100 h-100'
            style={{ objectFit: 'cover' }} 
            src="/images/offers/offer1.jpg" 
            alt="offer1" 
          />
          <Carousel.Caption>
            <h3>Restaurent</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="h-100">
          <img 
            className='w-100 h-100' 
            style={{ objectFit: 'cover' }}
            src="/images/offers/offer2.jpg" 
            alt="offer2" 
          />
          <Carousel.Caption>
            <h3>Swimming pool</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="h-100">
          <img 
            className='w-100 h-100' 
            style={{ objectFit: 'cover' }}
            src="/images/offers/offer3.jpg" 
            alt="offer3" 
          />
          <Carousel.Caption>
          <h3>Spa</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  )
}

export default Offer