import React, { useState, useEffect } from 'react';
import { useTranslate, useList } from "@refinedev/core";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Autocomplete, TextField, DialogActions, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ICategory, IProduct, IOrder } from "../../interfaces";
import { useAutocomplete } from "@refinedev/mui";

export interface ProductAddProps {
  open: boolean;
  onClose: (selectedProducts: { product: IProduct, quantity: number }[]) => void;
  order?: IOrder; // Add order prop
}

export const ProductAdd: React.FC<ProductAddProps> = ({ open, onClose, order }) => {
  const t = useTranslate();
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});

  const { data: productsData, isLoading: productsLoading } = useList<IProduct>({
    resource: "products",
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useList<ICategory>({
    resource: "categories",
  });

  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: "categories",
  });

  useEffect(() => {
    if (productsData && order) {
      setFilteredProducts(productsData.data);

      // Imposta le quantità iniziali in base ai prodotti dell'ordine
      const initialQuantities = productsData.data.reduce((acc, product) => {
        const orderedProduct = order.products.find(p => p.id === product.id);
        acc[product.id] = orderedProduct ? orderedProduct.quantity : 0;
        return acc;
      }, {} as { [key: string]: number });

      setProductQuantities(initialQuantities);
    }
  }, [productsData, order]);

  useEffect(() => {
    if (selectedCategory && selectedCategory.id !== 'all') {
      const filtered = productsData?.data.filter(product => product.categoryId === selectedCategory.id);
      setFilteredProducts(filtered || []);
    } else {
      setFilteredProducts(productsData?.data || []);
    }
  }, [selectedCategory, productsData]);

  const handleQuantityChange = (productId: string, change: number) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 0) + change, 0),
    }));
  };

  const handleSave = () => {
    const selectedProducts = Object.keys(productQuantities)
      .filter(productId => productQuantities[productId] > 0)
      .map(productId => ({
        product: filteredProducts.find(product => product.id === productId)!,
        quantity: productQuantities[productId],
      }));
    onClose(selectedProducts);
  };

  const handleClose = () => {
    onClose([]);
  };

  if (categoriesLoading || productsLoading) {
    return <CircularProgress />;
  }

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} sx={{ "& .MuiDialog-paper": { maxWidth: "640px", width: "100%" } }}>
      <DialogTitle sx={{ m: 0, p: 2 }}>{t("products.products")}</DialogTitle>
      <IconButton onClick={handleClose} aria-label="close" sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Autocomplete
          {...autocompleteProps}
          value={selectedCategory}
          onChange={(event, newValue: ICategory | null) => {
            setSelectedCategory(newValue);
          }}
          getOptionLabel={(option: ICategory) => option.title}
          options={[{ id: 'all', title: t("All"), isActive: false }, ...(categoriesData?.data || [])]}
          renderInput={(params) => <TextField {...params} label={t("Category")} margin="normal" variant="outlined" />}
        />
        <List>
          {filteredProducts.map(product => (
            <ListItem key={product.id} disablePadding>
              <ListItemText
                primary={product.name}
                secondary={`Price: €${product.price/*.toFixed(2)*/}`}
              />
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => handleQuantityChange(product.id, -1)}
                  disabled={productQuantities[product.id] === 0}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={productQuantities[product.id] || 0}
                  variant="outlined"
                  size="small"
                  inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
                  sx={{ width: 40, mx: 1 }}
                />
                <IconButton
                  onClick={() => handleQuantityChange(product.id, 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" variant="text">
          {t("buttons.cancel")}
        </Button>
        <Button onClick={handleSave} variant="contained">
          {t("buttons.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
