import React from "react";
import {
  useTranslate,
  HttpError,
  useNavigation,
  useApiUrl,
  useShow,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ITable, Nullable } from "../../../interfaces";
import FormLabel from "@mui/material/FormLabel";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DeleteButton } from "@refinedev/mui";

type Props = {
  action: "create" | "edit";
};

export const TableDrawerForm = (props: Props) => {
  const { list } = useNavigation();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { queryResult } = useShow<ITable>();
  const table = queryResult?.data?.data;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    refineCore: { formLoading, onFinish, id },
    saveButtonProps
  } = useForm<ITable, HttpError, Nullable<ITable>>({
    refineCoreProps: {
      resource: "tables",
      id: props.action === "edit" ? table?.id : undefined,
      queryOptions: {
        enabled: !!table,
      },
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    defaultValues: {
      id: table?.id ?? "",
      name: table?.name ?? "",
      position: table?.position ?? "",
      isActive: table?.isActive ?? true,
    },
  });

  const onClose = () => {
    list("tables");
  };

  const onSubmit = async (data: Nullable<ITable>) => {
    try {
      if (props.action === "edit" && table?.id) {
        await fetch(`${apiUrl}/tables/${table.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else if (props.action === "create") {
        await fetch(`${apiUrl}/tables`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving table", error);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {props.action === "edit" ? t("tables.actions.edit") : t("tables.actions.create")}
          <IconButton
            color="error"
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="name"
                defaultValue={table?.name ?? ""}
                rules={{ required: t("errors.required.field", { field: "name" }) }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("tables.fields.name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="position"
                defaultValue={table?.position ?? ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("tables.fields.position")}
                    error={!!errors.position}
                    helperText={errors.position?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>{t("tables.fields.isActive.label")}</FormLabel>
              <Controller
                control={control}
                name="isActive"
                defaultValue={table?.isActive ?? true}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    fullWidth
                    color="primary"
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                  >
                    <ToggleButton value={true}>
                      {t("tables.fields.isActive.true")}
                    </ToggleButton>
                    <ToggleButton value={false}>
                      {t("tables.fields.isActive.false")}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              {errors.isActive && (
                <FormHelperText error>{errors.isActive.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          {props.action === "edit" && (
            <DeleteButton
              recordItemId={id}
              variant="contained"
              onSuccess={onClose}
            />
          )}
          <Button {...saveButtonProps} variant="contained">
            {t("buttons.save")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
