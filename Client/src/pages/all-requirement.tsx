import { useMemo, useState, useEffect } from "react";
import { Add, Sort } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
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
import BrickBixImage from '../assets/brick bix image.jpg'; // Image imported

const Requirement = () => {
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
    resource: "requirement",
    initialSorter: [{ field: "createdAt", order: "desc" }],
  });

  const requirementValues = data?.data ?? [];
  
  const [filteredPageCount, setFilteredPageCount] = useState<number>(pageCount);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const currentPrice = sorters.find((item) => item.field === "askedPrice")?.order;

  const toggleSort = (field: string) => {
    const newOrder = currentPrice === "asc" ? "desc" : "asc";
    setSorters([{ field, order: newOrder }]);
  };

  const debouncedSearch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('Setting filters with value:', value); // Debug log
        setFilters([
          { field: "title", operator: "contains", value: value || undefined },
          { field: "location", operator: "contains", value: value || undefined },
        ]);
      }, 1500); // Debounce delay
    };
  }, [setFilters]);

  useEffect(() => {
    // Update pageCount dynamically based on the filtered data
    if (data) {
      const totalProperties = data.total; // Assuming `total` is the total count of filtered properties from the backend
      const updatedPageCount = Math.ceil(totalProperties / pageSize);
      setFilteredPageCount(updatedPageCount);
    }
  }, [data, pageSize]);

  const checkURLValue = (url: string): string => {
    const urlSegments = url.split("/");
    const lastSegment = urlSegments[urlSegments.length - 1];
    return lastSegment.includes("requirement") ? "properties-requirement" : "properties";
  };

  const fullUrl = window.location.href;
  const fullUrlValue = checkURLValue(fullUrl);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>
          <CircularProgress />
        </Typography>
      </div>
    );
  }

  if (isError) {
    return <Typography>Error fetching requirements...</Typography>;
  }

  return (
    <Box sx={{ marginBottom: "20px", padding: { xs: "10px", sm: "20px" } }}>
      <Stack direction="column" width="100%">
        <Typography
          fontSize={{ xs: 20, sm: 25 }}
          fontWeight={700}
          color="#11142d"
          mb={{ xs: 2, sm: 0 }}
        >
          {!requirementValues.length ? "There are no requirements" : "All Requirements"}
        </Typography>
        <Box
          mb={2}
          mt={3}
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            variant="outlined"
            color="info"
            placeholder="Search by title or location"
            fullWidth
            onChange={(e) => {
                const value = e.currentTarget.value;
                console.log('Search term:', value);
                debouncedSearch(value);
            }}
            sx={{ mb: { xs: 2, sm: 0 }, width: { xs: "100%", sm: "70%" } }}
            />
          <Button
            variant="contained"
            color={showFilters ? "secondary" : "primary"}
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{ mb: 2, mt: 2, width: { xs: "100%", sm: "auto" } }}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Box>
        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomButton
                title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
                handleClick={() => toggleSort("askedPrice")}
                backgroundColor="#475be8"
                color="#fcfcfc"
                icon={<Sort />}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
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
                    console.log('Selected category:', e.target.value); // Debug log
                    setFilters(
                    [{ field: "propertyType", operator: "eq", value: e.target.value }],
                    "replace"
                    );
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
          mt={3}
        >
          <CustomButton
            title="Add Requirement"
            handleClick={() => navigate("properties-requirement/create")}
            backgroundColor="#475be8"
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
          {requirementValues.length > 0 ? (
            requirementValues.map((requirement) => (
              <PropertyCard
                key={requirement._id}
                id={requirement._id}
                title={requirement.title}
                location={requirement.location}
                dealType={requirement.dealType}
                price={requirement.askedPrice}
                photo={BrickBixImage} // Pass the image here
                phone={requirement.phone}
                propertyType={requirement.propertyType}
                url={fullUrlValue}
              />
            ))
          ) : (
            <Typography>No requirements match your search criteria.</Typography>
          )}
        </Box>
        {requirementValues.length > 0 && (
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
              handleClick={() => setCurrent((prev) => Math.max(prev - 1, 1))} // Prevent going below 1
              backgroundColor="#475be8"
              color="#fcfcfc"
              disabled={current === 1}
            />
            <Box display={{ xs: "none", sm: "flex" }} alignItems="center" gap="5px">
              Page <strong>{current} of {filteredPageCount}</strong>
            </Box>
            <CustomButton
              title="Next"
              handleClick={() => setCurrent((prev) => Math.min(prev + 1, filteredPageCount))} // Prevent going above filteredPageCount
              backgroundColor="#475be8"
              color="#fcfcfc"
              disabled={current === filteredPageCount || requirementValues.length < pageSize}
            />
            <Select
              variant="outlined"
              color="info"
              displayEmpty
              defaultValue={10}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10].map((size) => (
                <MenuItem key={size} value={size}>
                  Show {size}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Requirement;
