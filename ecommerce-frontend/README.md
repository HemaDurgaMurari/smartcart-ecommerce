# SmartCart

SmartCart is a React + TypeScript e-commerce frontend built with Vite. It includes a searchable product catalog, a stock-aware cart, validated checkout, and the existing sign-in, sign-up, and admin screens.

## Run locally

```sh
npm install
npm run dev
```

The frontend expects the SmartCart API at `http://localhost:8080`. The product catalog uses `GET /api/products`; sign-up and sign-in use `POST /api/auth/signup` and `POST /api/auth/signin`. Product creation uses `POST /api/products`. Start the backend before browsing products or using authentication and admin features. API failures are shown in the interface with a retry action where appropriate.

Useful checks:

```sh
npm run lint
npm run build
```

## Shopping flow

- Search by product name and filter the results by category.
- Add available products to the cart. Quantities cannot exceed the stock value returned by the API.
- Increase or decrease quantities, clear the cart, and review item subtotals and the order total.
- Checkout validates name, email, 10-digit phone number, and address with React Hook Form and Zod.
- Submitting checkout currently displays a local order confirmation and clears the cart; payment and order persistence require a backend integration.

## State and data

- TanStack Query loads and caches products. The admin dashboard invalidates the product query after creating a product.
- Zustand manages cart contents and actions.
- `src/store/cartAtoms.ts` is an optional Jotai learning example; the application cart uses Zustand, not both state libraries.
- `src/data/products.ts` retains the sample products from the project guide. The active catalog reads from the API.
