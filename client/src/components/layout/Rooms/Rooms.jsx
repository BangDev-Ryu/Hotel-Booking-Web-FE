import * as React from 'react';
import { 
    Card, 
    CardActionArea, 
    CardContent, 
    CardMedia, 
    Container, 
    Typography,
} from '@mui/material';
import './Rooms.css'

const Rooms = () => {
    return (
        <Container id='rooms' maxWidth='lg' sx={{height: '100vh', pt: '40px'}}>
            <Typography align="center" fontSize='30px' fontWeight='600' fontFamily='monospace'>
                ROOMS & SUITES
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '40px' }}>
                <Card className='room-card' sx={{ maxWidth: 360, backgroundColor: 'black'}} variant='0'>
                    <CardActionArea>
                        <CardMedia
                            className="card-img"
                            component="img"
                            height="450"
                            image="../../../public/images/rooms/room1.jpg"
                            alt="room1"
                        />
                        <CardContent  sx={{ backgroundColor: 'white', height: '100px' }}>
                            <Typography component="div" align='center' fontFamily='monospace' fontWeight='600' fontSize='20px'>
                                Suite
                            </Typography>
                            <Typography component="div" align='center' fontFamily='monospace' fontWeight='500' fontSize='18px'>
                                20$/night
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <Card className='room-card' sx={{ maxWidth: 360, backgroundColor: 'black'}} variant='0'>
                    <CardActionArea>
                        <CardMedia
                            className="card-img"
                            component="img"
                            height="450"
                            image="../../../public/images/rooms/room2.jpg"
                            alt="room2"
                        />
                        <CardContent  sx={{ backgroundColor: 'white', height: '100px' }}>
                            <Typography component="div" align='center' fontFamily='monospace' fontWeight='600' fontSize='20px'>
                                Double room
                            </Typography>
                            <Typography component="div" align='center' fontFamily='monospace' fontWeight='500' fontSize='18px'>
                                40$/night
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <Card className='room-card' sx={{ maxWidth: 360, backgroundColor: 'black'}} variant='0'>
                    <CardActionArea>
                        <CardMedia
                            className="card-img"
                            component="img"
                            height="450"
                            image="../../../public/images/rooms/room3.jpg"
                            alt="room3"
                        />
                        <CardContent  sx={{ backgroundColor: 'white', height: '100px' }}>
                            <Typography component="div" align='center' fontFamily='monospace' fontWeight='600' fontSize='20px'>
                                Family room
                            </Typography>
                            <Typography component="div" align='center' fontFamily='monospace' fontWeight='500' fontSize='18px'>
                                60$/night
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>         
            </div>
        </Container>
    );
};

export default Rooms;