import { useEffect, useState, useMemo } from "react";
import { HttpError, useNavigation, useShow, useTranslate, useUpdate } from "@refinedev/core";
import { ListButton } from "@refinedev/mui";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
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

export const OrderEdit = () => {
  const t = useTranslate();
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
        // Optional: handle success logic, e.g., redirect or show a success message
      },
    },
    defaultValues: {
      id: "",
      flowStatus: "open",
      companyId: "",
      deletedBy: { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
      table: { id: "", name: "", position: "" },
      updatedBy: { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
      createdBy: { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
      isActive: true,
      orderNumber: "",
      deleted: false,
      products: [],
      amount: 0,
      description: "",
    },
  });

  const { list } = useNavigation();

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
    console.log("Query Result:", queryResult);
  }, [queryResult]);

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
        },
      });
    }
  };

  const handleSave = () => {
    if (order) {
      const data = watch();
      onFinish({ ...order, ...data, products: order.products }); // Passa l'array aggiornato dei prodotti
    }
  };

  useEffect(() => {
    if (record) {
      setOrder(record);
      reset(record);
    }
  }, [record, reset]);

  const totalAmount = useMemo(() => {
    if (!order || !order.products) return 0;
    return order.products.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0).toFixed(2);
  }, [order]);

  const renderButtons = () => {
    switch (order?.flowStatus) {
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
              {...saveButtonProps}
              onClick={handleSubmit(handleSave)}
              variant="contained"
              color="primary"
            >
              {t("buttons.save")}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => list("orders")}
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
              {...saveButtonProps}
              onClick={handleSubmit(handleSave)}
              variant="contained"
              color="primary"
            >
              {t("buttons.save")}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => list("orders")}
            >
              {t("buttons.cancel")}
            </Button>
          </Stack>
        );
      case "CLOSED":
        return (
          <Stack key="actions" direction="row" spacing="8px">
            <Button
              {...saveButtonProps}
              onClick={handleSubmit(handleSave)}
              variant="contained"
            >
              {t("buttons.save")}
            </Button>
          </Stack>
        );
      default:
        return (
          <Stack key="actions" direction="row" spacing="8px">
            <Button
              {...saveButtonProps}
              onClick={handleSubmit(handleSave)}
              variant="contained"
            >
              {t("buttons.save")}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => list("orders")}
            >
              {t("buttons.cancel")}
            </Button>
          </Stack>
        );
    }
  };

  return (
    <>
      <ProductAdd open={open} onClose={handleClose} order={order} />
      <ListButton
        variant="outlined"
        sx={{
          borderColor: "GrayText",
          color: "GrayText",
          backgroundColor: "transparent",
        }}
        startIcon={<ArrowBack />}
        onClick={() => list("orders")}
      />
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
        headerButtons={[renderButtons()]}
      >
        <Grid container spacing={3}>
          <Grid xs={12} md={6} lg={8} height="max-content">
            <Button
              variant="outlined"
              size="small"
              color="info"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              {t("buttons.addProduct")}
            </Button>
            <Paper
              sx={{
                marginTop: theme.spacing(3),
                paddingBottom: theme.spacing(2),
              }}
            >
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
