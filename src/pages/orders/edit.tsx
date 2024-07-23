import { useEffect, useState, useMemo } from "react";
import { HttpError, useShow, useTranslate, useUpdate } from "@refinedev/core";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import ArrowBack from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { OrderDetails, OrderProducts, Card } from "../../components";
import { RefineListView } from "../../components";
import { IOrder, IProduct, Nullable } from "../../interfaces";
import { ProductAdd } from "./add";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router-dom";

export const OrderEdit = () => {
  const t = useTranslate(); 
  const navigate = useNavigate(); // Usa useNavigate
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<IOrder | undefined>();

  const {
    formState: { errors },
    refineCore: { formLoading, onFinish, id },
    saveButtonProps,
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<IOrder, HttpError, Nullable<IOrder>>({
    refineCoreProps: {
      resource: "orders",
      id: order?.id,
      redirect: false,
      onMutationSuccess: () => {
        // Optional: handle success logic, e.g., redirect o mostra un messaggio di successo
      },
    },
    defaultValues: {
      id: "",
      flowStatus: "OPEN",
      companyId: "",
      deletedBy: { id: "", email: "", name: ""},
      table: { id: "", name: "", position: "" },
      updatedBy: { id: "", email: "", name: ""},
      createdBy: { id: "", email: "", name: ""},
      isActive: true,
      orderNumber: "",
      deleted: false,
      products: [],
      amount: 0,
      description: "",
    },
  });

  const handleClickOpen = () => {
    if (order) {
      setOpen(true);
    }
  };

  const handleClose = (selectedProducts: { product: IProduct; quantity: number }[]) => {
    setOpen(false);
    if (selectedProducts.length > 0 && order) {
      const updatedProducts = [...order.products];

      selectedProducts.forEach(({ product, quantity }) => {
        const existingProduct = updatedProducts.find(p => p.id === product.id);
        if (existingProduct) {
          existingProduct.quantity = quantity;
        } else {
          updatedProducts.push({ ...product, quantity });
        }
      });

      const updatedOrder = {
        ...order,
        products: updatedProducts,
        amount: Number(updatedProducts.reduce((total, product) => total + product.price * (product.quantity || 1), 0).toFixed(2))
      };

      setOrder(updatedOrder);
      setValue("products", updatedProducts); // Aggiorna i prodotti nel form
    }
  };

  const handleDetailsUpdate = (updatedOrder: Partial<IOrder>) => {
    setOrder((prevOrder) => {
      if (!prevOrder) return prevOrder;
      const newOrder = { ...prevOrder, ...updatedOrder };
      reset(newOrder);
      return newOrder;
    });
  };

  const { queryResult } = useShow<IOrder>();
  const record = queryResult.data?.data;

  useEffect(() => {
    if (record) {
      setOrder(record);
      reset(record);
    }
  }, [record, reset]);

  const { mutate } = useUpdate();

  const theme = useTheme();

  const handleMutate = (status: string) => {
    if (order) {
      const data = watch();
      mutate({
        resource: "orders",
        id: order.id.toString(),
        values: {
          ...order,
          ...data,
          flowStatus: status,
          isActive: status === "CLOSED" || status === "CANCELLED" ? false : order.isActive,
        },
      });
    }
  };

  const handleSave = () => {
    if (order) {
      const data = watch();
      order.amount = parseFloat(totalAmount.toString());
      data.amount = parseFloat(totalAmount.toString());
      onFinish({ ...order, ...data, products: order.products });
    }
  };

  const totalAmount = useMemo(() => {
    if (!order || !order.products) return 0;
    return order.products.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0).toFixed(2);
  }, [order]);

  const renderButtons = () => {
    switch (order?.flowStatus.toUpperCase()) {
      case "OPEN":
        return (
          <Stack key="actions" direction="row" spacing="8px">
            <Button
              variant="outlined"
              size="small"
              color="warning"
              startIcon={<AccessAlarmIcon />}
              onClick={() => handleMutate("READY")}
            >
              {t("buttons.ready")}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => handleMutate("CANCELLED")}
            >
              {t("buttons.cancel")}
            </Button>
          </Stack>
        );
      case "READY":
        return (
          <Stack key="actions" direction="row" spacing="8px">
            <Button
              variant="outlined"
              size="small"
              color="success"
              startIcon={<PointOfSaleIcon />}
              onClick={() => handleMutate("CLOSED")}
            >
              {t("buttons.close")}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => handleMutate("CANCELLED")}
            >
              {t("buttons.cancel")}
            </Button>
          </Stack>
        );
      default:
        return (
          <></>
        );
    }
  };

  return (
    <>
      <ProductAdd open={open} onClose={handleClose} order={order} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}
        sx={{
          marginTop: "24px",
        }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: "GrayText",
            color: "GrayText",
            backgroundColor: "transparent",
          }}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          >
            {t("orders.buttons.back")}
          </Button>
        <Stack direction="row" spacing={2} alignItems="center">
          {renderButtons()}
        </Stack>
      </Stack>
      <Divider
        sx={{
          marginBottom: "24px",
          marginTop: "24px",
        }}
      />
      <RefineListView
        title={
          <Typography variant="h5">
            {t("orders.order")} #{record?.orderNumber}
          </Typography>
        }
        headerButtons={
          <Button
            {...saveButtonProps}
            onClick={handleSubmit(handleSave)}
            variant="contained"
            color="primary"
          >
            {t("buttons.save")}
          </Button>}
      >
        <Grid container spacing={3}>
          <Grid xs={12} md={6} lg={8} height="max-content">
            <Paper
              sx={{
                paddingBottom: theme.spacing(2),
              }}
            >
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                sx={{ marginBottom: theme.spacing(2), marginLeft: theme.spacing(2), marginTop: theme.spacing(2) }}
              >
                {t("buttons.addProduct")}
              </Button>
              <OrderProducts order={order} />
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1} sx={{ marginRight: theme.spacing(2), marginTop: theme.spacing(2) }}>
                <Typography variant="h6">
                  {t("orders.total")}:
                </Typography>
                <Typography variant="h6" color="primary">
                  €{totalAmount}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid xs={12} md={6} lg={4} height="max-content">
            <Card title={t("orders.titles.orderDetails")}>
              <OrderDetails order={order} onUpdate={handleDetailsUpdate} />
            </Card>
          </Grid>
        </Grid>
      </RefineListView>
    </>
  );
};
