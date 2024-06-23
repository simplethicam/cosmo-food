import React, { PropsWithChildren, useMemo, useState } from "react";
import { HttpError, useList, useTranslate, useNavigation, useGo } from "@refinedev/core";
import { useDataGrid, CreateButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  RefineListView,
  CategoryStatus,
  CustomTooltip,
} from "../../components";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import { ICategory, IProduct } from "../../interfaces";
import { Card, CardActionArea, CardActions, CardContent, Grid, Stack, Typography, IconButton, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";

type View = "table" | "card";

export const CategoryList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const t = useTranslate();
  const { editUrl } = useNavigation();
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem("category-view") as View;
    return view || "table";
  });

  const { dataGridProps } = useDataGrid<ICategory, HttpError>({
    resource: "categories"
  });

  const { data: productsData, isLoading: productsIsLoading } = useList<
    IProduct,
    HttpError
  >({
    resource: "products"
  });
  const products = productsData?.data || [];

  const columns = useMemo<GridColDef<ICategory>[]>(
    () => [
      {
        field: "title",
        headerName: t("categories.fields.title"),
        width: 232,
      },
      {
        field: "product",
        headerName: t("categories.fields.products"),
        flex: 1,
        renderCell: function render({ row }) {
          const categoryProducts = products.filter(
            (product) => product.categoryId === row.id,
          );
          return (
            <Box display="flex" alignItems="center" gap="8px" flexWrap="wrap">
              {productsIsLoading &&
                Array.from({ length: 10 }).map((_, index) => {
                  return (
                    <Skeleton
                      key={index}
                      sx={{
                        width: "32px",
                        height: "32px",
                      }}
                      variant="rectangular"
                    />
                  );
                })}

              {!productsIsLoading &&
                categoryProducts.map((product) => {
                  const image = product.images?.[0];
                  const thumbnailUrl = image?.thumbnailUrl || image?.url;
                  return (
                    <CustomTooltip key={product.id} title={product.name}>
                      <Avatar
                        sx={{
                          width: "32px",
                          height: "32px",
                        }}
                        variant="rounded"
                        alt={product.name}
                        src={thumbnailUrl}
                      />
                    </CustomTooltip>
                  );
                })}
            </Box>
          );
        },
      },
      {
        field: "isActive",
        headerName: t("categories.fields.isActive.label"),
        width: 116,
        renderCell: function render({ row }) {
          return <CategoryStatus value={row.isActive} />;
        },
      },
    ],
    [t, go, products, productsIsLoading, editUrl],
  );

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View,
  ) => {
    setView(newView);
    localStorage.setItem("category-view", newView);
  };

  return (
    <>
    <RefineListView
      breadcrumb={false}
      headerButtons={() => [
        <CreateButton resourceNameOrRouteName="categories" />,
        <ToggleButtonGroup
          key="view-toggle"
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
        >
          <ToggleButton value="card" aria-label="card view" size="small">
            <BorderAllOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view" size="small">
            <ListOutlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>,
      ]}
    >
      {view === "table" ? (
        <Paper>
          <DataGrid
            {...dataGridProps}
            columns={columns}
            autoHeight
            hideFooter
            onRowClick={({ id }) => {
              return go({
                to: `${editUrl("categories", id)}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        </Paper>
      ) : (
        <>
        <Divider
          sx={{
            marginBottom: "24px",
          }}
        />
        <Grid
          container
          spacing={3}
        >
          {dataGridProps.rows?.map((category: ICategory) => (
            <Grid key={category.id} item xs={12} sm={6} md={4} lg={3}>
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
                      to: `${editUrl("categories", category.id)}`,
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
                  <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                    <Stack
                      mb="8px"
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {category.title}
                      </Typography>
                    </Stack>
                    <Box display="flex" alignItems="center" gap="8px" flexWrap="wrap">
                      {productsIsLoading &&
                        Array.from({ length: 10 }).map((_, index) => {
                          return (
                            <Skeleton
                              key={index}
                              sx={{
                                width: "32px",
                                height: "32px",
                              }}
                              variant="rectangular"
                            />
                          );
                        })}

                      {!productsIsLoading &&
                        products.filter(product => product.categoryId === category.id).map((product) => {
                          const image = product.images?.[0];
                          const thumbnailUrl = image?.thumbnailUrl || image?.url;
                          return (
                            <CustomTooltip key={product.id} title={product.name}>
                              <Avatar
                                sx={{
                                  width: "32px",
                                  height: "32px",
                                }}
                                variant="rounded"
                                alt={product.name}
                                src={thumbnailUrl}
                              />
                            </CustomTooltip>
                          );
                        })}
                    </Box>
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
                    <CategoryStatus size="small" value={category.isActive} />
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
          <Divider
            sx={{
              marginTop: "24px",
            }}
          />
        </>
      )}
    </RefineListView>
    {children}
    </>
  );
};