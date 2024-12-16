import { useMemo, useState, useEffect } from "react";
import { Add, Sort } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import {
  Box,
  Stack,
  Typography,
  Skeleton, // Added import for Skeleton
  MenuItem,
  Select,
  TextField,
  Grid,
  Button,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/common/PropertyCard";
import CustomButton from "../components/common/CustomButton";

export const AllProperties = () => {
  const navigate = useNavigate();
  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    pageSize,
    setPageSize,
    pageCount,
    setFilters,
    setSorters,
    sorters,
  } = useTable({
    resource: "properties",
    initialSorter: [{ field: "createdAt", order: "desc" }],
  });

  const propertyValues = data?.data ?? [];
  const [filteredPageCount, setFilteredPageCount] = useState<number>(pageCount);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const currentPrice = sorters.find((item) => item.field === "price")?.order;

  const toggleSort = (field: string) => {
    const newOrder = currentPrice === "asc" ? "desc" : "asc";
    setSorters([{ field, order: newOrder }]);
  };

  const debouncedSearch = useMemo(() => {
    let timeout: number;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        console.log('Setting filters with value:', value); // Debug log
        setFilters([
          { field: "title", operator: "contains", value: value || undefined },
          { field: "location", operator: "contains", value: value || undefined },
        ],); // Ensure OR logic
        setCurrent(1); // Reset to the first page on search
      }, 1000); // Adjusted debounce delay for better UX
    };
  }, [setFilters, setCurrent]);

  useEffect(() => {
    if (data) {
      const totalProperties = data.total; // Assuming `total` is the total count of filtered properties from the backend
      const updatedPageCount = Math.ceil(totalProperties / pageSize);
      setFilteredPageCount(updatedPageCount);

      // Reset current page if filtered results are empty or if current page is out of bounds
      if (propertyValues.length === 0 || current > updatedPageCount) {
        setCurrent(1);
      }
    }
  }, [data, pageSize, propertyValues.length, current]);

  function checkURLValue(url: string): string {
    const urlSegments = url.split("/");
    const lastSegment = urlSegments[urlSegments.length - 1];

    if (lastSegment.includes("requirement")) {
      return "properties-requirement";
    } else {
      return "properties";
    }
  }

  const fullUrl = window.location.href;
  const fullUrlValue = checkURLValue(fullUrl);

  if (isLoading) {
    return (
      <Box sx={{ padding: 2 }}>
        <Skeleton variant="text" width={300} height={40} /> {/* Title skeleton */}
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} /> {/* Paragraph skeleton */}
        <Skeleton variant="rectangular" width="100%" height={200} /> {/* Rectangular skeleton for content */}
        <Skeleton variant="text" width={300} height={40} /> {/* Title skeleton */}
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} /> {/* Paragraph skeleton */}
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Box>
    );
  }

  if (isError) return <Typography>Error fetching properties...</Typography>;

  return (
    <Box>
      <Stack direction="column" width="100%">
          <Typography 
            sx={{ fontWeight: "bold", fontSize: '20px' }} 
            variant="subtitle2" 
            data-testid="header-user-name"
          >
            <span style={{ color: '#d84030' }}>{!propertyValues.length ? "There are" : "All"}</span>{' '}
            <span style={{ color: '#11418a' }}>{!propertyValues.length ? "no properties" : "Properties"}</span>!
          </Typography>
          
        <Box
          mt={1}
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          borderRadius={4} // Added border radius
        >
          <TextField
            variant="outlined"
            color="info"
            placeholder="Search by title or location"
            fullWidth
            onChange={(e) => {
              debouncedSearch(e.currentTarget.value);
            }}
            sx={{
              width: { xs: "100%", sm: "70%" },
              "& .MuiInputBase-root": {
                height: "40px", // Reduced height
                padding: "8px 12px", // Adjusted padding
                fontSize: "14px", // Smaller font size
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // Adjusted border radius to 12 pixels
              }
            }}
          />
          <Button
            variant="contained"
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{
              mb: 2,
              mt: 2,
              width: { xs: "100%", sm: "auto" },
              backgroundColor: showFilters ? "#FF5733" : "#0F52BA", // Custom color for secondary state
              borderRadius: "20px", // Added border radius
              '&:hover': {
                backgroundColor: showFilters ? "#FF5733" : "#0F52BA", // Optional hover color
              }
            }}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Box>
        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomButton
                title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
                handleClick={() => toggleSort("price")}
                backgroundColor="#0F52BA"
                color="#fcfcfc"
                icon={<Sort />}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography sx={{ marginBottom: 2 }}>
                Filter by Property Category
              </Typography>
              <Select
                placeholder="Search By Property Category"
                variant="outlined"
                color="info"
                displayEmpty
                fullWidth
                defaultValue=""
                onChange={(e) => {
                    setFilters(
                    [{ field: "propertyType", operator: "eq", value: e.target.value }],
                    "replace"
                    );
                    setCurrent(1); // Reset to the first page on filter change
                }}
                sx={{
                  "& .MuiSelect-select": {
                    height: "40px", // Reduced height
                    padding: "8px 12px", // Adjusted padding
                    fontSize: "14px", // Smaller font size
                  },
                  "& .MuiOutlinedInput-root": {
                    height: "40px", // Ensure the root is the same height
                    borderRadius: "4px", // Optional: adjust border radius if needed
                  }
                }}
              >
                <MenuItem value="">All</MenuItem>
                {[
                    "Apartment",
                    "Rental",
                    "Farmhouse",
                    "Commercial",
                    "Land",
                    "Duplex",
                    "Plot",
                    "Room",
                ].map((type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                    {type}
                    </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Collapse>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          mt={1}
        >
          <CustomButton
            title="Add Property"
            handleClick={() => navigate("/allProperties/properties/create")}
            backgroundColor="#0F52BA"
            color="#fcfcfc"
            icon={<Add />}
          />
        </Stack>
        <Box
          mt="20px"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {propertyValues.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              location={property.location}
              dealType={property.dealType}
              price={property.price}
              photo={property.photo}
              phone={property.phone}
              propertyType={property.propertyType}
              url={fullUrlValue}
            />
          ))}
        </Box>
        <Box
          display="flex"
          gap={2}
          mt={3}
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <CustomButton
            title="Previous"
            handleClick={() => {
              setCurrent((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            backgroundColor="#0F52BA"
            color="#fcfcfc"
            disabled={current === 1}
          />
          <Typography>
            <span style={{ color: '#d84030' }}>Page</span>{' '}  <span style={{ color: '#11418a' }}>{current}</span>
          </Typography>
          <CustomButton
            title="Next"
            handleClick={() => {
              setCurrent((prev) => Math.min(prev + 1, filteredPageCount));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            backgroundColor="#0F52BA"
            color="#fcfcfc"
            disabled={current === filteredPageCount}
          />
        </Box>
      </Stack>
    </Box>
  );
};
