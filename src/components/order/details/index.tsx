import {
  useTranslate,
  useList,
} from "@refinedev/core";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel
} from "@mui/material";
import { IOrder, ITable, IUser } from "../../../interfaces";
import { useEffect } from "react";

type Props = {
  order?: IOrder;
  onUpdate: (updatedOrder: IOrder) => void;
};

export const OrderDetails = ({ order, onUpdate }: Props) => {
  const t = useTranslate();

  const { data: tablesData } = useList<ITable>({ resource: "tables" });
  const { data: usersData } = useList<IUser>({ resource: "users" });

  const tables = tablesData?.data ?? [];
  const users = usersData?.data ?? [];

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IOrder>({
    defaultValues: {
      ...order,
      createdBy: order?.createdBy || { id: '', email: '', password: '', name: '', createdBy: { name: '', email: '', username: '' }, familyName: '', companyId: '', isActive: true } as IUser,
    },
  });

  useEffect(() => {
    if (order) {
      reset({
        ...order,
        createdBy: order.createdBy || { id: '', email: '', password: '', name: '', createdBy: { name: '', email: '', username: '' }, familyName: '', companyId: '', isActive: true } as IUser,
      });
    }
  }, [order, reset]);

  const onSubmit = (data: IOrder) => {
    if (order) {
      onUpdate({ ...order, ...data });
    }
  };

  const saveChanges = () => {
    if (!order) return;

    const data = watch();
    const updatedOrder: Partial<IOrder> = { ...order };

    if (data.table?.id !== order.table.id) {
      const selectedTable = tables.find(table => table.id === data.table.id);
      if (selectedTable) {
        updatedOrder.table = { id: selectedTable.id, name: selectedTable.name, position: selectedTable.position };
      }
    }

    if (data.createdBy?.id !== order.createdBy.id) {
      const selectedUser = users.find(user => user.id === data.createdBy?.id);
      if (selectedUser) {
        updatedOrder.createdBy = {
          id: selectedUser.id,
          email: selectedUser.email,
          password: selectedUser.password,
          name: selectedUser.name,
          createdBy: selectedUser.createdBy,
          familyName: selectedUser.familyName,
          companyId: selectedUser.companyId,
          isActive: selectedUser.isActive
        };
      }
    }

    if (data.description !== order.description) {
      updatedOrder.description = data.description;
    }

    if (data.flowStatus !== order.flowStatus) {
      updatedOrder.flowStatus = data.flowStatus;
    }

    onUpdate(updatedOrder as IOrder);
  };

  const getTable = () => {
    const table = tables.find(table => table.id === order?.table.id);
    return table ? table.id : "";
  };

  const getUser = () => {
    const user = users.find(user => user.id === order?.createdBy.id);
    return user ? user.id : "";
  };

  const getDescription = () => {
    return order?.description ?? "";
  };

  const getStatus = () => {
    return order?.flowStatus ?? "new";
  };

  if (!order) return null;

  return (
    <Box padding={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="table">{t("orders.fields.table")}</InputLabel>
          <Controller
            control={control}
            name="table.id"
            rules={{ required: t("errors.required.field", { field: "table" }) }}
            render={({ field }) => (
              <Select
                {...field}
                inputProps={{ id: "table" }}
                label={t("orders.fields.table")}
                error={!!errors.table?.id}
                defaultValue={getTable()}
                onBlur={saveChanges}
                onChange={(e) => {
                  setValue("table.id", e.target.value);
                  saveChanges();
                }}
              >
                {tables.map((table) => (
                  <MenuItem key={table.id} value={table.id}>
                    {table.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.table?.id?.message}</FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="user">{t("orders.fields.user")}</InputLabel>
          <Controller
            control={control}
            name="createdBy.id"
            render={({ field }) => (
              <Select
                {...field}
                inputProps={{ id: "user" }}
                label={t("orders.fields.user")}
                defaultValue={getUser()}
                onBlur={saveChanges}
                onChange={(e) => {
                  const selectedUser = users.find(user => user.id === e.target.value);
                  if (selectedUser) {
                    setValue("createdBy", {
                      id: selectedUser.id,
                      email: selectedUser.email,
                      password: selectedUser.password,
                      name: selectedUser.name,
                      createdBy: selectedUser.createdBy,
                      familyName: selectedUser.familyName,
                      companyId: selectedUser.companyId,
                      isActive: selectedUser.isActive
                    });
                    saveChanges();
                  }
                }}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.createdBy?.id?.message}</FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="normal">
  <Controller
    control={control}
    name="description"
    render={({ field }) => (
      <TextField
        {...field}
        inputProps={{ id: "description" }}
        label={t("orders.fields.description")}
        multiline
        rows={4}
        defaultValue={getDescription()}
        onBlur={saveChanges}
        onChange={(e) => {
          setValue("description", e.target.value);
          saveChanges();
        }}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "gray", // colore del bordo normale
            },
            "&:hover fieldset": {
              borderColor: "gray", // colore del bordo al passaggio del mouse
            },
            "&.Mui-focused fieldset": {
              borderColor: "gray", // colore del bordo quando il campo è focalizzato
            },
          },
          "& .MuiInputBase-input": {
            padding: "8px",
            color: "white",  // Colore del testo
          },
          "& .MuiInputLabel-root": {
            color: "orange", // Colore dell'etichetta quando il campo è vuoto
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(14px, -6px) scale(0.75)", // Assicurati che l'etichetta si posizioni correttamente
          },
          "& .Mui-focused": {
            outline: "none", // Rimuovi l'outline blu
          },
        }}
      />
    )}
  />
  <FormHelperText>{errors.description?.message}</FormHelperText>
</FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="status">{t("orders.fields.status")}</InputLabel>
          <Controller
            control={control}
            name="flowStatus"
            render={({ field }) => (
              <Select
                {...field}
                inputProps={{ id: "status" }}
                label={t("orders.fields.status")}
                defaultValue={getStatus()}
                onBlur={saveChanges}
                onChange={(e) => {
                  setValue("flowStatus", e.target.value);
                  saveChanges();
                }}
              >
                <MenuItem value="new">{t("orders.status.new")}</MenuItem>
                <MenuItem value="ready">{t("orders.status.ready")}</MenuItem>
                <MenuItem value="close">{t("orders.status.evadi")}</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.flowStatus?.message}</FormHelperText>
        </FormControl>
      </form>
    </Box>
  );
};
