import React, { PropsWithChildren, useMemo, useState, useEffect } from "react";
import {
  HttpError,
  useList,
  useTranslate,
  useNavigation,
  useGo,
} from "@refinedev/core";
import { useLocation } from "react-router-dom";
import { CreateButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import { ICustomer } from "../../interfaces";
import { RefineListView } from "../../components";
import { Card, CardActionArea, CardActions, CardContent, Divider, Grid, Stack } from "@mui/material";
import { CustomerStatus } from "../../components/customer/status";

type View = "table" | "card";

export const CustomerList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl, createUrl } = useNavigation();
  const t = useTranslate();
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("customer-view") as View;
    return view || "table";
  });

  const { data: customersData, isLoading } = useList<ICustomer, HttpError>({
    resource: "customers",
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortedCustomers, setSortedCustomers] = useState<ICustomer[]>([]);

  useEffect(() => {
    if (customersData?.data) {
      setSortedCustomers(customersData.data);
    }
  }, [customersData]);

  useEffect(() => {
    if (sortModel.length > 0 && customersData?.data) {
      const sorted = [...customersData.data].sort((a, b) => {
        const field = sortModel[0].field;
        const sort = sortModel[0].sort;

        const aValue = a[field as keyof ICustomer];
        const bValue = b[field as keyof ICustomer];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) {
          return sort === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sort === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setSortedCustomers(sorted);
    } else {
      setSortedCustomers(customersData?.data || []);
    }
  }, [sortModel, customersData]);

  const columns = useMemo<GridColDef<ICustomer>[]>(
    () => [
      {
        field: "name",
        headerName: t("customers.fields.name"),
        flex: 1,
      },
      {
        field: "lastname",
        headerName: t("customers.fields.lastname"),
        flex: 1,
      },
      {
        field: "isActive",
        headerName: t("customers.fields.isActive"),
        headerAlign: "right",
        align: "right",
        flex: 1,
        renderCell: function render({ row }) {
          return (
            <CustomerStatus size="small" value={row.isActive} />
          );
        },
      },
    ],
    [t, go, pathname, editUrl],
  );

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View,
  ) => {
    setView(newView);
    localStorage.setItem("customer-view", newView);
  };

  return (
    <>
      <RefineListView
        breadcrumb={false}
        headerButtons={(props) => [
          <ToggleButtonGroup
            key="view-toggle"
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
          >
            <ToggleButton value="table" aria-label="table view" size="small">
              <ListOutlinedIcon />
            </ToggleButton>
            <ToggleButton value="card" aria-label="card view" size="small">
              <BorderAllOutlinedIcon />
            </ToggleButton>
          </ToggleButtonGroup>,
          <CreateButton
            {...props.createButtonProps}
            key="create"
            size="medium"
            sx={{ height: "40px" }}
            onClick={() => {
              return go({
                to: `${createUrl("customers")}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          >
            {t("buttons.create")}
          </CreateButton>,
        ]}
        title={t("customers.customers")} // Ensure "Customers" title is translated
      >
        {view === "table" ? (
          <Paper>
            <DataGrid
              rows={sortedCustomers}
              columns={columns}
              autoHeight
              hideFooter
              sortingOrder={['asc', 'desc']}
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model)}
              onRowClick={({ id }) => {
                return go({
                  to: `${editUrl("customers", id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                });
              }}
            />
          </Paper>
        ) : (
          <>
            <Divider
              sx={{
                marginBottom: "24px",
              }}
            />
            <Grid
              container
              spacing={3}
            >
              {sortedCustomers.map((customer: ICustomer) => (
                <Grid key={customer.id} item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      "&:hover .edit-button": {
                        display: "flex",
                      },
                    }}
                  >
                    <CardActionArea
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onClick={() => {
                        go({
                          to: `${editUrl("customers", customer.id)}`,
                          query: {
                            to: pathname,
                          },
                          options: {
                            keepQuery: true,
                          },
                          type: "replace",
                        });
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                        <Stack
                          mb="8px"
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography variant="body1" fontWeight={500}>
                            {customer.name} {customer.lastname}
                          </Typography>
                          <Typography variant="body1">
                            {customer.email}
                          </Typography>
                        </Stack>
                        <Typography color="text.secondary">
                          {customer.mobile}
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          marginTop: "auto",
                          borderTop: "1px solid",
                          borderColor: (theme) => theme.palette.divider,
                          width: "100%",
                        }}
                      >
                        <CustomerStatus size="small" value={customer.isActive} />
                      </CardActions>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Divider
              sx={{
                marginTop: "24px",
              }}
            />
          </>
        )}
      </RefineListView>
      {children}
    </>
  );
};
