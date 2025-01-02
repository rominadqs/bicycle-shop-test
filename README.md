# Bicycle Shop

This application was made with Next.JS (Front-end and Back-end) and allows Marcus, a bicycle shop owner, to sell his bicycles. Users can navigate through the product catalog, view the product details, and add a customized bike to the shopping cart. 

## Functional Description
Users can:
- See the full product catalog.
- Check the product details.
- Add to the shopping cart a product with their own unique options. 
- See what's on their Shopping Cart.

Marcus Can:
- Add products: Configure characteristics, options and rules for each product (e.g., rim colors, wheel types).
- Delete bicycles from the catalog.

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Requirements
- Node.js
- Docker

### Local Development

First, run the database 
```bash
docker-compose up
```
Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To check the private section go to [products/admin](http://localhost:3000/products/admin)
