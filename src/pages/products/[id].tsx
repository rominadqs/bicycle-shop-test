import { useState } from 'react';
import { useRouter } from "next/router";
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';
import Link from 'next/link';
import { Characteristic, Rule } from '../../types';

import {
    Box,
    Button,
    Stack,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
  } from "@mui/material";

export default function ProductDetails() {
    const router = useRouter();
    const { id } = router.query;

    const [selectedOptions, setSelectedOptions] = useState<Record<number, number | null>>({});
    const [validationError, setValidationError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const { isPending, error, data: product } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
          const rawResponse = await fetch(
            `/api/products/${id}`,
          )
          const response = await rawResponse.json();
          return response.data.product;
        },
        enabled: !!id,
      })
    
    if (isPending) return 'Loading...'
    
    if (error) return 'An error has occurred: ' + error.message

    const handleOptionChange = (characteristicId: number, optionId: number | null) => {
        setSelectedOptions((prev) => ({
          ...prev,
          [characteristicId]: optionId,
        }));
    };

    const isOptionDisabled = (rules: Rule[], characteristicId: number, optionId: number): boolean => {
        const conflictingRules = rules.filter(
          (rule) => (
            rule.restrictedCharacteristicId === characteristicId &&
            rule.restrictedOptionId === optionId &&
            selectedOptions[rule.dependsOnCharacteristicId] === rule.dependsOnOptionId
          )
        );
        return conflictingRules.length > 0;
    };

    const areAllCharacteristicsSelected = () => {
        return product.characteristics.every(
          (characteristic: Characteristic) => selectedOptions[characteristic.id]
        );
      };
    
    const validateSelection = () => {
        const rules = product.rules;

        for (const rule of rules) {
          const restrictedCharacteristic = rule.restrictedCharacteristicId;
          const restrictedOption = rule.restrictedOptionId;
          const dependsOnCharacteristic = rule.dependsOnCharacteristicId;
          const dependsOnOption = rule.dependsOnOptionId;
    
          if (
            selectedOptions[dependsOnCharacteristic] === dependsOnOption &&
            selectedOptions[restrictedCharacteristic] === restrictedOption
          ) {
            setValidationError("Check your selection; one or more options are not valid.");
            return false;
          }
        }
        setValidationError(null);
        return true;
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                {product.name}
            </Typography>
            <Typography variant="body1">
                {product.description}
            </Typography>
            <Typography variant="h6">
                Base Price: ${product.basePrice}
            </Typography>
            {product.characteristics.map((characteristic: Characteristic) => (
                <FormControl fullWidth margin="normal" key={characteristic.id}>
                    <InputLabel>{characteristic.name}</InputLabel>
                    <Select
                        value={selectedOptions[characteristic.id] || ''}
                        onChange={(e) => handleOptionChange(characteristic.id, Number(e.target.value) || null)}
                    >
                    {characteristic.options.map((option) => (
                        <MenuItem 
                            key={option.id} 
                            value={option.id}
                            disabled={
                                !option.isInStock || isOptionDisabled(product.rules, characteristic.id, option.id)
                            }
                        >
                            {option.value} {option.isInStock ? '' : '(Out of Stock)'}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            ))}
            {validationError && (
                <Typography color="error">
                    {validationError}
                </Typography>
            )}
            <Stack spacing={2} direction="row">
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!areAllCharacteristicsSelected()}
                    onClick={() => {
                        if (validateSelection()) {
                            dispatch(addItem({ productId: product.id, selectedOptions }));
                            setValidationError(null);
                        }
                    }}
                >
                    Add to Cart
                </Button>
                <Button variant="outlined" href="/cart" LinkComponent={Link}>Go to Cart</Button>
            </Stack>
        </Box>
    );
}
