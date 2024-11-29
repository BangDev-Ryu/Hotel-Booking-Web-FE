import { Container, Link, Typography } from '@mui/material'
import React from 'react'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  return (
    <div style={{ position: 'relative' }}>
      <Container 
        maxWidth='none' 
        sx={{
            height: '400px', 
            width: '100%',
            display: 'flex', 
            alignItems: 'center',
            backgroundImage: 'url(../../../public/images/banners/banner3.jpg)',
            backgroundSize: 'cover',

            }}>
        <Container sx={{display: 'flex', justifyItems: 'center', zIndex: '10'}}>
          <Container>
            <Typography variant='none' className='footer-title' color='white' fontFamily='monospace'>
              HOTEL AIKO
            </Typography>

            <Typography color='white' fontFamily='monospace' sx={{mt: '16px'}}>
              (+84) 0123456789
              <br/>
              mailmail@gmail.com
              <br/>
              273 Đ. An Dương Vương, Phường 3, Quận 5, TPHCM, Việt Nam
            </Typography>
            <div className='footer-link'>
              <InstagramIcon/>
              <YouTubeIcon/>
              <FacebookIcon/>
              <InstagramIcon/>
            </div>
           
          </Container>

          <Container>
            <Typography variant='none' className='footer-title' color='white' fontFamily='monospace'>
              Information
            </Typography>

            <Typography color='white' fontFamily='monospace' sx={{mt: '16px', display: 'flex', justifyItems: 'center'}}>
              Home
              <br/>
              Privacy
              <br/>
              About us
              <br/>
              Contact us
            </Typography>
          </Container>

          <Container>
            <Typography variant='none' className='footer-title' color='white' fontFamily='monospace'>
              Join with us
            </Typography>

            <Typography color='white' fontFamily='monospace' sx={{mt: '16px'}}>
              Discover a World of Elegance and Refinement in Our Free Membership Program. Join Us for Special Offers!
            </Typography>
          </Container>
        </Container>
      </Container>
      
      

      <div style={{
        background: 'linear-gradient(0deg, #000, #69686D)',
        opacity: 0.5,
        position: 'absolute', 
        top: '0', 
        left: '0', 
        width: '100%', 
        height: '100%', 
      }}>
      </div>

      <Container maxWidth='none' sx={{display: 'flex', justifyContent: 'center', p: '4px', zIndex: '20', backgroundColor: '#f6f6f6'}}>
        <span style={{fontSize: '14px'}}>
          <CopyrightIcon fontSize='16px'/> <span> HOTEL AIKO All Rights Reserved</span>
        </span>
      </Container>
    </div>
  )
}

export default Footer