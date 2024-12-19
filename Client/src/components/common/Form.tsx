import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Upload as UploadImage } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { FormProps } from "../../interfaces/common";
import CustomButton from "./CustomButton";

const Form = ({
  type,
  register,
  handleSubmit,
  handleImageChange,
  formLoading,
  onFinishHandler,
  propertyImage,
}: FormProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const theme = useTheme();

  const handleClick = () => {
    setIsButtonDisabled(true);
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "80%", md: "60%" },
        mx: "auto",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Typography
        sx={{ fontWeight: "bold", fontSize: 24, mb: 2, color: "primary.main" }}
        variant="h5"
        textAlign="center"
      >
        <span style={{ color: '#d84030' }}>{type} </span>{' '} Property!
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onFinishHandler)}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Property Name"
            fullWidth
            required
            variant="outlined"
            {...register("title", {
              required: "Property name is required",
              minLength: {
                value: 3,
                message: "Property name must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Property name cannot exceed 100 characters",
              },
            })}
            error={!!register("title").error}
            helperText={register("title").error?.message}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextareaAutosize
            minRows={4}
            placeholder="Property Description"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              borderColor: "rgba(0, 0, 0, 0.23)",
              fontSize: "16px",
              resize: "none",
            }}
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
              maxLength: {
                value: 1000,
                message: "Description cannot exceed 1000 characters",
              },
            })}
          />
          <FormHelperText>{register("description").error?.message}</FormHelperText>
        </FormControl>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth margin="normal">
            <Typography sx={{ color: 'text.secondary' }}>Property Type</Typography>
            <Select
              labelId="property-type-label"
              fullWidth
              defaultValue="apartment"
              {...register("propertyType", {
                required: "Property type is required",
              })}
            >
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="rental">Rental</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="farmhouse">Farmhouse</MenuItem>
              <MenuItem value="duplex">Duplex</MenuItem>
              <MenuItem value="plot">Plot</MenuItem>
              <MenuItem value="land">Land</MenuItem>
              <MenuItem value="room">Room</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Typography sx={{ color: 'text.secondary' }}>Deal Type</Typography>
            <Select
              fullWidth
              defaultValue="Direct"
              {...register("dealType", {
                required: "Deal type is required",
              })}
            >
              <MenuItem value="Direct">Direct</MenuItem>
              <MenuItem value="Indirect">Indirect</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} >
          <FormControl fullWidth margin="normal">
            <TextField
              label="Total Price"
              type="number"
              fullWidth
              required
              variant="outlined"
              {...register("price", {
                required: "Price is required",
                min: { value: 10, message: "Please enter a valid price" },
                max: {
                  value: 10000000000,
                  message: "Price cannot exceed ₹1,000,000,000",
                },
              })}
              error={!!register("price").error}
              helperText={register("price").error?.message}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Total Square Feet"
              type="number"
              fullWidth
              required
              variant="outlined"
              {...register("totalSquareFeet", {
                required: "Total square feet is required",
              })}
              error={!!register("totalSquareFeet").error}
              helperText={register("totalSquareFeet").error?.message}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth margin="normal">
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              required
              variant="outlined"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Please enter a valid 10-digit Indian mobile number",
                },
              })}
              error={!!register("phone").error}
              helperText={register("phone").error?.message}
            />
          </Stack>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Location"
            fullWidth
            required
            variant="outlined"
            {...register("location", {
              required: "Location is required",
              minLength: {
                value: 3,
                message: "Location must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Location cannot exceed 100 characters",
              },
            })}
            error={!!register("location").error}
            helperText={register("location").error?.message}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Upload Property Image
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadImage />}
            style={{ backgroundColor: "#0F52BA", borderRadius:"20px", }}
          >
            Upload
            <input
              type="file"
              hidden
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  if (file.size > 5 * 1024 * 1024) {
                    alert("File size must be less than 5MB");
                    return;
                  }
                  if (!file.type.startsWith("image/")) {
                    alert("Please upload an image file");
                    return;
                  }
                  handleImageChange(file);
                }
              }}
            />
          </Button>
          {propertyImage && (
            <Typography
              variant="caption"
              sx={{ mt: 1, display: "block", color: "text.secondary" }}
            >
              {propertyImage.name}
            </Typography>
          )}
        </FormControl>

        <Box textAlign="center" mt={3}>
          <CustomButton
            type="submit"
            title={formLoading ? "Submitting..." : "Submit"}
            backgroundColor="#0F52BA"
            color="#fff"
            handleClick={handleClick}
            disabled={formLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
