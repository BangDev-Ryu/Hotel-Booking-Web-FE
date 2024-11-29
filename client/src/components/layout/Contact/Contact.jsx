import React from 'react'
import GoogleMapReact from 'google-map-react';
import { Container, Typography } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';

const AnyReactComponent = ({ text }) => (
    <div style={{ position: 'fixed', transform: 'translate(-50%, -100%)' }}>
        {text}
    </div>
);


const Contact = () => {
    const defaultProps = {
        center: {
          lat: 10.759952662575868,
          lng: 106.68227036568102
        },
        zoom: 18
    };

    return (
        <Container id='contact' maxWidth='none' sx={{height: '100vh', width: '100%', pt: '40px'}}>
            <Typography align="center" fontSize='30px' fontWeight='600' fontFamily='monospace'>
                CONTACT
            </Typography>
            <Container 
                className='contact-list' 
                sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pb: '40px', pt: '40px'}}
                >
                <Container>
                    <ApartmentIcon/>
                    <Typography>
                        273 Đ. An Dương Vương, Phường 3, Quận 5, TPHCM, Việt Nam
                    </Typography>
                </Container>

                <Container>
                    <LocalPhoneIcon/>
                    <Typography>
                        (+84) 0123456789
                    </Typography>
                </Container>

                <Container>
                    <EmailIcon/>
                    <Typography>
                        mailmail@gmail.com
                    </Typography>
                </Container>
            </Container>

            <Container maxWidth='none' sx={{height: '60vh', width: '80%'}}>
                <GoogleMapReact
                    bootstrapURLKeys={{key: ''}}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    yesIWantToUseGoogleMapApiInternals
                >
                    
                    <AnyReactComponent
                        
                        lat={defaultProps.center.lat}
                        lng={defaultProps.center.lng}
                        text={<RoomIcon color = 'red'/>}
                    />
                </GoogleMapReact>
            </Container>
        </Container>
    )
}

export default Contact