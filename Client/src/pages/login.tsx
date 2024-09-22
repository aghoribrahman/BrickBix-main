import { useLogin } from "@refinedev/core";
import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography, TypographyProps } from '@mui/material';
import brickbix from '../assets/brick-bix.png';
import { CredentialResponse } from "../interfaces/google";
import { keyframes } from '@emotion/react';
import { css } from '@emotion/react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();

  const GoogleButton = (): JSX.Element => {
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
              login(res);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []);


    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%" // Ensures it takes full width
      >
        <div ref={divRef} style={{ width: '100%', textAlign: 'center' }} />
      </Box>
    );
  };
  
  const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedTypography = ({ children, ...props }: TypographyProps) => (
  <Typography
    sx={{
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: 'text.secondary',
      fontSize: '12px',
      animation: `${fadeIn} 0.5s ease-in-out`, // Apply the animation here
    }}
    {...props}
  >
    {children}
  </Typography>
);

  return (

    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Box
        display="flex"
        gap="25px"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ maxWidth: '90%', textAlign: 'center' }} // Add maxWidth for responsiveness
      >
        <div>
          <AnimatedTypography>Exchange Leads</AnimatedTypography>
          <AnimatedTypography>Platform Crafted For Real Estate Agents</AnimatedTypography>
        </div>
        <img style={{ maxWidth: '90px', width: '100%' }} src={brickbix} alt="brickbix" />
          <Typography> <GoogleButton /> </Typography>
        <Typography sx={{ fontWeight: 'bold', fontStyle: "italic" }} color={"text.secondary"} fontSize="12px">
          
          Your Property Solution
        </Typography>
      </Box>
    </Container>

  );
}