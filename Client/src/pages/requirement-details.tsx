import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import ChatBubble from "@mui/icons-material/ChatBubble";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";
import Star from "@mui/icons-material/Star";
import CustomButton from "../components/common/CustomButton";
import { useDelete, useGetIdentity } from "@refinedev/core";
import axios from "axios";
import BrickBix from "../assets/brick bix image.jpg"

function checkImage(//@ts-ignore
url) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}


const RequirementDetails = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
  const { mutate } = useDelete();
  const { id } = useParams();
  const [propertyInfo, setPropertyInfo] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        // Construct the API endpoint URL based on the id parameter
        const endpoint = `${apiUrl}/api/v1/requirement/${id}`;
        
        // Make the API call
        const response = await axios.get(endpoint);
        
        // Set propertyInfo to the response data
        setPropertyInfo(response.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };
  
    fetchPropertyDetails();
  }, [id]);
  
  

  if (!propertyInfo) {
    return <div>Loading...</div>;
  }

  const isCurrentUser =
  //@ts-ignore
   user?.email === propertyInfo?.creator?.email;

  const handleDeleteProperty = () => {
    const response = window.confirm("Are you sure you want to delete this property?");
    if (response) {
      mutate(
        {
          resource: "requirement",
          //@ts-ignore
          id: id,
        },
        {
          onSuccess: () => {
            navigate("/requirement");
          },
        }
      );
    }
  };

  return (
    <Box borderRadius="15px" padding="20px" bgcolor="#FCFCFC" width="fit-content">
          <Typography 
            sx={{ fontWeight: "bold", fontSize: '20px', marginBottom: '10px' }} 
            variant="subtitle2" 
            data-testid="header-user-name"
          >
            <span style={{ color: '#d84030' }}>Requirement</span>{' '}
            <span style={{ color: '#11418a' }}>Details</span>
          </Typography>

      <Grid container spacing={4}>
        {/* Property Details Section */}
        <Grid item xs={12} lg={6}>
          <Box maxWidth={764}>
            {/* Property Image */}
            <img
              //@ts-ignore
              src={propertyInfo.photo || BrickBix}
              alt="property_details-img"
              style={{ borderRadius: "10px", width: "100%", maxHeight: "330px" }}
              className="property_details-img"
            />


            <Box mt="15px">
              {/* Property Type and Rating */}
              <Stack direction="row" justifyContent="space-between" flexWrap="wrap" alignItems="center">
                <Typography fontSize={18} fontWeight={500} color="#11142D" textTransform="capitalize">
                  {//@ts-ignore
                  propertyInfo.propertyType}
                </Typography>
                <Box>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={`star-${item}`} sx={{ color: "#F2C94C" }} />
                  ))}
                </Box>
              </Stack>

              {/* Property Title, Location, and Price */}
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <Box>
                  <Typography fontSize={22} fontWeight={600} mt="10px" color="#11142D">
                    {//@ts-ignore
                    propertyInfo.title}
                  </Typography>
                  <Stack mt={0.5} direction="row" alignItems="center" gap={0.5}>
                    <Place sx={{ color: "#808191" }} />
                    <Typography fontSize={14} color="#808191">
                      {//@ts-ignore
                      propertyInfo.location}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography fontSize={16} fontWeight={600} mt="10px" color="#11142D">
                    Budget
                  </Typography>
                  <Stack direction="row" alignItems="flex-end" gap={1}>
                  <Typography fontSize={14} fontWeight={600} color="#0F52BA">
                    ₹ {new Intl.NumberFormat('en-IN').format(parseFloat(//@ts-ignore
                      propertyInfo.askedPrice))}/-
                  </Typography>
                    
                   
                  </Stack>
                </Box>
              </Stack>

              {/* Property Description */}
              <Stack mt="25px" direction="column" gap="10px">
                <Typography fontSize={18} color="#11142D">
                  Description
                </Typography>
                <Typography fontSize={14} color="#808191">
                  {//@ts-ignore
                  propertyInfo.description}
                </Typography>
              </Stack>
              <Stack mt="25px" direction="column" gap="10px">
                <Typography fontSize={18} color="#11142D">
                  Contact
                </Typography>
                <Typography fontSize={14} color="#808191">
                  {//@ts-ignore
                  propertyInfo.phone}
                </Typography>
              </Stack>
              <Stack mt="25px" direction="column" gap="10px">
                <Typography fontSize={18} color="#11142D">
                  Deal Type
                </Typography>
                <Typography fontSize={14} color="#808191">
                  {//@ts-ignore
                  propertyInfo.dealType}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Grid>

        {/* Property Agent Section */}
        <Grid item xs={12} lg={6}>
          <Box display="flex" flexDirection="column" gap="20px">
            {/* Property Agent Info */}
            <Stack
              width="100%"
              p={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
              border="1px solid #E4E4E4"
              borderRadius={2}
            >
              <Stack mt={2} justifyContent="center" alignItems="center" textAlign="center">
                <img
                  src={//@ts-ignore
                    propertyInfo.creator && checkImage(propertyInfo.creator.avatar)//@ts-ignore
                      ? propertyInfo.creator.avatar
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                  }
                  alt="avatar"
                  width={90}
                  height={90}
                  style={{ borderRadius: "100%", objectFit: "cover" }}
                />

                <Box mt="15px">
                  <Typography fontSize={18} fontWeight={600} color="#11142D">
                    {
                    //@ts-ignore
                    propertyInfo.creator && propertyInfo.creator.name ? propertyInfo.creator.name : "Unknown"}
                  </Typography>

                  <Typography mt="5px" fontSize={14} fontWeight={400} color="#808191">
                    Real Estate Agent
                  </Typography>
                </Box>

                <Stack mt="15px" direction="row" alignItems="center" gap={1}>
                  <Place sx={{ color: "#808191" }} />
                  <Typography fontSize={14} fontWeight={400} color="#808191">
                    Indore, India
                  </Typography>
                </Stack>

                <Typography mt={1} fontSize={16} fontWeight={600} color="#11142D">
                  {//@ts-ignore
                  propertyInfo.creator && propertyInfo.creator.allRequirement ? propertyInfo.creator.allRequirement.length : 0} Properties
                </Typography>
              </Stack>

              {/* Action Buttons */}
              <Stack width="100%" mt="25px" direction="row" flexWrap="wrap" gap={2}>
                {isCurrentUser ? (
                  <>
                    <CustomButton
                      title="Edit"
                      backgroundColor="#0F52BA"
                      color="#FCFCFC"
                      fullWidth
                      icon={<Edit />}
                      handleClick={() => {
                        navigate(`/requirement/properties-requirement/edit/${// @ts-ignore
                          propertyInfo._id}`);
                      }}
                    />
                    <CustomButton
                      title="Delete"
                      backgroundColor="#d42e2e"
                      color="#FCFCFC"
                      fullWidth
                      icon={<Delete />}
                      handleClick={handleDeleteProperty}
                    />
                  </>
                ) : (
                  <>
                    <CustomButton
                      title="WhatsApp"
                      backgroundColor="#25D366" // WhatsApp green color
                      color="#FCFCFC"
                      fullWidth
                      icon={
                        <img
                          src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/whatsapp.svg"
                          alt="WhatsApp"
                          style={{ width: '24px', height: '24px' }}
                        />
                      }
                      handleClick={() => {
                        const currentUrl = window.location.href; // Get current URL
                        const message = `Hello, I'm interested in the requirement listed on BrickBix. Here is the link to the requirement: ${currentUrl}`;
                        //@ts-ignore
                        const phoneNumber = `+91${propertyInfo.phone}`;
                        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    />
                    <CustomButton
                      title="Call"
                      backgroundColor="#4CAF50" // Call button color
                      color="#FCFCFC"
                      fullWidth
                      icon={<Phone />}
                      handleClick={() => {//@ts-ignore
                        window.open(`tel:${propertyInfo.phone}`);
                      }}
                    />
                  </>
                )}
              </Stack>
            </Stack>

            {/* Google Maps 
            <Stack>
              <img
                src="https://serpmedia.org/scigen/images/googlemaps-nyc-standard.png?crc=3787557525"
                width="100%"
                height={306}
                style={{ borderRadius: 10, objectFit: "cover" }}
              />
            </Stack>
                  */}
            {/* Book Now Button
            <Box>
              <CustomButton title="Book Now" backgroundColor="#0F52BA" color="#FCFCFC" fullWidth />
            </Box> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequirementDetails;
