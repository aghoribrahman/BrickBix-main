import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LocationCity from "@mui/icons-material/LocationCity";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";
import { useGetIdentity } from "@refinedev/core";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useActiveAuthProvider } from "@refinedev/core";
import { AgentCardProp, InfoBarProps } from "../../interfaces/agent";
import { Link } from "react-router-dom";

function checkImage(url: any) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const InfoBar = ({ icon, name }: InfoBarProps) => (
  <Stack flex={1} minWidth={{ xs: "100%", sm: 200 }} gap={1} direction="row" alignItems="center">
    {icon}
    <Typography fontSize={14} color="#808191">
      {name}
    </Typography>
  </Stack>
);

const AgentCard = ({
  id,
  name,
  email,
  avatar,
  noOfProperties,
}: AgentCardProp) => {
  const authProvider = useActiveAuthProvider();
  const { data: currentUser } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const generateLink = () => {
    if (currentUser.email === email) return "/my-profile";
    return `/agents/show/${id}`;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ margin: '20px 0' }} // Add spacing between cards
    >
      <Box
        component={Link}
        to={generateLink()}
        width="100%"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          },
        }}
      >
        <img
          src={
            checkImage(avatar)
              ? avatar
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
          }
          alt="user"
          width={90}
          height={90}
          style={{ borderRadius: "50%", objectFit: "cover", marginRight: "20px" }}
        />
        <Stack
          direction="column"
          justifyContent="space-between"
          flex={1}
          gap={{ xs: 2, sm: 3 }}
        >
          <Stack gap={1} direction="row" flexWrap="wrap" alignItems="center">
            <Typography fontSize={22} fontWeight={600} color="#11142d">
              {name}
            </Typography>
            <Typography fontSize={14} color="#808191">
              Real-Estate Agent
            </Typography>
          </Stack>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <InfoBar icon={<EmailOutlined sx={{ color: "#808191" }} />} name={email} />
            <InfoBar icon={<Place sx={{ color: "#808191" }} />} name="Indore" />
            <InfoBar icon={<Phone sx={{ color: "#808191" }} />} name="NA" />
            {/*<InfoBar icon={<LocationCity sx={{ color: "#808191" }} />} name={`${noOfProperties} Properties`} />*/}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default AgentCard;
