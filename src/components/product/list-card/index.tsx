import { useState, useMemo } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { NumberField, UseDataGridReturnType } from "@refinedev/mui";
import Typography from "@mui/material/Typography";
import { ICategory, IProduct } from "../../../interfaces";
import { useLocation } from "react-router-dom";
import { ProductStatus } from "../status";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";

type Props = {
  categories: ICategory[];
} & UseDataGridReturnType<IProduct>;

export const ProductListCard = (props: Props) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const products = props.tableQueryResult?.data?.data || [];

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === "ALL") {
      return products;
    }
    return products.filter((product) => product.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

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
      <Grid container spacing={3}>
        {filteredProducts.map((product) => {
          return (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  "&:hover .edit-button": {
                    display: "flex",
                  },
                }}
              >
                <CardActionArea
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => {
                    go({
                      to: `${editUrl("products", product.id)}`,
                      query: {
                        to: pathname,
                      },
                      options: {
                        keepQuery: true,
                      },
                      type: "replace",
                    });
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                    }}
                  >
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
                        options={{
                          style: "currency",
                          currency: "EUR",
                        }}
                      />
                    </Stack>
                    <Typography color="text.secondary">
                      {product.description}
                    </Typography>
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
          );
        })}
      </Grid>
      <Divider
        sx={{
          marginTop: "24px",
        }}
      />
    </>
  );
};
