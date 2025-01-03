import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';
import { RootState, AppDispatch } from '../store';
import { Container } from '@mui/material';
import ProductList from "../components/ProductList";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const {products, loading, fetched, error} = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (!fetched){
            dispatch(fetchProducts());
        }
    }, [dispatch]);
    
    if (loading) return 'Loading...'
    
    if (error) return 'An error has occurred: ' + error;

    return (
        <Container>
          <ProductList products={products} buttonProps={{label: "View Details", link:"/products/"}}/>
        </Container>
    );
}
