import { useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { removeItem } from '../store/cartSlice';
import { fetchProducts } from '../store/productsSlice';
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
    const {products, fetched} = useSelector((state: RootState) => state.products);

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
            if (!product) return null;
            const characteristicMap: { [key: number]: string } = {};
            const OptionsMap: { [key: number]: string } = {};
            for (const characteristics of product.characteristics || []) {
                characteristicMap[characteristics.id] = characteristics.name;
                for (const options of characteristics.options || []) {
                    OptionsMap[options.id] = options.value;
                }
            }
            return(
                <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
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
                        onClick={() => dispatch(removeItem(index))}
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
                return total + Number((product ? product.basePrice : 0));
                }, 0)
            }
        </Typography>
      </Box>
      <Button variant="outlined" href="/" LinkComponent={Link}>Home</Button>
    </Box>
  );
};
