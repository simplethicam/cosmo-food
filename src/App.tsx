import React from "react";
import {
  ErrorComponent,
  useNotificationProvider,
  ThemedLayoutV2,
  RefineSnackbarProvider,
} from "@refinedev/mui";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Dashboard from "@mui/icons-material/Dashboard";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import GroupsIcon from '@mui/icons-material/Groups';
import TableBarIcon from '@mui/icons-material/TableBar';
import Box from "@mui/material/Box";
import { authProvider, TOKEN_KEY, REFRESH_TOKEN_KEY } from "./authProvider";
import { DashboardPage } from "./pages/dashboard";
import { OrderList, OrderEdit, OrderCreate } from "./pages/orders";
import { CustomerList, CustomerCreate, CustomerEdit } from "./pages/customers";
import { AuthPage } from "./pages/auth";
import { ProductEdit, ProductList, ProductCreate } from "./pages/products";
import { CategoryList, CategoryCreate, CategoryEdit } from "./pages/categories";
import { TableCreate, TableList, TableEdit } from "./pages/tables";
import { ColorModeContextProvider } from "./contexts";
import { Header, Title } from "./components";
import { UserCreate, UserEdit, UserList } from "./pages/users";
import { dataProvider } from "./dataProvider";
import { Authenticated, Refine } from "@refinedev/core";

const TABLES_API_URL = "https://54drrqswze.execute-api.eu-west-3.amazonaws.com/dev/v1";
const PRODUCTS_API_URL = "https://hd0j3pgjr6.execute-api.eu-west-3.amazonaws.com/dev/v1";
const CATEGORIES_API_URL = "https://00jq791b7c.execute-api.eu-west-3.amazonaws.com/dev/v1";
const CUSTOMERS_API_URL = "https://jmusfkeazg.execute-api.eu-west-3.amazonaws.com/dev/v1";
const ORDERS_API_URL = "https://5zywtxj65j.execute-api.eu-west-3.amazonaws.com/dev/v1";
const USERS_API_URL = "https://3heesvctf5.execute-api.eu-west-3.amazonaws.com/dev/v1";
const COMPANIES_API_URL = "https://6tne77hov0.execute-api.eu-west-3.amazonaws.com/dev/v1";
const API_URL = "https://api.finefoods.refine.dev";

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const logout = async () => {
    await authProvider.logout({});
    window.location.href = "/login";
  };
  

  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(API_URL)}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              breadcrumb: false,
              useNewQueryKeys: true,
            }}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <Dashboard />,
                },
              },
              {
                name: "orders",
                list: "/orders",
                create: "/orders/new",
                edit: "/orders/:id/edit",
                meta: {
                  url: ORDERS_API_URL,
                  resource: "order",
                  all: "/ALL",
                  icon: <ShoppingBagOutlinedIcon />,
                },
              },
              {
                name: "customers",
                list: "/customers",
                create: "/customers/new",
                edit: "/customers/:id/edit",
                meta: {
                  url: CUSTOMERS_API_URL,
                  resource: "customer",
                  all: "/ALL",
                  icon: <GroupsIcon />,
                },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/new",
                edit: "/products/:id/edit",
                meta: {
                  url: PRODUCTS_API_URL,
                  resource: "product",
                  all: "",
                  icon: <FastfoodOutlinedIcon />,
                },
              },
              {
                name: "categories",
                list: "/categories",
                create: "/categories/new",
                edit: "/categories/:id/edit",
                meta: {
                  url: CATEGORIES_API_URL,
                  resource: "category",
                  all: "",
                  icon: <LabelOutlinedIcon />,
                },
              },
              {
                name: "tables",
                list: "/tables",
                create: "/tables/new",
                edit: "/tables/:id/edit",
                meta: {
                  url: TABLES_API_URL,
                  resource: "table",
                  all: "",
                  icon: <TableBarIcon />,
                },
              },
              {
                name: "users",
                list: "/users",
                create: "/users/new",
                edit: "/users/:id/edit",
                meta: {
                  url: USERS_API_URL,
                  resource: "user",
                  all: "",
                  icon: <AccountCircleOutlinedIcon />,
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <Box
                        sx={{
                          maxWidth: "1200px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <Outlet />
                      </Box>
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="/orders">
                  <Route index element={<OrderList />} />
                  <Route path=":id/edit" element={<OrderEdit />} />
                  <Route path="new" element={<OrderCreate />} />
                </Route>
                <Route
                  path="/customers"
                  element={
                    <CustomerList>
                      <Outlet />
                    </CustomerList>
                  }
                >
                  <Route path="new" element={<CustomerCreate />} />
                  <Route path=":id/edit" element={<CustomerEdit />} />
                </Route>
                <Route
                  path="/products"
                  element={
                    <ProductList>
                      <Outlet />
                    </ProductList>
                  }
                >
                  <Route path=":id/edit" element={<ProductEdit />} />
                  <Route path="new" element={<ProductCreate />} />
                </Route>
                <Route
                  path="/categories"
                  element={
                    <CategoryList>
                      <Outlet />
                    </CategoryList>
                  }
                >
                  <Route path="new" element={<CategoryCreate />} />
                  <Route path=":id/edit" element={<CategoryEdit />} />
                </Route>
                <Route path="/tables"
                  element={
                    <TableList>
                      <Outlet />
                    </TableList>
                  }
                >
                  <Route path=":id/edit" element={<TableEdit />} />
                  <Route path="new" element={<TableCreate />} />
                </Route>
                <Route
                  path="/users"
                  element={
                    <UserList>
                      <Outlet />
                    </UserList>
                  }
                >
                  <Route path="new" element={<UserCreate />} />
                  <Route path=":id/edit" element={<UserEdit />} />
                </Route>
              </Route>
              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<AuthPage type="login" />} />
                <Route path="/register" element={<AuthPage type="register" />} />
                <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
              </Route>
                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineSnackbarProvider>
      </ColorModeContextProvider>
    </BrowserRouter>
  );
};

export default App;

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}