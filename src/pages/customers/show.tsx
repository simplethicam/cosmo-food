import React from "react";
import {
  HttpError,
  useGetToPath,
  useGo,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DateField, NumberField, useDataGrid } from "@refinedev/mui";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { IOrder, ICustomer } from "../../interfaces";
import {
  OrderStatus,
  Drawer,
  DrawerHeader,
  OrderTableColumnProducts,
} from "../../components";

export const CustomerShow = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();

  const { queryResult } = useShow<ICustomer>();
  const customer = queryResult.data?.data;

  const { dataGridProps } = useDataGrid<
    IOrder,
    HttpError
  >({
    resource: "orders",
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      permanent: [
        {
          field: "customer.id",
          operator: "eq",
          value: customer?.id,
        },
      ],
    },
    syncWithLocation: false,
  });

  const columns = React.useMemo<GridColDef<IOrder>[]>(
    () => [
      {
        field: "id",
        headerName: t("orders.fields.orderNumber"),
        width: 88,
        renderCell: function render({ row }) {
          return <Typography>#{row.id}</Typography>;
        },
      },
      /*{
        field: "status.text",
        headerName: t("orders.fields.status"),
        width: 124,
        renderCell: function render({ row }) {
          return <OrderStatus status={row.status.text} />;
        },
      },*/
      {
        field: "products",
        headerName: t("orders.fields.products"),
        width: 184,
        sortable: false,
        renderCell: function render({ row }) {
          return <OrderTableColumnProducts order={row} />;
        },
      },
      {
        field: "amount",
        align: "right",
        headerAlign: "right",
        headerName: t("orders.fields.amount"),
        renderCell: function render({ row }) {
          return (
            <NumberField
              options={{
                currency: "EUR",
                style: "currency",
                notation: "compact",
              }}
              value={row.amount}
            />
          );
        },
        width: 100,
      },
      /*{
        field: "store",
        headerName: t("orders.fields.store"),
        width: 150,
        valueGetter: ({ row }) => row.store.title,
        sortable: false,
      },*/
    ],
    [t],
  );

  const onDrawerClose = () => {
    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  return (
    <Drawer
      open
      onClose={onDrawerClose}
      anchor="right"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "736px",
        },
      }}
    >
      <DrawerHeader onCloseClick={onDrawerClose} />
      <Stack spacing="32px" padding="32px 32px 56px 32px">
        <Stack spacing="28px" direction="row" alignItems="center">
          <Stack>
            <Typography color="text.secondary" fontWeight="700">
              #{customer?.id}
            </Typography>
            <Typography variant="h5">{customer?.companyName}</Typography>
          </Stack>
        </Stack>

        <Paper>
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <Typography>{t("customers.fields.phone")}</Typography>
            </Stack>
            <Typography>{customer?.phone}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <Typography>{t("customers.fields.mobile")}</Typography>
            </Stack>
            <Typography>{customer?.mobile}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <Typography>{t("customers.fields.email")}</Typography>
            </Stack>
            <Typography>{customer?.email}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <Typography>{t("customers.fields.vatId")}</Typography>
            </Stack>
            <Typography>{customer?.vatId}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" padding="24px">
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              width="144px"
            >
              <Typography>{t("customers.fields.address")}</Typography>
            </Stack>
            <Typography>{customer?.address.text}</Typography>
          </Stack>
        </Paper>

        <Paper>
          <DataGrid
            {...dataGridProps}
            columns={columns}
            autoHeight
            hideFooter
          />
        </Paper>
      </Stack>
    </Drawer>
  );
};
