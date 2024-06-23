import Rating from "@mui/material/Rating";
import { IStaff, IReview } from "../../../interfaces";
import { useList } from "@refinedev/core";

type Props = {
  staff?: IStaff;
};

export const StaffRating = (props: Props) => {
  const { data } = useList<IReview>({
    resource: "reviews",
    filters: [
      {
        field: "order.courier.id",
        operator: "eq",
        value: props.staff?.id,
      },
    ],
    pagination: {
      mode: "off",
    },
    queryOptions: {
      enabled: !!props.staff?.id,
    },
  });

  const review = data?.data || [];
  const totalStarCount = review?.reduce(
    (acc, curr) => acc + (curr?.star || 0),
    0,
  );
  const avgStar = totalStarCount / (review?.length || 1);

  return (
    <Rating name="staff-rating" value={avgStar} precision={0.5} readOnly />
  );
};
