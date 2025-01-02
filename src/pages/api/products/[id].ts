import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Status } from "../types"

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  switch (req.method) {
    case "GET":
      try {
        const product = await prisma.product.findUnique({
          where: { id: Number(id) },
          include: {
            characteristics: {
              include: {
                options: true,
              },
            },
            rules: true,
          },
        });
    
        if (!product) {
          return res.status(404).json({ status: Status.Fail, message: 'Product not found' });
        }
    
        return res.status(200).json({
          status : Status.Success,
          data: { product },
      });
      } catch (error) {
        console.error('Error fetching product by ID:', error);
        return res.status(500).json({ status: Status.Error, message: 'Internal Server Error' });
      }
    case "DELETE":
      try {
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        const deletedProduct = await prisma.product.delete({
          where: {
            id: parseInt(id as string),
          },
        });
  
        return res.status(200).json(deletedProduct);
      } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
      }
    default: 
      return res.status(405).json({ 
        status: Status.Fail, 
        message: 'Method Not Allowed' 
      });
  }
}
