import { PropsWithChildren, useMemo, useState, useEffect } from "react";
import { HttpError, useGo, useTranslate, useNavigation, useUpdate, useList } from "@refinedev/core";
import { CreateButton, useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { RefineListView } from "../../components";
import { ITable } from "../../interfaces";
import { useLocation } from "react-router-dom";
import { TableStatus } from "../../components/table/status";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import { Card, CardActionArea, CardActions, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";

type View = "table" | "card";

export const TableList = ({ children }: PropsWithChildren) => {
  const t = useTranslate();
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("table-view") as View;
    return view || "table";
  });

  const { mutate } = useUpdate();
  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl, editUrl } = useNavigation();
  const { data } = useList<ITable, HttpError>({ resource: "tables" });
  const [sortedData, setSortedData] = useState<ITable[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    if (data?.data) {
      setSortedData(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (sortModel.length > 0 && data?.data) {
      const sorted = [...data.data].sort((a, b) => {
        const field = sortModel[0].field;
        const sort = sortModel[0].sort;

        const aValue = a[field as keyof ITable];
        const bValue = b[field as keyof ITable];

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
      setSortedData(sorted);
    } else {
      setSortedData(data?.data || []);
    }
  }, [sortModel, data]);

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
        field: "isActive",
        headerName: t("products.fields.isActive.label"),
        headerAlign: "right",
        align: "right",
        flex: 1,
        renderCell: function render({ row }) {
          return <TableStatus value={row.isActive} />;
        },
      },
    ],
    [t, mutate]
  );

  const handleViewChange = (_e: React.MouseEvent<HTMLElement>, newView: View) => {
    setView(newView);
    localStorage.setItem("table-view", newView);
  };

  return (
    <>
      <RefineListView
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
                to: `${createUrl("tables")}`,
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
        {view === "table" ? (
          <Paper>
            <DataGrid
              rows={sortedData}
              columns={columns}
              autoHeight
              hideFooter
              sortingOrder={['asc', 'desc']}
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model)}
              onRowClick={({ id }) => {
                return go({
                  to: `${editUrl("tables", id)}`,
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
            <Divider sx={{ marginBottom: "24px" }} />
            <Grid container spacing={3}>
              {sortedData.map((table: ITable) => (
                <Grid key={table.id} item xs={12} sm={6} md={4} lg={3}>
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
                          to: `${editUrl("tables", table.id)}`,
                          query: { to: pathname },
                          options: { keepQuery: true },
                          type: "replace",
                        });
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                        <Stack mb="8px" direction="row" justifyContent="space-between">
                          <Typography variant="body1" fontWeight={500}>
                            {table.name}
                          </Typography>
                        </Stack>
                        <Typography color="text.secondary">
                          {table.position}
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
                        <TableStatus value={table.isActive} />
                      </CardActions>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ marginTop: "24px" }} />
          </>
        )}
      </RefineListView>
      {children}
    </>
  );
};
