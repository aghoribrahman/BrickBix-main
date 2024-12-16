import Place from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import { PropertyCardProps } from "../../interfaces/property";

const PropertyCard = ({
  id,
  title,
  location,
  price,
  photo,
  propertyType,
  dealType,
  phone,
  url,
}: PropertyCardProps) => {
  return (
    <Card
      component={Link}
      to={`/${url}/show/${id}`}
      sx={{
        maxWidth: { xs: "100%", md: "330px" }, // Adjusted for mobile responsiveness
        width: "100%", // Make the card responsive
        cursor: "pointer",
        textDecoration: "none",
        backgroundColor: "#f9f9f9",
        borderRadius: "16px",
        position: "relative", // Ensure relative positioning for absolute positioning of tag
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow for depth
        transition: "transform 0.2s, box-shadow 0.2s", // Smooth transition for hover effect
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
        },
      }}
      elevation={0}
    >
      {/* Tag positioned at the top left */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "#0F52BA",
          color: "#ffffff",
          padding: "4px 8px",
          borderTopLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <Typography variant="body2">{dealType}</Typography>
      </Box>

      <CardMedia
        sx={{ borderRadius: "10px" }}
        component="img"
        width="100%"
        height={210}
        image={photo}
        alt="card image"
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Adjusted for mobile responsiveness
          justifyContent: "space-between",
          gap: "10px",
          paddingX: "5px",
        }}
      >
        <Stack direction="column" gap={1}>
          <Typography
            sx={{ textDecoration: "none" }}
            fontSize={16}
            marginLeft={"5px"}
            fontWeight={600}
            color="#11142d"
          >
            {title}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
              <Place sx={{ fontSize: 20, color: "#1976d2" }} />
              <Typography
                variant="body2"
                color="#808191"
                fontWeight={500}
                sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
              >
                {location}
              </Typography>
            </Stack>
        </Stack>

        <Box
          px={1.5}
          py={0.5}
          borderRadius={4}
          bgcolor="#E5E4E2"
          height="fit-content"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={1} // Added gap for margin between elements
        >
          <Typography fontSize={13} fontWeight={600} color="#0F52BA" textAlign="center">
            ₹ {new Intl.NumberFormat("en-IN").format(parseFloat(price))}/-
          </Typography>
          <Typography fontSize={16} fontWeight={600} textAlign="center">
            {propertyType}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;