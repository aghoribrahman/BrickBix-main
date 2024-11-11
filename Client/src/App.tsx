import { useEffect } from "react";
import {
  AuthBindings,
  Authenticated,
  Refine,
} from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AccountCircleOutlined,
        PeopleAltOutlined,
        StarBorderOutlined,
        VillaOutlined,
        ContactPage,
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import RoofingIcon from '@mui/icons-material/Roofing';
import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";
import { Sider } from "./components/layout/sider";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";
import { 
  Login, } from "./pages/login";
import { parseJwt } from "./utils/parse-jwt";
import  Home  from './pages/home';
import { AllProperties } from "./pages/all-properties";
import Requirement from "./pages/all-requirement";
import  MyProfile  from "./pages/my-profile";
import { CreateProperty } from "./pages/create-property";
import EditProperty from "./pages/edit-property";
import  PropertyDetails  from "./pages/property-details";
import { ExclusiveProperties } from "./pages/exclusive-properties";
import routerProvider from "@refinedev/react-router-v6";
import Agents from "./pages/agents";
import { CreateRequirement } from "./pages/create-requirement";
import EditRequirement from "./pages/edit-requirement";
import RequirementDetails from "./pages/requirement-details";
import ContactUs from "./pages/contact-us";
import TermsAndConditions from "./pages/terms-and-conditions";
import { Footer } from "antd/es/layout/layout";
import { Link } from "react-router-dom"; // Ensure you import Link

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

const theme = createTheme({
  palette: {
    primary: {
      light: '#FCFCFC',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#FCFCFC',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});


function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;
      
      if (profileObj) {
        const response = await fetch(
            `${apiUrl}/api/v1/users`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profileObj.name,
                    email: profileObj.email,
                    avatar: profileObj.picture,
                }),
            },
        );
        const data = await response.json();
        if (response.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id,
            })
          );
        }
        else {
          return Promise.reject();
      }
      
        

        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
        
      },
    
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };
  useEffect(() => {
    document.title = "BrickBix"; // Set the document title
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ body: { backgroundColor: '#FCFCFC' } }} />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                
                dataProvider={dataProvider(`${apiUrl}/api/v1`)}
                notificationProvider={notificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "Home",
                    options: { label: 'Home'},
                    list: "/",
                    icon: <DashboardIcon/>
                  },
                  {
                    name: "properties",
                    list: "/allProperties",

                    icon: <VillaOutlined />,
                  },
                  {
                    name: "requirement",
                    list: "/requirement",
                    icon: <RoofingIcon/>,
                  },
                  {
                    name: "agent",
                    list: "/agent",
                    icon: <PeopleAltOutlined />,
                  },
                  
                  {
                    name: "Exclusive Property",
                    list: "/exclusive",
                    icon: <StarBorderOutlined />,
                  },
                  {
                    name: "my-profile",
                    options: { label: 'My Profile'},
                    list: "/my-profile",
                    icon: <AccountCircleOutlined />,
                  },
                  {
                    name: "conatct-us",
                    options: { label: 'Contact Us'},
                    list: "/contact-us",
                    icon: <ContactPage />,
                  },
                ]}
              

                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "9ZwJQG-jx6vU5-n7SNKo",
                }}
              >
                
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >    
                      <ThemeProvider theme={theme}>           
                        <ThemedLayoutV2 Title={() => <div><span>BrickBix</span></div>} Header={() => <Header sticky />} Sider={()=><Sider />} >
                          <Outlet />
                        </ThemedLayoutV2>
                        </ThemeProvider> 
                      </Authenticated>
                    }
                  >
                    
                    <Route index element={<Home />} />
                    <Route path="/allProperties">
                      <Route index element={<AllProperties />} />
                      <Route path="properties/create" element={<CreateProperty />} />
                      <Route index path="properties/edit/:id" element={<EditProperty />} />
                    </Route>
                    <Route index path="properties/show/:id" element={<PropertyDetails />} />
                    <Route path="/requirement">
                      <Route index element={<Requirement />} />
                      <Route path="properties-requirement/create" element={<CreateRequirement />} />
                      <Route index path="properties-requirement/edit/:id" element={<EditRequirement />} />
                    </Route>
                    <Route index path="properties-requirement/show/:id" element={<RequirementDetails />} />
                    <Route path="/agent">
                      <Route index element={<Agents/>} />
                    </Route>
                    <Route path="/agents/show/:id">
                      <Route index element={<Agents/>} />
                    </Route>
                    <Route path="/exclusive">
                      <Route index element={<ExclusiveProperties/>} />
                    </Route>
                    <Route path="/my-profile">
                      <Route index element={<MyProfile />} />
                    </Route>
                    <Route path="/contact-us">
                      <Route index element={<ContactUs />} />
                    </Route>
                    <Route path="/terms-and-conditions">
                      <Route index element={<TermsAndConditions />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
              </Refine>
            </DevtoolsProvider>
          </RefineSnackbarProvider>
          <Footer style={{ textAlign: 'center' }}>
            © 2024 BrickBix Technologies. All rights reserved. | 
            <Link to="/terms-and-conditions" style={{ marginLeft: '5px', color: '#1890ff', textDecoration: 'underline' }}>
              Terms and Conditions
            </Link>
          </Footer>
        </ColorModeContextProvider>
      </RefineKbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
