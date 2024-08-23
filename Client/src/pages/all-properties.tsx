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
  } = useTable({
    resource: "properties",
  });

  const propertyValues = data?.data ?? [];
  const [filteredPageCount, setFilteredPageCount] = useState<number>(pageCount);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sorters, setSorters] = useState<{ field: string; order: string }[]>([]);

  const currentPrice = sorters.find((item) => item.field === "price")?.order;

  const toggleSort = (field: string) => {
    const newOrder = currentPrice === "asc" ? "desc" : "asc";
    setSorters([{ field, order: newOrder }]);
  };

  const debouncedSearch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setFilters([
          { field: "title", operator: "contains", value: value || undefined },
          { field: "location", operator: "contains", value: value || undefined },
        ]);
      }, 1500); // 1500ms debounce
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

  if (isError) return <Typography>Error fetching properties...</Typography>;

  return (
    <Box sx={{ marginBottom: "20px", padding: { xs: "10px", sm: "20px" } }}>
      <Stack direction="column" width="100%">
        <Typography
          fontSize={{ xs: 20, sm: 25 }}
          fontWeight={700}
          color="#11142d"
          mb={{ xs: 2, sm: 0 }}
        >
          {!propertyValues.length ? "There are no properties" : "All Properties"}
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
              debouncedSearch(e.currentTarget.value);
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
                handleClick={() => toggleSort("price")}
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
            title="Add Property"
            handleClick={() => navigate("/allProperties/properties/create")}
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
        {propertyValues.length > 0 && (
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
              disabled={current === filteredPageCount || propertyValues.length < pageSize}
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
