import { PropsWithChildren, useMemo } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, EditButton, useDataGrid } from "@refinedev/mui";
import { useLocation } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { RefineListView } from "../../components";
import { StaffRating, StaffStatus } from "../../components/staff";
import { IStaff } from "../../interfaces";

export const StaffList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const t = useTranslate();

  const { dataGridProps } = useDataGrid<IStaff>();

  const columns = useMemo<GridColDef<IStaff>[]>(
    () => [
      {
        field: "id",
        headerName: "ID #",
        width: 64,
        renderCell: function render({ row }) {
          return <Typography>#{row.id}</Typography>;
        },
      },
      {
        field: "avatar",
        headerName: t("staff.fields.avatar.label"),
        width: 64,
        renderCell: function render({ row }) {
          return (
            <Avatar
              alt={`${row.name} ${row.surname}`}
              src={row.avatar?.[0]?.url}
              sx={{ width: 32, height: 32 }}
            />
          );
        },
      },
      {
        field: "name",
        width: 188,
        headerName: t("staff.fields.name.label"),
      },
      {
        field: "licensePlate",
        width: 112,
        headerName: t("staff.fields.licensePlate.label"),
      },
      {
        field: "gsm",
        width: 132,
        headerName: t("staff.fields.gsm.label"),
      },
      {
        field: "store",
        minWidth: 156,
        flex: 1,
        headerName: t("staff.fields.store.label"),
        renderCell: function render({ row }) {
          return <Typography>{row.store?.title}</Typography>;
        },
      },
      {
        field: "rating",
        width: 156,
        headerName: t("staff.fields.rating.label"),
        renderCell: function render({ row }) {
          return <StaffRating staff={row} />;
        },
      },
      {
        field: "status",
        width: 156,
        headerName: t("couriers.fields.status.label"),
        renderCell: function render({ row }) {
          return <StaffStatus value={row?.status} />;
        },
      },
      {
        field: "actions",
        headerName: t("table.actions"),
        type: "actions",
        renderCell: function render({ row }) {
          return (
            <EditButton
              hideText
              recordItemId={row.id}
              svgIconProps={{
                color: "action",
              }}
            />
          );
        },
      },
    ],
    [t],
  );

  return (
    <>
      <RefineListView
        headerButtons={() => [
          <CreateButton
            key="create"
            variant="contained"
            size="medium"
            sx={{ height: "40px" }}
            onClick={() => {
              return go({
                to: `${createUrl("staff")}`,
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
            {t("staff.actions.add")}
          </CreateButton>,
        ]}
      >
        <Paper>
          <DataGrid
            {...dataGridProps}
            columns={columns}
            sx={{}}
            autoHeight
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </Paper>
      </RefineListView>
      {children}
    </>
  );
};
