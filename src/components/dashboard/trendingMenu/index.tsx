import { useList } from "@refinedev/core";
import { NumberField } from "@refinedev/mui";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { IOrder, IProduct } from "../../../interfaces";
import { Rank1Icon } from "../../icons/rank-1";
import { Rank2Icon } from "../../icons/rank-2";
import { Rank3Icon } from "../../icons/rank-3";
import { Rank4Icon } from "../../icons/rank-4";
import { Rank5Icon } from "../../icons/rank-5";
import { ReactNode, useMemo } from "react";

interface ProductOrderCount {
  product: IProduct;
  orderCount: number;
}

export const TrendingMenu: React.FC = () => {
  const { data: ordersData } = useList<IOrder>({
    resource: "orders",
  });

  const orders = ordersData?.data || [];

  const trendingProducts = useMemo(() => {
    const productCountMap: { [key: string]: ProductOrderCount } = {};

    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (productCountMap[product.id]) {
          productCountMap[product.id].orderCount += product.quantity;
        } else {
          productCountMap[product.id] = {
            product: product,
            orderCount: product.quantity,
          };
        }
      });
    });

    return Object.values(productCountMap)
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);
  }, [orders]);

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {trendingProducts.map((item, index) => (
        <Stack
          key={item.product.id}
          direction="row"
          alignItems="center"
          spacing={3}
          paddingY={1}
        >
          {item.product.images != null && 
          <Box sx={{ position: "relative" }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
              }}
              src={item.product.images[0]?.url}
            />
            <Box
              sx={{
                position: "absolute",
                top: -16,
                right: -16,
              }}
            >
              {RankIcons[index + 1]}
            </Box>
          </Box>
          }
          <Stack spacing={"4px"}>
            <Typography variant="h6">{item.product.name}</Typography>
            <NumberField
              color="text.secondary"
              options={{
                currency: "EUR",
                style: "currency",
                notation: "standard",
              }}
              value={item.orderCount * item.product.price}
            />
            <Typography color="text.secondary" whiteSpace="nowrap">
              Ordered
              <Typography
                component="span"
                color="text.primary"
                whiteSpace="nowrap"
              >
                {" "}
                {item.orderCount}{" "}
              </Typography>
              times
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

const RankIcons: Record<number, ReactNode> = {
  1: <Rank1Icon />,
  2: <Rank2Icon />,
  3: <Rank3Icon />,
  4: <Rank4Icon />,
  5: <Rank5Icon />,
};
