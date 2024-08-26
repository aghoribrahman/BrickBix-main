import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";
import Star from "@mui/icons-material/Star";
import CustomButton from "../components/common/CustomButton";
import { useDelete, useGetIdentity } from "@refinedev/core";
import axios from "axios";

function checkImage(url: string) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
  const { mutate } = useDelete();
  const { id } = useParams();
  const [propertyInfo, setPropertyInfo] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const endpoint = `http://localhost:8080/api/v1/properties/${id}`;
        const response = await axios.get(endpoint);
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
  //@ts-ignore
  const isCurrentUser = user?.email === propertyInfo?.creator?.email;

  const handleDeleteProperty = () => {
    const response = window.confirm("Are you sure you want to delete this property?");
    if (response) {
      mutate(
        //@ts-ignore
        { resource: "properties", id: id },
        { onSuccess: () => navigate("/allProperties") }
      );
    }
  };
  console.log(propertyInfo.title)
  console.log(propertyInfo.totalSquareFeet)
  return (
    <Box padding={{ xs: "10px", sm: "20px" }} bgcolor="#FCFCFC" borderRadius="15px" width="100%">
      <Typography fontSize={25} fontWeight={700} color="#11142D" textAlign="center" mb={3}>
        Property Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box>
            <img
            //@ts-ignore
              src={propertyInfo.photo}
              alt="property_details-img"
              style={{ borderRadius: "10px", width: "100%", maxHeight: "330px", objectFit: "cover" }}
            />
            <Box mt={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontSize={18} fontWeight={500} color="#11142D" textTransform="capitalize">
                  {
                  //@ts-ignore
                  propertyInfo.propertyType}
                </Typography>
                <Box>
                  {[...Array(5)].map((_, i) => (
                    <Star key={`star-${i}`} sx={{ color: "#F2C94C" }} />
                  ))}
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                <Box>
                  <Typography fontSize={22} fontWeight={600} color="#11142D">
                    {//@ts-ignore
                    propertyInfo.title}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1} mt={0.5}>
                    <Place sx={{ color: "#808191" }} />
                    <Typography fontSize={14} color="#808191">
                      {//@ts-ignore
                      propertyInfo.location}
                    </Typography>
                  </Stack>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography fontSize={16} fontWeight={600} color="#11142D">
                    Total Price
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color="#475be8">
                    ₹ {new Intl.NumberFormat('en-IN').format(parseFloat(//@ts-ignore
                    propertyInfo.price))}/-
                  </Typography>
                </Box>
              </Stack>

              <Typography fontSize={18} fontWeight={500} color="#11142D" mt={3}>
                Total Area:  <Typography fontSize={14} fontWeight={600} color="#475be8"> Sq. Ft. {//@ts-ignore
                propertyInfo.totalSquareFeet}</Typography>
              </Typography>

              <Typography fontSize={18} color="#11142D" mt={3}>
                Description
              </Typography>
              <Typography fontSize={14} color="#808191">
                {//@ts-ignore
                propertyInfo.description}
              </Typography>

              <Typography fontSize={18} color="#11142D" mt={3}>
                Contact
              </Typography>
              <Typography fontSize={14} color="#808191">
                {//@ts-ignore
                propertyInfo.phone}
              </Typography>

              <Typography fontSize={18} color="#11142D" mt={3}>
                Deal Type
              </Typography>
              <Typography fontSize={14} color="#808191">
                {//@ts-ignore
                propertyInfo.dealType}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Stack
              p={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
              border="1px solid #E4E4E4"
              borderRadius={2}
            >
              <img
                src={//@ts-ignore
                  propertyInfo.creator && checkImage(propertyInfo.creator.avatar)
                  //@ts-ignore
                    ? propertyInfo.creator.avatar
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                }
                alt="avatar"
                width={90}
                height={90}
                style={{ borderRadius: "100%", objectFit: "cover" }}
              />

              <Typography fontSize={18} fontWeight={600} color="#11142D" mt={2}>
                {//@ts-ignore
                propertyInfo.creator?.name || "Unknown"}
              </Typography>
              <Typography fontSize={14} fontWeight={400} color="#808191" mt={0.5}>
                Real Estate Agent
              </Typography>

              <Stack direction="row" alignItems="center" gap={1} mt={1}>
                <Place sx={{ color: "#808191" }} />
                <Typography fontSize={14} color="#808191">
                  Indore, India
                </Typography>
              </Stack>

              <Typography fontSize={16} fontWeight={600} color="#11142D" mt={1}>
                {//@ts-ignore
                propertyInfo.creator?.allProperties?.length || 0} Properties
              </Typography>

              <Stack width="100%" mt={2} direction="row" flexWrap="wrap" gap={2}>
                {isCurrentUser ? (
                  <>
                    <CustomButton
                      title="Edit"
                      backgroundColor="#475BE8"
                      color="#FCFCFC"
                      fullWidth
                      icon={<Edit />}
                      //@ts-ignore
                      handleClick={() => navigate(`/allProperties/properties/edit/${propertyInfo._id}`)}
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
                      backgroundColor="#25D366"
                      color="#FCFCFC"
                      fullWidth
                      icon={
                        <img
                          src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/whatsapp.svg"
                          alt="WhatsApp"
                          style={{ width: "24px", height: "24px" }}
                        />
                      }//@ts-ignore
                      handleClick={() => window.open(`https://wa.me/${propertyInfo.phone}`, "_blank")}
                    />
                    <CustomButton
                      title="Call"
                      backgroundColor="#4CAF50"
                      color="#FCFCFC"
                      fullWidth
                      icon={<Phone />}//@ts-ignore
                      handleClick={() => window.open(`tel:${propertyInfo.phone}`)}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyDetails;
