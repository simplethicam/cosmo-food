import React from 'react';
import { IOrder, IProduct } from '../../../interfaces';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslate } from '@refinedev/core';

type OrderProductsProps = {
  order: IOrder | undefined;
};

export const OrderProducts: React.FC<OrderProductsProps> = ({ order }) => {
  const t = useTranslate();
  if (!order) return null;

  return (
    <Table>
      <TableHead>
        <TableRow> 
          <TableCell>{t("orders.fields.productName")}</TableCell>
          <TableCell>{t("orders.fields.quantity")}</TableCell>
          <TableCell>{t("orders.fields.price")}</TableCell>
          <TableCell>{t("orders.fields.totalPrice")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {order.products.map((product: IProduct & { quantity: number }) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>€{(product.price * product.quantity).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
