import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { removeItem } from '../store/cartSlice';
import { fetchProducts, ProductCharacteristic } from '../store/productsSlice';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
  } from "@mui/material";

export default function CartPage() {
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const {products, loading, fetched, error} = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (!fetched){
            dispatch(fetchProducts());
        }
    }, [dispatch]);

    const getProductDetails = (productId: number) => {
        return products.find((product) => product.id === productId);
      };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        My Cart
      </Typography>
      <List>
        {cartItems.map((item, index) => {
            const product = getProductDetails(item.productId);
            console.log("product", product);
            if (!product) return null;
            const characteristicMap: { [key: number]: string } = {};
            const OptionsMap: { [key: number]: string } = {};
            for (const characteristics of product.characteristics || []) {
                characteristicMap[characteristics.id] = characteristics.name;
                for (const options of characteristics.options || []) {
                    OptionsMap[options.id] = options.value;
                }
            }
            console.log("characteristicMap", characteristicMap);
            return(
                <Card key={item.productId} variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Base Price: ${product.basePrice}
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="subtitle1">Selected Options:</Typography>
                        <List disablePadding>
                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <ListItem key={key} disableGutters>
                            <ListItemText primary={`${characteristicMap[Number(key)]}: ${OptionsMap[Number(value)]}`} />
                            </ListItem>
                        ))}
                        </List>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => dispatch(removeItem(item.productId))}
                        >
                        Remove
                        </Button>
                    </Box>
                    </CardContent>
                </Card>
            );
        })}
      </List>
      <Divider sx={{ marginY: 2 }} />
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="h6" sx={{ marginRight: 2 }}>
          Total: $
          {
            cartItems
                .reduce((total, item) => {
                const product = getProductDetails(item.productId);
                return total + (product ? product.basePrice : 0);
                }, 0)
            }
        </Typography>
      </Box>
    </Box>
  );
};
