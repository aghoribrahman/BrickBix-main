import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Typography,
  Button,
  Snackbar,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { cities } from './CitiesList';

interface UserFormProps {
  name?: string;
  email?: string;
  onFormSubmit: (success: boolean) => void;
}
const UserForm: React.FC<UserFormProps> = ({ 
  name: initialName = '', 
  email: initialEmail = '',
  onFormSubmit 
}) => {
  interface City {
    title: string;
  }


  const [name, setName] = useState<string>(initialName);
  const [email, setEmail] = useState<string>(initialEmail);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [workLocation, setWorkLocation] = useState<City | null>(null);
  const [reraNumber, setReraNumber] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [formLoading, setFormLoading] = useState(false); // Added state for form loading
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    workLocation: '',
    reraNumber: '',
  }); // Added state for form errors
  const [formSubmitted, setFormSubmitted] = useState(false); // Added state for form submission
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL);
  const [open, setOpen] = useState(false); // Added state for Snackbar

  useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
  }, [initialName, initialEmail]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setIsButtonDisabled(true);
    // setFormLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('workLocation', workLocation?.title || '');
    formData.append('reraNumber', reraNumber || 'None');
    
    // Validate form fields
    const errors = {
      name: name.trim() === '' ? 'Name is required' : '',
      email: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ? 'Invalid email address' : '',
      phoneNumber: phoneNumber.trim() === '' || phoneNumber.length !== 10 ? 'Phone number is required and must be 10 digits' : '',
      workLocation: workLocation === null ? 'Work location is required' : '',
      reraNumber: reraNumber.trim() !== '' && reraNumber.length !== 5 ? 'RERA number must be 5 digits if provided' : '',
    };

    if (Object.values(errors).some(error => error !== '')) {
      setFormErrors(errors);
      setIsButtonDisabled(false);
      setFormLoading(false);
       // Set formSubmitted to true on form submission
       // Set form loading to false in case of validation errors
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)), // Ensure userData is a valid object
      });


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
     
      setFormLoading(false); // Set form loading to false after successful submission
      setFormSubmitted(true); // Set form submitted to true after successful submission
      setOpen(true); // Open the Snackbar
      onFormSubmit(true); // Call with success=true
     } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setFormLoading(false); // Set form loading to false in case of error
      onFormSubmit(false); // Call with success=false
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(e as any);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (formSubmitted) {
    return null; // Remove the form from display if submitted
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px', padding:"20px" }}>
      <Typography variant="h5" component="h2" gutterBottom>Agent Form</Typography> {/* Added form title */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={formErrors.name !== ''}
            helperText={formErrors.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={formErrors.phoneNumber !== ''}
            helperText={formErrors.phoneNumber}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email !== ''}
            helperText={formErrors.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete 
            options={cities}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Work Location"
                variant="outlined"
                error={formErrors.workLocation !== ''}
                helperText={formErrors.workLocation}
              />
            )}
            
            onChange={(e, newValue) => setWorkLocation(newValue)}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ margin: '10px 0' }}>
          <TextField
            fullWidth
            label="RERA Number (Optional)"
            variant="outlined"
            value={reraNumber}
            onChange={(e) => setReraNumber(e.target.value)}
            error={formErrors.reraNumber !== ''}
            helperText={formErrors.reraNumber ? formErrors.reraNumber : "If you do not have a RERA number, you can leave this field empty."}
          />
        </Grid>
      </Grid>
      <Button
        onClick={handleButtonClick}
        variant="contained"
        style={{ backgroundColor: "#0F52BA", borderRadius: "20px" }}
        disabled={formLoading}
      >
        {formLoading ? "Submitting..." : "Submit"}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Thank you for your submission!"
      />
    </form>
  );
};

export default UserForm;