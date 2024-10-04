import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Paper,
  Snackbar,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

export default function ContactUs() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true); // Disable the button

    try {
      const response = await fetch('https://formbold.com/s/oPgNM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        setOpen(true);
        setIsSubmitted(true); // Set the form as submitted
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (isSubmitted) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Thank You!
        </Typography>
        <Typography variant="body1" align="center">
          Your message has been sent successfully.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography 
            sx={{ fontWeight: "bold", fontSize: '20px' }} 
            variant="subtitle2" 
            data-testid="header-user-name"
          >
            <span style={{ color: '#d84030' }}>Contact</span>{' '}
            <span style={{ color: '#11418a' }}>Us</span>
          </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="mobile-number"
                    label="Mobile Number"
                    name="mobileNumber"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="message"
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting} // Disable button when submitting
                  sx={{
                    backgroundColor: '#11418a', // Custom color
                    borderRadius: '30px', // Curvy corners
                    '&:hover': {
                      backgroundColor: '#0f2a5b', // Darker shade on hover
                    },
                    transition: 'background-color 0.3s ease', // Smooth transition on hover
                    padding: '12px 20px', // Adjust padding for better responsiveness
                    fontWeight: 'bold', // Make text bold
                    textTransform: 'none', // Prevent uppercase transformation
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1 }} /> Near Bengali Square
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1 }} /> +91 93401 99672
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1 }} /> InfoBrickBix@gmail.com
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Message sent successfully!"
      />
    </Container>
  );
}