import { useList } from "@refinedev/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import AgentCard from "../components/agent/AgentCard";

const Agents = () => {
    const { data, isLoading, isError } = useList({ resource: "users" });

    const allAgents = data?.data ?? [];

    if (isLoading) 
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>
            <CircularProgress />
        </Typography>
        </div>;
    if (isError) return <div>error...</div>;

    return (
        <Box>
            <Typography fontSize={25} fontWeight={700} color="#11142d">
                Agents List
            </Typography>
            <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh" // Adjust the height as needed
        >
            <Typography variant="h4" align="center" color="primary">
            Coming Soon
            </Typography>
            </Box>
            {/*<Box
                mt="20px"
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    backgroundColor: "#fcfcfc",
                }}
            >
                {allAgents.map((agent) => (
                    <AgentCard
                        key={agent._id}
                        id={agent._id}
                        name={agent.name}
                        email={agent.email}
                        avatar={agent.avatar}
                        noOfProperties={agent.allProperties.length}
                    />
                ))}
            </Box>*/}
        </Box>
    );
};

export default Agents;