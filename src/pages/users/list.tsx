import React, { PropsWithChildren, useMemo, useState, useEffect } from "react";
import {
  HttpError,
  useGo,
  useNavigation,
  useTranslate,
  useList,
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
import { IUser } from "../../interfaces";
import { CategoryStatus, RefineListView } from "../../components";
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

  const { data: usersData, isLoading } = useList<IUser, HttpError>({
    resource: "users",
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortedUsers, setSortedUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (usersData?.data) {
      setSortedUsers(usersData.data);
    }
  }, [usersData]);

  useEffect(() => {
    if (sortModel.length > 0 && usersData?.data) {
      const sorted = [...usersData.data].sort((a, b) => {
        const field = sortModel[0].field;
        const sort = sortModel[0].sort;

        const aValue = a[field as keyof IUser];
        const bValue = b[field as keyof IUser];

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
      setSortedUsers(sorted);
    } else {
      setSortedUsers(usersData?.data || []);
    }
  }, [sortModel, usersData]);

  const columns = useMemo<GridColDef<IUser>[]>(
    () => [
      {
        field: "name",
        headerName: t("users.fields.name"),
        flex: 1,
      },
      {
        field: "email",
        headerName: t("users.fields.email"),
        flex: 1,
      },
      {
        field: "isActive",
        headerName: t("categories.fields.isActive.label"),
        align: "right",
        flex: 1,
        renderCell: function render({ row }) {
          return <CategoryStatus value={row.isActive} />;
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
              rows={sortedUsers}
              columns={columns}
              autoHeight
              hideFooter
              sortingOrder={['asc', 'desc']}
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model)}
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
              {sortedUsers.map((user: IUser) => (
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
                      {/*<CardActions
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
                      </CardActions>*/}
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
