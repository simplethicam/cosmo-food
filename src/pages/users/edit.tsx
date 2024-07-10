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
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { IUser } from "../../interfaces";
import { DeleteButton } from "@refinedev/mui";

export const UserEdit = () => {
  const { list } = useNavigation();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { queryResult } = useShow<IUser>();
  const user = queryResult?.data?.data;

  const {
    handleSubmit,
    control,
    formState: { errors },
    refineCore: { formLoading, onFinish },
    saveButtonProps,
  } = useForm<IUser, HttpError, IUser>({
    refineCoreProps: {
      resource: "users",
      id: user?.id,
      queryOptions: {
        enabled: !!user,
      },
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    defaultValues: {
      name: user?.name ?? "",
      familyName: user?.familyName ?? "",
      email: user?.email ?? "",
    },
  });

  const onClose = () => {
    list("users");
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onFinish)}>
        <DialogTitle>
          {t("users.titles.edit")}
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
                defaultValue={user?.name ?? ""}
                rules={{ required: t("errors.required.field", { field: "name" }) }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("users.fields.name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="familyName"
                defaultValue={user?.familyName ?? ""}
                rules={{ required: t("errors.required.field", { field: "familyName" }) }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("users.fields.familyName")}
                    error={!!errors.familyName}
                    helperText={errors.familyName?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="email"
                defaultValue={user?.email ?? ""}
                rules={{ required: t("errors.required.field", { field: "email" }) }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("users.fields.email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <DeleteButton
            recordItemId={user?.id}
            variant="contained"
            onSuccess={onClose}
          />
          <Button {...saveButtonProps} variant="contained">
            {t("buttons.save")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
