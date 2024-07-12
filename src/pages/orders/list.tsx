import { useMemo, useState, useEffect } from "react";
import {
  useGo,
  HttpError,
  useTranslate,
  useUpdate,
  useNavigation,
  useList,
} from "@refinedev/core";
import {
  CreateButton,
  NumberField,
} from "@refinedev/mui";
import { useLocation } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import { IOrder, IOrderFilterVariables } from "../../interfaces";
import { OrderStatus, RefineListView } from "../../components";
import { Card, CardActionArea, CardActions, CardContent, Grid, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

type View = "table" | "card";

const statuses = ["ALL", "OPEN", "READY", "CLOSED", "CANCELLED"];

export const OrderList = () => {
  const t = useTranslate();
  const { mutate } = useUpdate();
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl, createUrl } = useNavigation();
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("order-view") as View;
    return view || "table";
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const { data, isLoading } = useList<IOrder, HttpError>({
    resource: "orders",
  });
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (data) {
      setFilteredOrders(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedStatus === "ALL") {
      setFilteredOrders(data?.data || []);
    } else {
      setFilteredOrders(data?.data.filter(order => order.flowStatus.toLowerCase() === selectedStatus.toLowerCase()) || []);
    }
  }, [selectedStatus, data]);

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value.toUpperCase());
  };

  const columns = useMemo<GridColDef<IOrder>[]>(
    () => [
      {
        field: "orderNumber",
        headerName: t("orders.fields.order"),
        description: t("orders.fields.order"),
        flex: 1,
        renderCell: function render({ row }) {
          return <Typography>#{row.orderNumber}</Typography>;
        },
      },
      {
        field: "table",
        headerName: t("tables.tables"),
        flex: 1,
        renderCell: function render({ row }) {
          return <Typography>{row.table?.name}</Typography>;
        },
      },
      {
        field: "amount",
        headerName: t("orders.fields.amount"),
        headerAlign: "right",
        align: "right",
        flex: 1,
        renderCell: function render({ row }) {
          return (
            <NumberField
              options={{
                currency: 'EUR',
                style: "currency",
              }}
              value={row.amount}
            />
          );
        },
      },
      {
        field: "status",
        headerName: t("orders.fields.status"),
        headerAlign: "right",
        align: "right",
        flex: 1,
        renderCell: function render({ row }) {
          return <OrderStatus value={row.flowStatus}></OrderStatus>;
        },
      },
    ],
    [t, mutate],
  );

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View,
  ) => {
    setView(newView);
    localStorage.setItem("order-view", newView);
  };

  return (
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
              to: `${createUrl("orders")}`,
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
    >
      <Stack direction="row" spacing="12px" py="16px" flexWrap="wrap">
        <Select
          value={selectedStatus}
          onChange={handleStatusFilterChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {t(`orders.status.${status}`, status === "ALL" ? t("orders.filter.allStatuses") : undefined)}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {view === "table" ? (
        <Paper>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            autoHeight
            hideFooter
            onRowClick={({ id }) => {
              return go({
                to: `${editUrl("orders", id)}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
            sx={{
              "& .MuiDataGrid-row": {
                cursor: "pointer",
              },
            }}
          />
        </Paper>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {filteredOrders.map((order: IOrder) => (
            <Grid key={order.id} item xs={12} sm={6} md={4} lg={3}>
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
                      to: `${editUrl("orders", order.id)}`,
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
                        {order.orderNumber}
                      </Typography>
                      <NumberField
                        variant="body1"
                        fontWeight={500}
                        value={order.amount}
                        options={{
                          style: "currency",
                          currency: "EUR",
                        }}
                      />
                    </Stack>
                    <Typography color="text.secondary">{order.table?.name}</Typography>
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
                    <OrderStatus value={order.flowStatus}></OrderStatus>
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </RefineListView>
  );
};
