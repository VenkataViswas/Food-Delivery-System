# Food Delivery System - Project Backlog

## Epic 1: User Profile & Role Management
**Description**: Enhance the user account system to support detailed profiles, address management for deliveries, and distinct roles (Customer vs. Admin) for better security and functionality.

### User Story 1: Address Management
**As a** Customer,
**I want to** save and manage my delivery addresses,
**So that** I don't have to enter my address for every order.

### User Story 2: Role-Based Access
**As an** Admin,
**I want to** have exclusive access to menu and order management features,
**So that** regular customers cannot modify the menu or other users' orders.

---

## Epic 2: Order Lifecycle & Tracking
**Description**: Implement a complete lifecycle for orders, allowing status updates (Pending, Preparing, Out for Delivery, Delivered) and giving customers visibility into their order progress.

### User Story 3: Real-Time Order Status
**As a** Customer,
**I want to** see the current status of my active order,
**So that** I know when to expect my food.

### User Story 4: Order Management Dashboard
**As a** Restaurant Manager,
**I want to** view all incoming orders and update their status,
**So that** I can manage the kitchen workflow efficiently.

---

## Epic 3: Advanced Menu Discovery & Feedback
**Description**: Improve how users find food items through search and categorization, and allow them to share feedback through a review system.

### User Story 5: Menu Search & Filtering
**As a** Customer,
**I want to** search for items by name or filter by category (e.g., Burgers, Drinks),
**So that** I can quickly find specific cravings.

### User Story 6: Item Reviews & Ratings
**As a** Customer,
**I want to** leave a text review and star rating for items I've ordered,
**So that** I can share my experience and help others choose.

---

## Technical Subtasks

1.  **[Database]** Update `User` schema in `server/models/users.js` to include `address`, `phone`, and `role` (default: 'customer').
2.  **[API]** Create a `PUT /api/user/profile` endpoint to allow users to update their address and phone number.
3.  **[Frontend]** Create a `Profile.jsx` component with a form for users to view and edit their saved details.
4.  **[Database]** Update `Order` schema in `server/models/cartModel.js` to include a `status` field (enum: ['Pending', 'Preparing', 'Delivered']).
5.  **[API]** Implement `PATCH /api/orders/:id/status` endpoint for Admins to update order status.
6.  **[Frontend]** Create an `AdminOrderDashboard.jsx` component to list all active orders with buttons to change status.
7.  **[Frontend]** Update `OrderHistory` component to display the current `status` badge for each order.
8.  **[Frontend]** Implement a search bar and category filter chips in `Home.jsx` to filter the displayed menu items.
9.  **[Database]** Create a new `Review` model in `server/models/review.js` linking `userId`, `itemId`, `rating`, and `comment`.
10. **[API]** Build `POST /api/reviews` to submit feedback and `GET /api/items/:id/reviews` to fetch them.
