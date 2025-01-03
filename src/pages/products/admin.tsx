import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  fetchProducts,
  addProduct,
  deleteProduct,
} from "../../store/productsSlice";
import { AppDispatch } from "../../store";
import ProductList from "../../components/ProductList";
import { Alert, Container, TextField, Button, Grid2 as Grid, Box, Typography } from '@mui/material';

interface Status {
  severity: 'success' | 'error' | 'warning' | 'info';
  message: string;
  open: boolean;
}

export default function Admin() {
  const dispatch = useDispatch<AppDispatch>(); 
  const {products, loading, fetched, error} = useSelector((state: RootState) => state.products);
  const [status, setStatus] = useState<Status>({severity: 'success', message: '', open: false});

  useEffect(() => {
    if (!fetched){
        dispatch(fetchProducts());
    }
  }, [dispatch]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    category: "",
    characteristics: [] as { name: string; options: string[] }[],
    rules: [] as {
      restrictedCharacteristic: string;
      restrictedOption: string;
      dependsOnCharacteristic: string;
      dependsOnOption: string;
    }[],
  });

  const handleAddCharacteristic = () => {
    setNewProduct((prev) => ({
      ...prev,
      characteristics: [
        ...prev.characteristics,
        { name: "", options: [""] },
      ],
    }));
  };
  const handleAddRule = () => {
    setNewProduct((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        { 
          restrictedCharacteristic: "", 
          restrictedOption: "",
          dependsOnCharacteristic:"",
          dependsOnOption: "",
        },
      ],
    }));
  };

  const handleCharacteristicChange = (index: number, field: string, value: string) => {
    const updatedCharacteristics = [...newProduct.characteristics];
    if (field === "name") {
      updatedCharacteristics[index].name = value;
    } else {
      updatedCharacteristics[index].options = value.split(",");
    }
    setNewProduct((prev) => ({
      ...prev,
      characteristics: updatedCharacteristics,
    }));
  };

  const handleRuleChange = (index: number, field: string, value: string) => {
    const updatedRules = [...newProduct.rules];
    switch(field){
      case 'restrictedCharacteristic':
        updatedRules[index].restrictedCharacteristic = value;
        break;
      case 'restrictedOption':
        updatedRules[index].restrictedOption = value;
        break;
      case 'dependsOnCharacteristic':
        updatedRules[index].dependsOnCharacteristic = value;
        break;
      case 'dependsOnOption':
        updatedRules[index].dependsOnOption = value;
        break;
    }
    
    setNewProduct((prev) => ({
      ...prev,
      rules: updatedRules,
    }));
  };

  const handleAddProduct = async () => {
    try {
      setStatus({severity: 'success', message: '', open: false});
      await dispatch(
        addProduct({
          ...newProduct,
          basePrice: parseFloat(newProduct.basePrice),
        })
      ).unwrap();
      setNewProduct({
        name: "",
        description: "",
        basePrice: "",
        category: "",
        characteristics: [],
        rules:[],
      });
      setStatus({severity: 'success', message: 'Product added successfully', open: true});
    } catch (error) {
      setStatus({severity: 'error', message: `Error adding product: ${error}`, open: true});
    }
  };

  const handleDeleteProduct = (id: number) => {
    dispatch(deleteProduct(id));
  };

  if (loading) return 'Loading...'
    
  if (error) return (<Alert severity="warning">An error has occurred: {error}</Alert>);

  return (
    <Container>
      {status.open && <Alert variant="filled" severity={status.severity}>
          {status.message}
        </Alert>}
      <Box mt={3}>
        <Typography variant="h4" gutterBottom>
          Add New Product
        </Typography>
        <form onSubmit={(e) => {
            e.preventDefault();
            handleAddProduct();
          }}>
          <Grid container spacing={2}>
            <Grid size={{ xs:12, sm:6 }}>
              <TextField
                label="Product Name"
                fullWidth
                name="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Grid>
            <Grid size={{ xs:12, sm:6 }}>
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs:12, sm:6 }}>
              <TextField
                label="Price"
                fullWidth
                type="number"
                name="basePrice"
                value={newProduct.basePrice}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    basePrice: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs:12, sm:6 }}>
              <TextField
                  label="Category"
                  fullWidth
                  name="category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
            </Grid>
            <Grid size={{ xs:12 }}>
              <Typography variant="h6">Characteristics</Typography>
              <Grid container spacing={2}>
                {newProduct.characteristics.map((characteristic, index) => (
                  <>
                    <Grid size={{ xs:12, sm:6 }}>
                      <TextField
                        label={`Characteristic ${index + 1} Name`}
                        fullWidth
                        value={characteristic.name}
                        onChange={(e) => handleCharacteristicChange(index, "name", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs:12, sm:6 }}>
                      <TextField
                        label={`Characteristic ${index + 1} Options, separated by commas`}
                        fullWidth
                        value={characteristic.options.join(",")}
                        onChange={(e) => handleCharacteristicChange(index, "option", e.target.value)}
                      />   
                    </Grid>
                  </>
                ))}
                <Grid size={{ xs:12 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddCharacteristic}
                  >
                    Add Characteristic
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs:12 }}>
              <Typography variant="h6">Product Rules</Typography>
              <Grid container spacing={2}>
                {newProduct.rules.map((rule, index) => (
                  <>
                    <Grid size={{ xs:12, sm:3 }}>
                      <TextField
                        label={`Restricted Characteristic ${index + 1}`}
                        fullWidth
                        value={rule.restrictedCharacteristic}
                        onChange={(e) => handleRuleChange(index, 'restrictedCharacteristic', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs:12, sm:3 }}>
                      <TextField
                        label={`Restricted Option ${index + 1}`}
                        fullWidth
                        value={rule.restrictedOption}
                        onChange={(e) => handleRuleChange(index, 'restrictedOption', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs:12, sm:3 }}>
                      <TextField
                        label={`Depends on Characteristic ${index + 1}`}
                        fullWidth
                        value={rule.dependsOnCharacteristic}
                        onChange={(e) => handleRuleChange(index, 'dependsOnCharacteristic', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs:12, sm:3 }}>
                      <TextField
                        label={`Depends on Option ${index + 1}`}
                        fullWidth
                        value={rule.dependsOnOption}
                        onChange={(e) => handleRuleChange(index, 'dependsOnOption', e.target.value)}
                      />
                    </Grid>
                  </>
                ))}
                <Grid size={{ xs:12 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddRule}
                  >
                    Add Rule
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs:12 }}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Manage Products
        </Typography>
        <ProductList products={products} buttonProps={{label: "Delete", action: handleDeleteProduct}}/>
      </Box>
    </Container>
  );
};
