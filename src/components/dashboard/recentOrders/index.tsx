import React, { useEffect, useState, useMemo } from "react";
import {
  useTranslate,
  useList,
  useNavigation,
  useGo,
} from "@refinedev/core";
import { NumberField } from "@refinedev/mui";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IOrder } from "../../../interfaces";
import { getUniqueListWithCount } from "../../../utils";
import { OrderStatus } from "../../order";
import { useLocation } from "react-router-dom";

export const RecentOrders: React.FC = () => {
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl } = useNavigation();

  const { data, isLoading } = useList<IOrder>({
    resource: "orders",
    config: {
      filters: [
        {
          field: "status.text",
          operator: "eq",
          value: "Pending",
        },
      ],
      sort: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
      pagination: {
        current: 1,
        pageSize: 10,
      },
    },
  });

  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (data?.data) {
      setFilteredOrders(data.data);
    }
  }, [data]);

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
    [t, go],
  );

  return (
    <Paper sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
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
  );
};
