import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        Terms and Conditions for BrickBix
      </Typography>
      <Divider />

      <Typography variant="h6" gutterBottom>
        Introduction
      </Typography>
      <Typography paragraph>
        Welcome to BrickBix, your go-to platform for smart real estate solutions. By accessing or using any of our services, you agree to be bound by the following Terms and Conditions. Please read them carefully. If you disagree with any part of these Terms, we advise you not to use our platform or services.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Acceptance of Terms
      </Typography>
      <Typography paragraph>
        By creating an account or using the BrickBix platform, you confirm that you have read, understood, and accepted these Terms and Conditions. Your continued use of the platform constitutes ongoing acceptance and agreement to comply with these Terms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Services Provided
      </Typography>
      <Typography paragraph>
        BrickBix is designed to support real estate agents by offering a range of technological solutions that simplify and enhance their workflow:
      </Typography>
      <ul>
        <li>
          <strong>Open Network for Lead and Requirement Sharing:</strong> Connect with fellow real estate agents to exchange client leads and property requirements in a seamless and secure environment.
        </li>
        <li>
          <strong>Inventory Management:</strong> Organize, track, and manage your property listings in one place. Our platform allows you to maintain an updated and easily accessible portfolio of your property inventory.
        </li>
        <li>
          <strong>Fresh Property Leads from Major Developers:</strong> Gain access to high-quality, exclusive property leads from top developers, ensuring you stay ahead with fresh opportunities in the market.
        </li>
      </ul>

      <Typography variant="h6" gutterBottom>
        3. User Responsibilities
      </Typography>
      <Typography paragraph>
        As a user of the BrickBix platform, you agree to the following:
      </Typography>
      <ul>
        <li>
          <strong>Accurate Information:</strong> You are responsible for ensuring that all personal and professional information provided during registration and throughout your use of the platform is complete, current, and accurate.
        </li>
        <li>
          <strong>Account Security:</strong> You are responsible for maintaining the security and confidentiality of your login credentials. Any activity that occurs under your account is your responsibility. Please notify us immediately if you suspect any unauthorized use of your account.
        </li>
      </ul>

      <Typography variant="h6" gutterBottom>
        4. Limitation of Liability
      </Typography>
      <Typography paragraph>
        BrickBix provides its services “as is” and makes no warranties regarding the accuracy, reliability, or availability of the platform. We are not responsible for any direct, indirect, incidental, or consequential damages that may arise from your use of our services, including, but not limited to, loss of data, revenue, or business opportunities.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Modifications to Terms
      </Typography>
      <Typography paragraph>
        BrickBix reserves the right to update or modify these Terms at any time. Any changes will be posted on our platform, and your continued use of the platform after such changes have been made will signify your acceptance of the modified Terms. We recommend reviewing these Terms periodically to stay informed of any updates.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Governing Law
      </Typography>
      <Typography paragraph>
        These Terms and Conditions are governed by and interpreted according to the laws applicable in your jurisdiction. By using BrickBix, you agree that any disputes will be subject to the exclusive jurisdiction of the courts in your region.
      </Typography>
    </Box>
  );
};

export default TermsAndConditions;
