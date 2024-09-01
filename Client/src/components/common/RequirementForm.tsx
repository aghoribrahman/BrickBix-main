import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { RequirementFormProps } from "../../interfaces/common";
import CustomButton from "./CustomButton";
import { useState } from "react";

const RequirementForm = ({
  type,
  register,
  handleSubmit,
  formLoading,
  onFinishHandler,
}: RequirementFormProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = () => {
    // Update state to disable the button
    setIsButtonDisabled(true);

    // Perform your desired action here
    // For example, make an API call, perform validation, etc.
    // Once the action is completed, you can re-enable the button if needed
  };

  return (
    <Box sx={{ width: { xs: '100%', sm: '80%', md: '60%' }, mx: 'auto' }}>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} a Requirement
      </Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
        <form
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onSubmit={handleSubmit(onFinishHandler)}
        >
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Requirement
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("title", { required: true })}
            />
          </FormControl>

          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Description & Your Contact Information
            </FormHelperText>
            <TextareaAutosize
              minRows={5}
              required
              placeholder="Write description"
              color="info"
              style={{
                width: "100%",
                background: "transparent",
                fontSize: "16px",
                borderColor: "rgba(0,0,0,0.23)",
                borderRadius: 6,
                padding: 10,
                color: "#919191",
              }}
              {...register("description", { required: true })}
            />
          </FormControl>

          <Stack direction={{ xs: "column", sm: "row" }} gap={4}>
            <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Select Requirement Type
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue="apartment"
                {...register("propertyType", {
                  required: true,
                  setValueAs: (value: string) => value.toLowerCase(), // Type defined as string
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

            <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Deal Type
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue="Direct"
                {...register("dealType", {
                  required: true,
                })}
              >
                <MenuItem value="Direct">Direct</MenuItem>
                <MenuItem value="Indirect">Indirect</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Enter Budget
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("askedPrice", { required: true })}
              />
            </FormControl>
          </Stack>

          <FormControl>
          <FormHelperText
            sx={{
              fontWeight: 500,
              margin: "10px 0",
              fontSize: 16,
              color: "#11142d",
            }}
          >
            Enter Phone Number
          </FormHelperText>
              <Box display="flex" alignItems="center">
                <TextField
                  value="+91"
                  disabled
                  sx={{
                    maxWidth: "70px",
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  color="info"
                  type="tel"
                  variant="outlined"
                  inputProps={{
                    pattern: "[0-9]{10}",
                    title: "Please enter a valid 10-digit mobile number",
                  }}
                  sx={{ marginLeft: "10px" }}
                  {...register("phone", { required: true, pattern: /[0-9]{10}/ })}
                />
              </Box>
          </FormControl>

          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Location
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("location", { required: true })}
            />
          </FormControl>

          <CustomButton
            type="submit"
            title={formLoading ? "Submitting..." : "Submit"}
            backgroundColor="#0F52BA"
            color="#fcfcfc"
            handleClick={handleClick}
            disabled={formLoading}
          />
        </form>
      </Box>
    </Box>
  );
};

export default RequirementForm;
