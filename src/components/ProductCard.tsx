import  React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  buttonProps: {
    label: string;
    action?: (id: number) => void; 
    link?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  basePrice,
  category,
  buttonProps,
}) => (
    <Card>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">{description}</Typography>
        <Typography variant="body2">Price: ${basePrice}</Typography>
        <Typography variant="body2">Category: ${category}</Typography>
        {buttonProps.link ? (
            <Button variant="contained" color="primary" sx={{ mt: 2 }} href={`${buttonProps.link}${id}`} LinkComponent={Link}>
                {buttonProps.label}
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => buttonProps.action && buttonProps.action(id)}
            >
              {buttonProps.label}
            </Button>
          )}
      </CardContent>
    </Card>
);

export default ProductCard;
