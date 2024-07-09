import React, { useState, useMemo, useEffect, PropsWithChildren } from "react";
import {
  useGo,
  useNavigation,
  useTranslate,
  useList,
  HttpError,
  useUpdate,
} from "@refinedev/core";
import { CreateButton, NumberField, UseDataGridReturnType } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import {
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  Stack,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import { ProductStatus, RefineListView } from "../../components";
import { ICategory, IProduct } from "../../interfaces";

type View = "table" | "card";

export const ProductList = ({ children }: PropsWithChildren) => {
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("product-view") as View;
    return view || "table";
  });

  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl, editUrl } = useNavigation();
  const t = useTranslate();

  const { data: categoriesData } = useList<ICategory>({ resource: "categories" });
  const categories = categoriesData?.data || [];

  const { data: productListData } = useList<IProduct, HttpError>({ resource: "products" });
  const products = productListData?.data || [];

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "ALL") {
      return products;
    }
    return products.filter((product) => product.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleViewChange = (_e: React.MouseEvent<HTMLElement>, newView: View) => {
    replace("");
    setView(newView);
    localStorage.setItem("product-view", newView);
  };

  const columns = useMemo<GridColDef<IProduct>[]>(
    () => [
      {
        field: "name",
        headerName: t("products.fields.name"),
        flex: 1,
        renderCell: ({ row }) => (
          <Typography>
            {row.name} - {categories.find((category) => category.id === row.categoryId)?.title}
          </Typography>
        ),
      },
      {
        field: "price",
        headerName: t("products.fields.price"),
        flex: 1,
        align: "right",
        headerAlign: "right",
        renderCell: ({ row }) => (
          <NumberField
            value={row.price}
            options={{ currency: "EUR", style: "currency" }}
          />
        ),
      },
      {
        field: "isActive",
        headerName: t("products.fields.isActive.label"),
        align: "right",
        flex: 1,
        renderCell: ({ row }) => <ProductStatus value={row.isActive} />,
      },
    ],
    [t, categories]
  );

  return (
    <RefineListView
      headerButtons={(props) => [
        <ToggleButtonGroup
          key="view-toggle"
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
        >
          <ToggleButton value="table" aria-label="table view" size="small">
            <ListOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="card" aria-label="card view" size="small">
            <BorderAllOutlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="medium"
          sx={{ height: "40px" }}
          onClick={() => {
            go({
              to: createUrl("products"),
              query: { to: pathname },
              options: { keepQuery: true },
              type: "replace",
            });
          }}
        >
          {t("products.actions.add")}
        </CreateButton>,
      ]}
    >
      <Stack direction="row" spacing="12px" py="16px" flexWrap="wrap">
        <Select
          value={selectedCategory}
          onChange={handleCategoryFilterChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="ALL">{t("products.filter.allCategories.label")}</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.title}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {view === "table" ? (
        <Paper>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            autoHeight
            hideFooter
            onRowClick={({ id }) => {
              go({
                to: editUrl("products", id),
                query: { to: pathname },
                options: { keepQuery: true },
                type: "replace",
              });
            }}
            sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  "&:hover .edit-button": { display: "flex" },
                }}
              >
                <CardActionArea
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                  onClick={() => {
                    go({
                      to: editUrl("products", product.id),
                      query: { to: pathname },
                      options: { keepQuery: true },
                      type: "replace",
                    });
                  }}
                >
                  <Box sx={{ position: "relative", width: "100%" }}>
                    {product.images && product.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="160"
                        image={product.images[0]?.url}
                        alt={product.name}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                    <Stack mb="8px" direction="row" justifyContent="space-between">
                      <Typography variant="body1" fontWeight={500}>
                        {product.name}
                      </Typography>
                      <NumberField
                        variant="body1"
                        fontWeight={500}
                        value={product.price}
                        options={{ style: "currency", currency: "EUR" }}
                      />
                    </Stack>
                    <Typography color="text.secondary">{product.description}</Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      marginTop: "auto",
                      borderTop: "1px solid",
                      borderColor: (theme) => theme.palette.divider,
                      width: "100%",
                    }}
                  >
                    <ProductStatus size="small" value={product.isActive} />
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {children}
    </RefineListView>
  );
};
