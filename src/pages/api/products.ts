import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/db";
import { Status, Characteristic } from "./types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            const products = await prisma.product.findMany({
                include: {
                    characteristics: {
                        include: {
                            options: true,
                        },
                    },
                },
            });
            res.status(200).json({
                status : Status.Success,
                data: { products },
            });
            break;
        case "POST":
            try {
                console.log(req.body);
                const { name, description, basePrice, category, characteristics, rules } = req.body;
                console.log(characteristics);
                const product = await prisma.product.create({
                    data: {
                        name,
                        description,
                        basePrice: parseFloat(basePrice),
                        category,
                        characteristics: {
                            create: characteristics.map((char: any) => ({
                                name: char.name,
                                options: {
                                    create: char.options.map((opt: any) => ({
                                        value: opt,
                                        isInStock: true,
                                    })),
                                },
                            })),
                        },    
                    },
                    include: {
                        characteristics: {
                            include: {
                                options: true
                            },
                        },
                    },
                });
                
                const characteristicMap: { [key: string]: Characteristic } = {};
                for (const characteristics of product.characteristics || []) {
                    characteristicMap[characteristics.name.toLowerCase()] = characteristics;
                }
                
                if (rules) {
                    for (const rule of rules) {
                        const restrictedCharacteristic = characteristicMap[rule.restrictedCharacteristic];
                        const dependsOnCharacteristic = characteristicMap[rule.dependsOnCharacteristic];

                        if (restrictedCharacteristic && dependsOnCharacteristic) {
                            const restrictedOption = restrictedCharacteristic.options.find(
                                (opt) => opt.value === rule.restrictedOption.toLowerCase()
                            );
                            const dependsOnOption = dependsOnCharacteristic.options.find(
                                (opt) => opt.value === rule.dependsOnOption.toLowerCase()
                            );
        
                            if (restrictedOption && dependsOnOption) {
                                await prisma.productRule.create({
                                    data: {
                                    productId: product.id,
                                    restrictedCharacteristicId: restrictedCharacteristic.id,
                                    restrictedOptionId: restrictedOption.id,
                                    dependsOnCharacteristicId: dependsOnCharacteristic.id,
                                    dependsOnOptionId: dependsOnOption.id,
                                    },
                                });
                            }
                        }
                    }
                }

                return res.status(201).json(product);
            } catch (error) {
                console.error('****Error creating product:', error);
                return res.status(500).json({ status: Status.Error, message: 'Internal Server Error' });
            }
        default:
            return res.status(405).json({ 
                status: Status.Fail, 
                message: 'Method Not Allowed' 
            });    
    }
}
