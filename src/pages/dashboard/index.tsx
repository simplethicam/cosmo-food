import React, { useMemo } from "react";
import { HttpError, useList, useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import { NumberField } from "@refinedev/mui";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  DailyOrders,
  DailyRevenue,
  NewCustomers,
  RecentOrders,
  TrendingMenu,
} from "../../components/dashboard";
import { TrendIcon } from "../../components/icons";
import { Card, RefineListView } from "../../components";
import { IOrder } from "../../interfaces";

export const DashboardPage: React.FC = () => {
  const t = useTranslate();

  const { data, isLoading } = useList<IOrder, HttpError>({
    resource: "orders",
  });

  const orders = data?.data || [];

  const dailyRevenue = useMemo(() => {
    const revenueMap: { [date: string]: number } = {};
    const trendMap: { [date: string]: number } = {};

    orders.forEach((order) => {
      if (order.createdBy?.createdBy?.date) {
        const date = dayjs(order.createdBy.createdBy.date).format("YYYY-MM-DD");
        if (!revenueMap[date]) {
          revenueMap[date] = 0;
          trendMap[date] = 0;
        }
        revenueMap[date] += order.amount;
        trendMap[date] += 1;
      }
    });

    const newData = Object.keys(revenueMap).map((date) => ({
      date,
      title: "Order Amount" as const,
      value: revenueMap[date],
    }));

    const total = newData.reduce((sum, item) => sum + item.value, 0);
    const trend = Object.values(trendMap).reduce((sum, item) => sum + item, 0);

    return { data: newData, total, trend };
  }, [orders]);

  const dailyOrders = useMemo(() => {
    const orderMap: { [date: string]: number } = {};
    const trendMap: { [date: string]: number } = {};

    orders.forEach((order) => {
      if (order.createdBy?.createdBy?.date) {
        const date = dayjs(order.createdBy.createdBy.date).format("YYYY-MM-DD");
        if (!orderMap[date]) {
          orderMap[date] = 0;
          trendMap[date] = 0;
        }
        orderMap[date] += 1;
        trendMap[date] += 1;
      }
    });

    const data = Object.keys(orderMap).map((date) => ({
      date,
      title: "Order Count" as const,
      value: orderMap[date],
    }));

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const trend = Object.values(trendMap).reduce((sum, item) => sum + item, 0);

    return { data, total, trend };
  }, [orders]);

  const newCustomers = useMemo(() => {
    const customerMap: { [date: string]: number } = {};
    const trendMap: { [date: string]: number } = {};

    orders.forEach((order) => {
      if (order.createdBy?.createdBy?.date) {
        const date = dayjs(order.createdBy.createdBy.date).format("YYYY-MM-DD");
        if (!customerMap[date]) {
          customerMap[date] = 0;
          trendMap[date] = 0;
        }
        customerMap[date] += 1;
        trendMap[date] += 1;
      }
    });

    const data = Object.keys(customerMap).map((date) => ({
      date,
      title: "New Customers" as const,
      value: customerMap[date],
    }));

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const trend = Object.values(trendMap).reduce((sum, item) => sum + item, 0);

    return { data, total, trend };
  }, [orders]);

  return (
    <RefineListView>
      <Grid container columns={24} spacing={3}>
        <Grid
          item
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={10}
          sx={{
            height: "264px",
          }}
        >
          <Card
            title={t("dashboard.dailyRevenue.title")}
            icon={<MonetizationOnOutlinedIcon />}
            sx={{
              ".MuiCardContent-root:last-child": {
                paddingBottom: "24px",
              },
            }}
            cardContentProps={{
              sx: {
                height: "208px",
              },
            }}
            cardHeaderProps={{
              action: (
                <TrendIcon
                  trend={dailyRevenue.trend}
                  text={
                    <NumberField
                      value={dailyRevenue.trend || 0}
                      options={{
                        style: "currency",
                        currency: "EUR",
                      }}
                    />
                  }
                />
              ),
            }}
          >
            <DailyRevenue data={dailyRevenue.data} />
          </Card>
        </Grid>
        <Grid
          item
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={7}
          sx={{
            height: "264px",
          }}
        >
          <Card
            title={t("dashboard.dailyOrders.title")}
            icon={<ShoppingBagOutlinedIcon />}
            sx={{
              ".MuiCardContent-root:last-child": {
                paddingBottom: "24px",
              },
            }}
            cardContentProps={{
              sx: {
                height: "208px",
              },
            }}
            cardHeaderProps={{
              action: (
                <TrendIcon
                  trend={dailyOrders.trend}
                  text={<NumberField value={dailyOrders.trend || 0} />}
                />
              ),
            }}
          >
            <DailyOrders data={dailyOrders.data} />
          </Card>
        </Grid>
        <Grid
          item
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={7}
          sx={{
            height: "264px",
          }}
        >
          <Card
            title={t("dashboard.newCustomers.title")}
            icon={<AccountCircleOutlinedIcon />}
            sx={{
              ".MuiCardContent-root:last-child": {
                paddingBottom: "24px",
              },
            }}
            cardContentProps={{
              sx: {
                height: "208px",
              },
            }}
            cardHeaderProps={{
              action: (
                <TrendIcon
                  trend={newCustomers.trend}
                  text={<NumberField value={newCustomers.trend || 0} />}
                />
              ),
            }}
          >
            <NewCustomers data={newCustomers.data} />
          </Card>
        </Grid>
        <Grid
          item
          xs={24}
          sm={24}
          md={24}
          lg={15}
          xl={15}
          sx={{
            height: "800px",
          }}
        >
          <Card
            icon={<ShoppingBagOutlinedIcon />}
            title={t("dashboard.recentOrders.title")}
            cardContentProps={{
              sx: {
                height: "688px",
              },
            }}
          >
            <RecentOrders />
          </Card>
        </Grid>
        <Grid
          item
          xs={24}
          sm={24}
          md={24}
          lg={9}
          xl={9}
          sx={{
            height: "max-content",
          }}
        >
          <Card
            icon={<TrendingUpIcon />}
            title={t("dashboard.trendingProducts.title")}
          >
            <TrendingMenu />
          </Card>
        </Grid>
      </Grid>
    </RefineListView>
  );
};
