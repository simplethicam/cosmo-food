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
import { IFile, IProduct, ICategory, Nullable } from "../../../interfaces";
import { useImageUpload } from "../../../utils";
import { DeleteButton, useAutocomplete } from "@refinedev/mui";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormLabel from "@mui/material/FormLabel";
import { ProductImageUpload } from "../../../components";

type Props = {
  action: "create" | "edit";
};

export const ProductDrawerForm = (props: Props) => {
  const { list } = useNavigation();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { queryResult } = useShow<IProduct>();
  const product = queryResult?.data?.data;

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    refineCore: { formLoading, onFinish, id },
    saveButtonProps,
  } = useForm<IProduct, HttpError, Nullable<IProduct>>({
    refineCoreProps: {
      resource: "products",
      id: props.action === "edit" ? product?.id : undefined,
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    defaultValues: {
      id: product?.id ?? "",
      name: product?.name ?? "",
      price: product?.price ?? 0,
      categoryId: product?.categoryId ?? null,
      isActive: product?.isActive ?? true,
      images: product?.images ?? [],
    },
  });

  const onClose = () => {
    list("products");
  };

  const imageInput: (IFile & { thumbnailUrl?: string })[] | null = watch("images") ?? null;

  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: "categories",
  });

  const imageUploadOnChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const target = event.target;
    const file: File = (target.files as FileList)[0];

    const image = await useImageUpload({
      apiUrl,
      file,
    });

    setValue("images", image, { shouldValidate: true });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onFinish)}>
        <DialogTitle>
          {props.action === "edit" ? t("products.actions.edit") : t("products.actions.create")}
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
                name="images"
                defaultValue={[]}
                render={({ field }) => (
                  <ProductImageUpload
                    {...field}
                    sx={{ width: "100%" }}
                    previewURL={imageInput?.[0]?.url}
                    inputProps={{
                      id: "images",
                      onChange: imageUploadOnChangeHandler,
                    }}
                  />
                )}
              />
              {errors.images && (
                <FormHelperText error>{errors.images.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                rules={{ required: t("errors.required.field", { field: "name" }) }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("products.fields.name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="price"
                defaultValue={0}
                rules={{ required: t("errors.required.field", { field: "price" }) }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("products.fields.price")}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                      ),
                    }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="categoryId"
                defaultValue={null}
                rules={{ required: t("errors.required.field", { field: "categoryId" }) }}
                render={({ field }) => (
                  <Autocomplete<ICategory>
                    {...field}
                    options={autocompleteProps.options}
                    getOptionLabel={(option) => option.title}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    value={autocompleteProps.options.find(option => option.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id ?? null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("products.fields.categoryId")}
                        error={!!errors.categoryId}
                        helperText={errors.categoryId?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>{t("products.fields.isActive.label")}</FormLabel>
              <Controller
                control={control}
                name="isActive"
                defaultValue={true}
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
                      {t("products.fields.isActive.true")}
                    </ToggleButton>
                    <ToggleButton value={false}>
                      {t("products.fields.isActive.false")}
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