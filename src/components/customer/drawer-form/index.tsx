import React, { useState } from "react";
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
import { ICustomer } from "../../../interfaces";
import { Tabs, Tab, Box, FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { DeleteButton } from "@refinedev/mui";

type Props = {
  action: "create" | "edit";
};

export const CustomerDrawerForm = (props: Props) => {
  const { list } = useNavigation();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { queryResult } = useShow<ICustomer>();
  const customer = queryResult?.data?.data;
  
  const [currentTab, setCurrentTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setCurrentTab(index);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    refineCore: { formLoading, onFinish, id },
    saveButtonProps,
  } = useForm<ICustomer, HttpError, ICustomer>({
    refineCoreProps: {
      resource: "customers",
      id: props.action === "edit" ? customer?.id : undefined,
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    defaultValues: {
      id: customer?.id ?? "",
      companyName: customer?.companyName ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      fiscalCode: customer?.fiscalCode ?? "",
      vatId: customer?.vatId ?? "",
      name: customer?.name ?? "",
      gender: customer?.gender ?? "",
      isActive: customer?.isActive ?? "true",
      lastname: customer?.lastname ?? "",
      deleted: customer?.deleted ?? "false",
      mobile: customer?.mobile ?? "",
      pec: customer?.pec ?? "",
      sdiCode: customer?.sdiCode ?? "",
      type: customer?.type ?? "",
    },
  });

  const onClose = () => {
    list("customers");
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onFinish)}>
        <DialogTitle>
          {props.action === "edit" ? t("customers.editTitle") : t("customers.createTitle")}
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
          <Tabs value={currentTab} onChange={handleChangeTab}>
            <Tab label={"Contact"} />
            <Tab label={"Company"} />
            <Tab label={"Status"} />
          </Tabs>
          <Box mt={3}>
            <SwipeableViews index={currentTab} onChangeIndex={handleChangeIndex}>
              <Box mt={1}>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="name"
                      rules={{ required: t("errors.required.field", { field: "name" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.name")}
                          error={!!errors.name}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="lastname"
                      rules={{ required: t("errors.required.field", { field: "lastname" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.lastname")}
                          error={!!errors.lastname}
                          helperText={errors.lastname?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="gender"
                      rules={{ required: t("errors.required.field", { field: "gender" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.gender")}
                          error={!!errors.gender}
                          helperText={errors.gender?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="email"
                      rules={{ required: t("errors.required.field", { field: "email" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.email")}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="mobile"
                      rules={{ required: t("errors.required.field", { field: "mobile" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.mobile")}
                          error={!!errors.mobile}
                          helperText={errors.mobile?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="phone"
                      rules={{ required: t("errors.required.field", { field: "phone" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.phone")}
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Stack>
              </Box>
              <Box mt={1}>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="companyName"
                      rules={{ required: t("errors.required.field", { field: "companyName" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.companyName")}
                          error={!!errors.companyName}
                          helperText={errors.companyName?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="fiscalCode"
                      rules={{ required: t("errors.required.field", { field: "fiscalCode" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.fiscalCode")}
                          error={!!errors.fiscalCode}
                          helperText={errors.fiscalCode?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="vatId"
                      rules={{ required: t("errors.required.field", { field: "vatId" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.vatId")}
                          error={!!errors.vatId}
                          helperText={errors.vatId?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="pec"
                      rules={{ required: t("errors.required.field", { field: "pec" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.pec")}
                          error={!!errors.pec}
                          helperText={errors.pec?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="sdiCode"
                      rules={{ required: t("errors.required.field", { field: "sdiCode" }) }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("customers.fields.sdiCode")}
                          error={!!errors.sdiCode}
                          helperText={errors.sdiCode?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Stack>
              </Box>
              <Box>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <FormLabel>{t("errors.required.field", { field: "deleted" })}</FormLabel>
                    <Controller
                      control={control}
                      name="deleted"
                      defaultValue={"true"}
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
                          <ToggleButton value={"true"}>
                            {t("products.fields.isActive.true")}
                          </ToggleButton>
                          <ToggleButton value={"false"}>
                            {t("products.fields.isActive.false")}
                          </ToggleButton>
                        </ToggleButtonGroup>
                      )}
                    />
                  </FormControl>
                </Stack>
              </Box>
            </SwipeableViews>
          </Box>
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
