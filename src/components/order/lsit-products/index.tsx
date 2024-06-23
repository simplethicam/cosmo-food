import React from 'react';
import { IOrder, IProduct } from '../../../interfaces';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

type OrderProductsProps = {
  order: IOrder | undefined;
};

export const OrderProducts: React.FC<OrderProductsProps> = ({ order }) => {
  if (!order) return null;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product Name</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Total Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {order.products.map((product: IProduct & { quantity: number }) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>{(product.price * product.quantity).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
