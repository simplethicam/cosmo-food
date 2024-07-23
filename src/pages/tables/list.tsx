import { useMemo, useState, useEffect, PropsWithChildren } from "react";
import {
  useTranslate,
  useUpdate,
  useList,
  HttpError,
} from "@refinedev/core";
import {
  CreateButton,
} from "@refinedev/mui";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import { ITable, IOrder } from "../../interfaces";
import { OrderStatus, RefineListView } from "../../components";
import { Card, CardActionArea, CardActions, CardContent, Grid, Stack, ToggleButton, ToggleButtonGroup, IconButton, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SwipeableViews from 'react-swipeable-views';
import useMediaQuery from '@mui/material/useMediaQuery';

type View = "table" | "card";

const groupTablesByRoom = (tables: ITable[]) => {
  return tables.reduce((groups, table) => {
    const roomName = table.position || "Unknown";
    if (!groups[roomName]) {
      groups[roomName] = [];
    }
    groups[roomName].push(table);
    return groups;
  }, {} as { [key: string]: ITable[] });
};

const sortTablesByName = (tables: ITable[]) => {
  return tables.sort((a, b) => {
    const regex = /(\D+)(\d+)/;
    const [, aName, aNumber] = a.name.match(regex) || [];
    const [, bName, bNumber] = b.name.match(regex) || [];
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    return (parseInt(aNumber) || 0) - (parseInt(bNumber) || 0);
  });
};

export const TableList = ({ children }: PropsWithChildren) => {
  const t = useTranslate();
  const { mutate } = useUpdate();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("table-view") as View;
    return view || "table";
  });
  const { data: tablesData, isLoading: tablesLoading } = useList<ITable, HttpError>({
    resource: "tables",
  });
  const { data: ordersData, isLoading: ordersLoading } = useList<IOrder, HttpError>({
    resource: "orders",
  });
  const [filteredTables, setFilteredTables] = useState<{ [key: string]: ITable[] }>({});

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

  useEffect(() => {
    if (tablesData) {
      const groupedTables = groupTablesByRoom(tablesData.data);
      for (const room in groupedTables) {
        groupedTables[room] = sortTablesByName(groupedTables[room]);
      }
      setFilteredTables(groupedTables);
    }
  }, [tablesData]);

  const columns = useMemo<GridColDef<ITable>[]>(
    () => [
      {
        field: "name",
        headerName: t("tables.fields.name"),
        flex: 1,
      },
      {
        field: "position",
        headerName: t("tables.fields.position"),
        flex: 1,
      },
      {
        field: "orderStatus",
        headerName: t("orders.fields.status"),
        headerAlign: "right",
        align: "right",
        flex: 1,
        renderCell: function render({ row }) {
          const activeOrder = ordersData?.data.find(order => order.table.id === row.id);
          return (activeOrder && activeOrder.flowStatus !== "CLOSED") ? <OrderStatus value={activeOrder.flowStatus} /> : <OrderStatus value="FREE" />;
        },
      },
      {
        field: "actions",
        headerAlign: "right",
        align: "right",
        flex: 1,
        renderCell: ({ row }) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tables/${row.id}/edit`, { state: { from: pathname } });
            }}
          >
            <SettingsIcon />
          </IconButton>
        ),
      },
    ],
    [t, mutate, ordersData, navigate, pathname]
  );

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View,
  ) => {
    setView(newView);
    localStorage.setItem("table-view", newView);
  };

  const handleTableClick = (tableId: string) => {
    const table = tablesData?.data.find(table => table.id === tableId);
    if (!table?.isActive) {
      return; // Se il tavolo non è attivo, esce dalla funzione
    }

    const tableOrders = ordersData?.data.filter(order => order.table.id === tableId) || [];

    if (tableOrders.length === 0 || tableOrders.every(order => !order.isActive)) {
      navigate(`/orders/new`, { state: { tableId, from: pathname, tableName: table.name } });
    } else {
      const activeOrder = tableOrders.find(order => order.isActive);
      if (activeOrder) {
        navigate(`/orders/${activeOrder.id}/edit`, { state: { from: pathname } });
      }
    }
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
              navigate(`/tables/new`, { state: { from: pathname } });
            }}
          >
            {t("buttons.create")}
          </CreateButton>,
        ]}
      >
        {view === "table" ? (
          <Paper>
            <DataGrid
              rows={Object.values(filteredTables).flat()}
              columns={columns}
              autoHeight
              hideFooter
              getRowClassName={(params) => params.row.isActive ? '' : 'inactive-row'}
              onRowClick={({ id }) => handleTableClick(id as string)}
              sx={{
                "& .MuiDataGrid-row.inactive-row": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)", // colore per i tavoli inattivi
                },
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                },
              }}
            />
          </Paper>
        ) : isMobile ? (
          <SwipeableViews>
            {Object.keys(filteredTables).map((room) => (
              <div key={room}>
                <Typography variant="h6" gutterBottom>
                  {room}
                </Typography>
                <Grid container spacing={3}>
                  {filteredTables[room].map((table: ITable) => {
                    const activeOrder = ordersData?.data.find(order => order.table.id === table.id);
                    return (
                      <Grid key={table.id} item xs={12} sm={6} md={4} lg={3}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            backgroundColor: table.isActive ? 'inherit' : 'rgba(255, 0, 0, 0.1)', // colore per i tavoli inattivi
                          }}
                        >
                          <CardActionArea
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                            onClick={() => handleTableClick(table.id)}
                          >
                            <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                              <Stack
                                mb="8px"
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography variant="body1" fontWeight={500}>
                                  {table.name}
                                </Typography>
                              </Stack>
                              <Typography color="text.secondary">{table.position}</Typography>
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
                              <OrderStatus value={(activeOrder && activeOrder.flowStatus !== "CLOSED") ? activeOrder.flowStatus : "FREE"} />
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tables/${table.id}/edit`, { state: { from: pathname } });
                                }}
                              >
                                <SettingsIcon />
                              </IconButton>
                            </CardActions>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            ))}
          </SwipeableViews>
        ) : (
          <Box>
            {Object.keys(filteredTables).map((room) => (
              <Box key={room} mb={4}>
                <Typography variant="h6" gutterBottom>
                  {room}
                </Typography>
                <Grid container spacing={3}>
                  {filteredTables[room].map((table: ITable) => {
                    const activeOrder = ordersData?.data.find(order => order.table.id === table.id);
                    return (
                      <Grid key={table.id} item xs={12} sm={6} md={4} lg={3}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            backgroundColor: table.isActive ? 'inherit' : 'rgba(255, 0, 0, 0.1)', // colore per i tavoli inattivi
                          }}
                        >
                          <CardActionArea
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                            onClick={() => handleTableClick(table.id)}
                          >
                            <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                              <Stack
                                mb="8px"
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography variant="body1" fontWeight={500}>
                                  {table.name}
                                </Typography>
                              </Stack>
                              <Typography color="text.secondary">{table.position}</Typography>
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
                              <OrderStatus value={(activeOrder && activeOrder.flowStatus !== "CLOSED") ? activeOrder.flowStatus : "FREE"} />
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tables/${table.id}/edit`, { state: { from: pathname } });
                                }}
                              >
                                <SettingsIcon />
                              </IconButton>
                            </CardActions>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </RefineListView>
      {children}
    </>
  );
};
