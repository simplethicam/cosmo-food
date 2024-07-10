import { useState, useMemo } from "react";
import { HttpError, useTranslate, useCreate } from "@refinedev/core";
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
import { IOrder, IProduct, IUser } from "../../interfaces";
import { ProductAdd } from "./add";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation } from "@refinedev/core";

const generateUniqueOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const OrderCreate = () => {
  const t = useTranslate();
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<IOrder>({
    id: "",
    flowStatus: "new", // Set the initial status to "new"
    companyId: "",
    deletedBy: { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
    table: { id: "", name: "", position: "" },
    updatedBy: { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
    createdBy: { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
    isActive: true,
    orderNumber: generateUniqueOrderNumber(),
    deleted: false,
    products: [],
    amount: 0,
    description: "",
    customer: {
      id: "",
      address: {
        city: "",
        province: "",
        street: "",
        zip: ""
      },
      companyName: "",
      email: "",
      fiscalCode: "",
      mobile: "",
      pec: "",
      phone: "",
      sdiCode: "",
      site: "",
      vatId: "",
      name: "",
      gender: "",
      isActive: "",
      lastname: "",
      deleted: "",
      type: "",
    }
  });

  const {
    formState: { errors },
    refineCore: { onFinish },
    saveButtonProps,
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<IOrder, HttpError>({
    refineCoreProps: {
      resource: "orders",
      redirect: false,
      onMutationSuccess: () => {
        // Optional: handle success logic, e.g., redirect or show a success message
      },
    },
    defaultValues: order,
  });

  const { list } = useNavigation();

  const handleClickOpen = () => {
    setOpen(true);
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
        amount: Number(updatedProducts.reduce((total, product) => total + product.price * (product.quantity || 1), 0)/*.toFixed(2)*/)
      };

      setOrder(updatedOrder);
      setValue("products", updatedProducts);
    }
  };

  const handleDetailsUpdate = (updatedOrder: Partial<IOrder>) => {
    setOrder((prevOrder) => {
      if (!prevOrder) return prevOrder;
      const newOrder = { ...prevOrder, ...updatedOrder };
      return newOrder;
    });
  };

  const { mutate } = useCreate();

  const theme = useTheme();

  const handleMutate = (status: string) => {
    setOrder((prevOrder) => {
      if (!prevOrder) return prevOrder;
      const updatedOrder = { ...prevOrder, flowStatus: status };
      handleSave(updatedOrder); // Pass the updated order to handleSave
      return updatedOrder;
    });
  };

  const handleSave = (updatedOrder?: IOrder) => {
    const currentOrder = updatedOrder || order;
    if (currentOrder) {
      const data = watch();
      const amount = currentOrder.products.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0)/*.toFixed(2)*/;
      const finalOrder = {
        ...currentOrder,
        ...data,
        products: currentOrder.products,
        amount: amount,
        table: currentOrder.table ?? { id: "", name: "", position: "" },
        createdBy: currentOrder.createdBy ?? { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
        deletedBy: currentOrder.deletedBy ?? { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true },
        updatedBy: currentOrder.updatedBy ?? { id: "", email: "", password: "", name: "", createdBy: { name: "", email: "", username: "" }, familyName: "", companyId: "", isActive: true }
      };
      setOrder(finalOrder as IOrder);
      onFinish(finalOrder);
    }
  };

  const totalAmount = useMemo(() => {
    if (!order || !order.products) return 0;
    return order.products.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0)/*.toFixed(2)*/;
  }, [order]);

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
            {t("orders.order")} #{order?.orderNumber}
          </Typography>
        }
        headerButtons={
          <Stack key="actions" direction="row" spacing="8px">
            <Button
              {...saveButtonProps}
              onClick={handleSubmit(() => handleSave(order))}
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
        }
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
