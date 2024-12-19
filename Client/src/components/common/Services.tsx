import React from 'react';
import GavelIcon from '@mui/icons-material/Gavel';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import { Card, CardContent, CardActions, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[5],
    },
}));

const services = [
    {
        title: "Support For Agreement and Lawyer",
        description: "Get professional legal support for your agreements and contracts.",
        whatsappNumber: "+919340199672",
        phoneNumber: "+919340199672",
        icon: <GavelIcon style={{ fontSize: 40, color: '#11418a' }} />,
        message: "Hello! I need support for agreements and legal advice."
    },
    {
        title: "Online Marketing of Property",
        description: "Promote your property effectively with our online marketing services.",
        whatsappNumber: "+919340199672",
        phoneNumber: "+919340199672",
        icon: <AdsClickIcon style={{ fontSize: 40, color: '#11418a' }} />,
        message: "Hi! I'm interested in online marketing for my property."
    },
    {
        title: "Property Background Check",
        description: "Ensure the legitimacy of your property with our thorough background checks.",
        whatsappNumber: "+919340199672",
        phoneNumber: "+919340199672",
        icon: <PlaylistAddCheckCircleIcon style={{ fontSize: 40, color: '#11418a' }} />,
        message: "Hello! I would like to request a property background check."
    },
];

const Service = () => {
    return (
        <div style={{ padding:'20px' }}>
            <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center', color: '#d84030' }}>
                Our <span style={{ color: '#11418a' }}>Services</span>
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {services.map((service, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <StyledCard>
                            <CardContent style={{ display: 'flex', alignItems: 'center'}}>
                                {service.icon}
                                <div style={{ marginLeft: '16px' }}>
                                    <Typography variant="h6" component="div">
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {service.description}
                                    </Typography>
                                </div>
                            </CardContent>
                            <CardActions style={{ padding:"10px" }}>
                            <Button
                                size="small"
                                variant="contained"
                                style={{ backgroundColor: '#11418a', color: '#ffffff', borderRadius: '20px', padding: '5px 15px' }} // WhatsApp button color and padding
                                onClick={() => window.open(`https://wa.me/${service.whatsappNumber}?text=${encodeURIComponent(service.message)}`, '_blank')}
                            >
                                WhatsApp
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                style={{ backgroundColor: '#d84030', color: '#ffffff', borderRadius: '20px', padding: '5px 15px' }} // Call button color, border radius, and padding
                                onClick={() => window.location.href = `tel:${service.phoneNumber}`}
                            >
                                Call
                            </Button>
                            </CardActions>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Service;