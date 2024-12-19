import { useEffect, useState, useMemo } from "react";
import { useGetIdentity, useActiveAuthProvider } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import BrickBixImage from '../assets/brick bix image.jpg';
import PieChart from '../components/charts/PieChart';
import PropertyReferrals from '../components/charts/PropertyReferrals';
import TotalRevenue from '../components/charts/TotalRevenue';
import PropertyCard from "../components/common/PropertyCard";
import CustomButton from "../components/common/CustomButton";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Service from "../components/common/Services";
import UserForm from "../components/common/UserForm";
import Dialog from "@mui/material/Dialog";
import { motion } from "framer-motion";

interface Property {
  _id: string;
  title: string;
  location: string;
  dealType: string;
  price: number;
  photo: string;
  phone: string;
  propertyType: string;
}

interface Requirement {
  _id: string;
  title: string;
  location: string;
  dealType: string;
  askedPrice: number;
  phone: string;
  propertyType: string;
}

interface UserInfo {
  name: string;
  phoneNumber: string;
  workLocation: string;
}

const Home = () => {
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [totalPropertiesCount, setTotalPropertiesCount] = useState(0);
  const [commercialPropertiesCount, setCommercialPropertiesCount] = useState(0);
  const [apartmentPropertiesCount, setApartmentPropertiesCount] = useState(0);
  const [totalRequirementsCount, setTotalRequirementsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const userId = user?.id || user?.userid || null; // Adjust according to the actual field


  useEffect(() => {
    if (userId) {
      document.title = "BrickBix"; 
      const fetchData = async () => {
        try {
          const [propertiesRes, requirementsRes, userInfoRes] = await Promise.all([
            fetch(`${apiUrl}/api/v1/properties/five`),
            fetch(`${apiUrl}/api/v1/requirement/five`),
            fetch(`${apiUrl}/api/v1/users/${userId}`)
          ]);

          if (!propertiesRes.ok || !requirementsRes.ok) {
            throw new Error("Failed to fetch properties or requirements");
          }

          const propertiesData = await propertiesRes.json();
          const requirementsData = await requirementsRes.json();
          const userInfoData = await userInfoRes.json();
          
          setUserInfo(userInfoData)
          setMyProperties(propertiesData.properties);
          setRequirements(requirementsData.requirements);
          setTotalPropertiesCount(propertiesData.totalPropertiesCount);
          setCommercialPropertiesCount(propertiesData.commercialPropertiesCount);
          setApartmentPropertiesCount(propertiesData.apartmentPropertiesCount);
          setTotalRequirementsCount(requirementsData.totalRequirementsCount);
          setShowDialog(true)
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userId]);

  const userNameDisplay = useMemo(() => (
    user?.name ? (
      <Typography 
        sx={{ fontWeight: "bold", fontSize: '12px' }} 
        variant="subtitle2" 
        data-testid="header-user-name"
      >
        <span style={{ color: '#d84030' }}>Welcome</span>{' '}
        <span style={{ color: '#11418a' }}>{user.name.toUpperCase()}</span>!
      </Typography>
    ) : null
  ), [user?.name]);
  
  


  const isUserInfoComplete = userInfo && userInfo.phoneNumber && userInfo.workLocation;

  const handleFormSubmit = (success: boolean) => {
    if (success) {
      setFormSubmitted(true);
      setShowThankYou(true);
      // Hide thank you message after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    }
  };

  return (
    <Box sx={{ padding: '10px' }}>
        {userNameDisplay}
      <Stack direction={{ xs: "row", sm: "row" }} spacing={2} mt={1} sx={{ flexWrap: "wrap" }}>
        <CustomButton
          title="Add Property"
          handleClick={() => navigate("/allProperties/properties/create")}
          backgroundColor="#0F52BA"
          color="#fcfcfc"
          icon={<Add />}
        />
        <CustomButton
          title="Add Requirement"
          handleClick={() => navigate("requirement/properties-requirement/create")}
          backgroundColor="#0F52BA"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Stack>
      {!isUserInfoComplete && !formSubmitted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1 }} // Adjusted delay to 3 seconds
          style={{ borderRadius: '20px' }}
        >
          <Dialog open={showDialog} PaperProps={{ style: { borderRadius: '20px' } }}>
            <UserForm 
              name={user?.name} 
              email={user?.email} 
              onFormSubmit={handleFormSubmit}
            />
          </Dialog>
        </motion.div>
      )}
      {showThankYou && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.5 }} // Added delay
        >
          <Typography 
            variant="h6" 
            color="success.main" 
            sx={{ 
              mt: 2, 
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Thank you for submitting your information!
          </Typography>
        </motion.div>
      )}
      <Box
        flex={1}
        borderRadius="15px"
        bgcolor="#F6F5F2"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
        mt="15px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Properties
        </Typography>
        <Box
          mt={1}
          sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2 }}
        >
          {loading ? (
            Array.from(new Array(3)).map((_, index) => (
              <Box key={index} sx={{ width: 250, height: 200, padding: 1 }}>
                <Skeleton variant="rectangular" width="100%" height="50%" />
                <Skeleton variant="text" width="60%" sx={{ marginTop: 1 }} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" sx={{ marginTop: 1 }} />
              </Box>
            ))
          ) : (
            myProperties.slice().reverse().slice(0, 5).map((property) => (
              <PropertyCard
              //@ts-ignore
                key={property._id}
                //@ts-ignore
                id={property._id}
                //@ts-ignore
                title={property.title}
                //@ts-ignore
                location={property.location}
                //@ts-ignore
                dealType={property.dealType}
                //@ts-ignore
                price={property.price}
                //@ts-ignore
                phone={property.phone}
                //@ts-ignore
                photo={property.photo}
                //@ts-ignore
                propertyType={property.propertyType}
                url={"properties"}
              />
            ))
          )}
        </Box>
      </Box>

      <Box
        flex={1}
        borderRadius="15px"
        bgcolor="#F6F5F2"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Requirement
        </Typography>
        <Box
          mt={1}
          sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2 }}
        >
          {loading ? (
            Array.from(new Array(3)).map((_, index) => (
              <Box key={index} sx={{ width: 250, height: 200, padding: 1 }}>
                <Skeleton variant="rectangular" width="100%" height="50%" />
                <Skeleton variant="text" width="60%" sx={{ marginTop: 1 }} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" sx={{ marginTop: 1 }} />
              </Box>
            ))
          ) : (
            requirements.slice().reverse().slice(0, 5).map((property) => (
              <PropertyCard
              //@ts-ignore
                key={property._id}
                //@ts-ignore
                id={property._id}
                //@ts-ignore
                title={property.title}
                //@ts-ignore
                location={property.location}
                //@ts-ignore
                dealType={property.dealType}
                //@ts-ignore
                price={property.askedPrice}
                //@ts-ignore
                phone={property.phone}
                //@ts-ignore
                photo={BrickBixImage}
                //@ts-ignore
                propertyType={property.propertyType}
                url={"properties-requirement"}
              />
            ))
          )}
        </Box>
      </Box>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={2}>
        <PieChart
          title="Total Properties"
          value={totalPropertiesCount}
          series={[totalPropertiesCount, 1000 - totalPropertiesCount]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Commercial Properties"
          value={commercialPropertiesCount}
          series={[commercialPropertiesCount, 100 - commercialPropertiesCount]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Apartments"
          value={apartmentPropertiesCount}
          series={[apartmentPropertiesCount, 500 - apartmentPropertiesCount]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Requirements Listed"
          value={totalRequirementsCount}
          series={[totalRequirementsCount, 1000 - totalRequirementsCount]}
          colors={["#275be8", "#c4e8ef"]}
        />
      </Box>
      <Service />
      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={2}
      >
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>
      
    </Box>
  );
};

export default Home;
