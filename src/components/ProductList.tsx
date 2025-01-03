import  React from "react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { Grid2 as Grid, Box, Typography } from "@mui/material";

interface ProductListProps {
  products: Product[];
  buttonProps: {
    label: string;
    action?: (id: number) => void; 
    link?: string;
  };
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  buttonProps,
}) => {
  if (products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">No products available.</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid size={{ xs:12, sm: 6, md:4 }} key={product.id}>
            <ProductCard
              id={product.id}
              name={product.name}
              description={product.description}
              basePrice={product.basePrice}
              category={product.category}
              buttonProps={buttonProps}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
