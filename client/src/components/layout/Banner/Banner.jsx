import Carousel from 'react-bootstrap/Carousel';
import './Banner.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Banner = () => {
    return (
        <div style={{ position: 'relative' }}>
            <Carousel>
                <Carousel.Item>
                    <img className='w-100' 
                        src="/images/banners/banner1.jpg" alt="banner1" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className='w-100' 
                        src="/images/banners/banner2.jpg" alt="banner2" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className='w-100' 
                        src="/images/banners/banner3.jpg" alt="banner3" />
                </Carousel.Item>
            </Carousel>
            <div style={{ 
                position: 'absolute', 
                top: '0', 
                left: '0', 
                width: '100%', 
                height: '100%', 
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            }}></div>
            <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                color: 'white', 
                fontSize: '50px', 
                textAlign: 'center', 
                fontWeight: '700'
            }}>
                WELCOME
            </div>
        </div>
    ); 

};

export default Banner;