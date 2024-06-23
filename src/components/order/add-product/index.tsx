import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IProduct } from "../../../interfaces";
import { useTranslate } from "@refinedev/core"
import { getUniqueListWithCount } from "../../../utils";

type Props = {
  products: IProduct[];
};

export const AddProduct = ({ products }: Props) => {
  const t = useTranslate();

  const uniqueProducts = getUniqueListWithCount({
    list: products,
    field: "id",
  });

  return (
    <Box>
      <List>
        {uniqueProducts.map((product) => (
          <ListItem key={product.id} divider>
            {product.images != null && 
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={product.images[0]?.thumbnailUrl || product.images[0]?.url}
                  alt={product.name}
                  sx={{ width: 32, height: 32 }}
                />
              </ListItemAvatar>
            }
            <ListItemText
              primary={product.name}
              primaryTypographyProps={{ flex: 1, textAlign: 'left' }}
            />
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <IconButton color="success" disabled={!product.isActive}>
                <AddIcon />
              </IconButton>
              <Typography sx={{ mx: 2, textAlign: 'center', fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                {product.count}
              </Typography>
              <IconButton color="error" disabled={!product.isActive}>
                <RemoveIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
