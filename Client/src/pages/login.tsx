import { useLogin } from "@refinedev/core";
import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import brickbix from '../assets/brick-bix.png';
import { CredentialResponse } from "../interfaces/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

  return (

    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10, // Remove default padding
      }}
    >
      <Box
        display="flex"
        gap="36px"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ maxWidth: '90%', textAlign: 'center' }} // Add maxWidth for responsiveness
      >
        <img style={{ maxWidth: '90px', width: '100%' }} src={brickbix} alt="brickbix" />
          <GoogleButton />
        <Typography sx={{ fontWeight: 'bold', fontStyle: "italic" }} color={"text.secondary"} fontSize="12px">
          Your Property Solution
        </Typography>
      </Box>
    </Container>

  );
}