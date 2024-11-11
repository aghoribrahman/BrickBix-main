import { useLogin } from "@refinedev/core";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from '@mui/material';
import { CredentialResponse } from "../interfaces/google";
import brickbix from '../assets/brick-bix.png';
import animation1 from '../assets/Gif/animation 1.gif';
import animation2 from '../assets/Gif/Animation 2.gif';
import animation3 from '../assets/Gif/Animation 3.gif';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleButton: React.FC<{ onLogin: (res: CredentialResponse) => void }> = ({ onLogin }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "BrickBix"; 
    if (typeof window === "undefined" || !window.google || !divRef.current) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        ux_mode: "popup",
        client_id: GOOGLE_CLIENT_ID,
        callback: async (res: CredentialResponse) => {
          if (res.credential) {
            onLogin(res);
          }
        },
      });
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "filled_blue",
        size: "medium",
        type: "standard",
      });
    } catch (error) {
      console.error(error);
    }
  }, [onLogin]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
      <div ref={divRef} style={{ width: '100%', textAlign: 'center' }} />
    </Box>
  );
};

const LoginCarousel: React.FC<{ images: string[], captions: string[] }> = ({ images, captions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // Start fade-in
      }, 500); // Delay for caption transition
    }, 3000); // Change caption every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box>
      <Typography
        sx={{
          position: 'absolute',
          top: "24%",
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'grey.700',
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontSize: '16px',
          zIndex: 10,
          whiteSpace: 'nowrap',
          opacity: fade ? 1 : 0, // Fade effect
          transition: 'opacity 0.5s ease-in-out', // Transition for fade-in and fade-out
        }}
      >
        {captions[currentIndex]}
      </Typography>
      <Box sx={{ position: 'relative', width: '90px', height: '90px', overflow: 'hidden', borderRadius: '15px' }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Animation ${index + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: `${(index - currentIndex) * 100}%`,
              transition: 'left 1s ease-in-out',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();

  const captions = [
    "Explore Properties",
    "Manage Inventories",
    "Close Deal Faster"
  ];

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative'
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '50px',
        height: '50px',
      }}>
        <img src={brickbix} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Box>

      <Box
        display="flex"
        gap="25px"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ maxWidth: '90%', textAlign: 'center' }}
      >
        <LoginCarousel 
          images={[animation1, animation2, animation3]}
          captions={captions}
        />

        <GoogleButton onLogin={login} />
        
        <Typography sx={{ fontWeight: 'bold', fontStyle: "italic" }} color={"text.secondary"} fontSize="12px">
          BrickBix Your Property Solution
          <p>Crafted for real estate agents</p>
        </Typography>
      </Box>
    </Container>
  );
};
