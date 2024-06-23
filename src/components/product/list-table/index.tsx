import { useState, useMemo } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { NumberField, UseDataGridReturnType } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import { ICategory, IProduct } from "../../../interfaces";
import { useLocation } from "react-router-dom";
import { ProductStatus } from "../status";
import { Select, MenuItem, Stack, Divider, SelectChangeEvent } from "@mui/material";

type Props = {
  categories: ICategory[];
} & UseDataGridReturnType<IProduct>;

export const ProductListTable = (props: Props) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === "ALL") {
      return props.dataGridProps.rows;
    }
    return props.dataGridProps.rows.filter((product) => product.categoryId === selectedCategory);
  }, [props.dataGridProps.rows, selectedCategory]);

  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const columns = useMemo<GridColDef<IProduct>[]>(
    () => [
      {
        field: "name",
        headerName: t("products.fields.name"),
        width: 200,
        sortable: false,
      },
      {
        field: "description",
        headerName: t("products.fields.description"),
        minWidth: 320,
        flex: 1,
        sortable: false,
      },
      {
        field: "price",
        headerName: t("products.fields.price"),
        width: 120,
        sortable: false,
        align: "right",
        headerAlign: "right",
        renderCell: function render({ row }) {
          return (
            <NumberField
              value={row.price}
              options={{
                currency: "EUR",
                style: "currency",
              }}
            />
          );
        },
      },
      {
        field: "category.title",
        headerName: t("products.fields.category"),
        minWidth: 160,
        sortable: false,
        filterable: false,
        renderCell: function render({ row }) {
          const category = props.categories.find(
            (category) => category.id === row.categoryId,
          );

          return <Typography>{category?.title}</Typography>;
        },
      },
      {
        field: "isActive", 
        headerName: t("products.fields.isActive.label"),
        minWidth: 136,
        renderCell: function render({ row }) {
          return <ProductStatus value={row.isActive} />;
        },
      },
    ],
    [t, props.categories, editUrl, go, pathname],
  );

  return (
    <>
      <Divider />
      <Stack direction="row" spacing="12px" py="16px" flexWrap="wrap">
        <Select
          value={selectedCategory}
          onChange={handleCategoryFilterChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="ALL">{t("products.filter.allCategories.label")}</MenuItem>
          {props.categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.title}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Divider
        sx={{
          marginBottom: "24px",
        }}
      />
      <DataGrid
        {...props.dataGridProps}
        rows={filteredProducts}
        columns={columns}
        onRowClick={({ id }) => {
          return go({
            to: `${editUrl("products", id)}`,
            query: {
              to: pathname,
            },
            options: {
              keepQuery: true,
            },
            type: "replace",
          });
        }}
        autoHeight
        hideFooter
      />
      <Divider
        sx={{
          marginTop: "24px",
        }}
      />
    </>
  );
};
