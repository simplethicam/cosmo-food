import React, { PropsWithChildren, useMemo, useState } from "react";
import {
  HttpError,
  useExport,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { useLocation } from "react-router-dom";
import { CreateButton, DateField, ExportButton, useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import { IUser } from "../../interfaces";
import { RefineListView } from "../../components";
import { Card, CardActionArea, CardActions, CardContent, Divider, Grid, Stack } from "@mui/material";

type View = "table" | "card";

export const UserList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl, createUrl } = useNavigation();
  const t = useTranslate();
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("user-view") as View;
    return view || "table";
  });

  const { dataGridProps, filters, sorters } = useDataGrid<
    IUser,
    HttpError
  >();

  const columns = useMemo<GridColDef<IUser>[]>(
    () => [
      {
        field: "id",
        headerName: "ID #",
        width: 52,
        renderCell: function render({ row }) {
          return <Typography>#{row.id}</Typography>;
        },
      },
      {
        field: "email",
        headerName: t("users.fields.email"),
        width: 200,
      },
      {
        field: "name",
        headerName: t("users.fields.name"),
        minWidth: 140,
      },
      {
        field: "familyName",
        headerName: t("users.fields.familyName"),
        minWidth: 140,
      },
      {
        field: "actions",
        headerName: t("table.actions"),
        width: 80,
        align: "center",
        headerAlign: "center",
        renderCell: function render({ row }) {
          return (
            <IconButton
              sx={{
                color: "text.secondary",
              }}
              onClick={() => {
                return go({
                  to: `${editUrl("users", row.id)}`,
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
              <VisibilityOutlined />
            </IconButton>
          );
        },
      },
    ],
    [t, go, pathname, editUrl],
  );

  const { isLoading, triggerExport } = useExport<IUser>({
    sorters,
    filters,
    pageSize: 50,
    maxItemCount: 50,
    mapData: (item) => {
      return {
        id: item.id,
        email: item.email,
        name: item.name,
        familyName: item.familyName,
      };
    },
  });

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View,
  ) => {
    setView(newView);
    localStorage.setItem("user-view", newView);
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
                to: `${createUrl("users")}`,
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
        ]}>
        {view === "table" ? (
          <Paper>
            <DataGrid
              {...dataGridProps}
              columns={columns}
              autoHeight
              hideFooter
              onRowClick={({ id }) => {
                return go({
                  to: `${editUrl("users", id)}`,
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
            {dataGridProps.rows?.map((user: IUser) => (
              <Grid key={user.id} item xs={12} sm={6} md={4} lg={3}>
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
                        to: `${editUrl("users", user.id)}`,
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
                          {user.name}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {user.email}
                        </Typography>
                      </Stack>
                      <Typography color="text.secondary">
                        {user.familyName}
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
                      <Typography variant="body2">{user.id}</Typography>
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