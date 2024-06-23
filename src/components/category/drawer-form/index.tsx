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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormLabel from "@mui/material/FormLabel";
import { ICategory, Nullable } from "../../../interfaces";
import { DeleteButton } from "@refinedev/mui";

type Props = {
  action: "create" | "edit";
};

export const CategoryDrawerForm = (props: Props) => {
  const { list } = useNavigation();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { queryResult } = useShow<ICategory>();
  const category = queryResult?.data?.data;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    refineCore: { formLoading, onFinish, id },
    saveButtonProps,
  } = useForm<ICategory, HttpError, Nullable<ICategory>>({
    refineCoreProps: {
      resource: "categories",
      id: props.action === "edit" ? category?.id : undefined,
      redirect: false,
      onMutationSuccess: () => {
        onClose();
      },
    },
    defaultValues: {
      id: category?.id ?? "",
      title: category?.title ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  const onClose = () => {
    list("categories");
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onFinish)}>
        <DialogTitle>
          {props.action === "edit" ? t("categories.actions.edit") : t("categories.actions.create")}
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
                name="title"
                defaultValue=""
                rules={{ required: t("errors.required.field", { field: "title" }) }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("categories.fields.title")}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>{t("categories.fields.isActive.label")}</FormLabel>
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
                      {t("categories.fields.isActive.true")}
                    </ToggleButton>
                    <ToggleButton value={false}>
                      {t("categories.fields.isActive.false")}
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
