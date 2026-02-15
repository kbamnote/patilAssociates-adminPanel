# Patil Associates Admin Panel

A comprehensive admin dashboard for managing restaurant, hotel, and property operations with billing and order management capabilities.

## Features

### 🍽️ Restaurant Management
- **Restaurant Bookings**: View and manage all restaurant reservations
- **Menu Management**: Create, edit, and organize menu items
- **Table Management**: Manage restaurant tables and seating arrangements
- **Order Creation**: Convert bookings to billable orders with GST calculation
- **Billing System**: Generate professional bills and track payments

### 🏨 Hotel Management
- **Hotel Rooms**: Manage room inventory, pricing, and availability
- **Hotel Bookings**: Handle hotel reservations and guest information
- **Room Types**: Configure different room categories and amenities

### 🏠 Property Management
- **Properties**: Manage property listings for sale or rent
- **Property Listings**: Handle customer inquiries and offers
- **Property Types**: Support for residential, commercial, and other property categories

### 📊 Dashboard & Analytics
- **Statistics Overview**: Real-time metrics for all business operations
- **Revenue Tracking**: Monitor income from different services
- **Booking Analytics**: Track reservation trends and patterns

## Technical Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Authentication**: JWT with js-cookie
- **Icons**: Lucide React
- **UI Components**: Custom component library

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Patil-Associates-Admin-Panel
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=https://api.patilassociates.in/api
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (modals, buttons, etc.)
│   ├── pages/           # Page components for different sections
│   │   ├── dashboard/   # Dashboard and analytics
│   │   ├── restaurant/  # Restaurant management
│   │   ├── hotel/       # Hotel management
│   │   ├── properties/  # Property management
│   │   └── orders/      # Order and billing management
│   └── utils/           # Utility functions and API integration
├── assets/              # Images and static assets
└── App.jsx             # Main application component
```

## Authentication

The admin panel uses JWT token-based authentication:

1. Login with admin credentials
2. Token is stored in browser cookies
3. All API requests include the authorization header
4. Token is automatically included in all requests via axios interceptors

## Key Features Implementation

### Restaurant Billing System
- **Order Creation**: Convert restaurant bookings to billable orders
- **GST Calculation**: Automatic GST calculation with configurable rates
- **Discount Support**: Apply percentage-based discounts
- **Payment Tracking**: Track payment status (pending/paid/cancelled)
- **Printable Bills**: Generate professional bills with company details

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Consistent UI across all modules
- White background with blue accent buttons
- Responsive tables and forms

### Data Management
- Pagination for large datasets
- Search and filtering capabilities
- URL parameter persistence
- Real-time data updates

## API Integration

The admin panel integrates with the Patil Associates backend API:

- **Base URL**: Configurable via environment variables
- **Authentication**: Automatic JWT token handling
- **Error Handling**: Comprehensive error management
- **Data Validation**: Client-side validation before API calls

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_BASE_URL | Backend API base URL | Yes |

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Follow consistent naming conventions
- Implement proper error handling
- Use Tailwind CSS for styling
- Maintain responsive design principles

### API Integration
- Use the centralized Api utility
- Handle loading and error states
- Implement proper data validation
- Use consistent response handling

### UI/UX Standards
- White background with blue buttons
- Consistent spacing and typography
- Mobile-responsive design
- Accessible components
- Clear user feedback

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on pushes to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Serve the `dist` folder with any static file server
3. Configure your web server for SPA routing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and feature requests, please contact the development team or create an issue in the repository.

---
*Patil Associates Admin Panel - Version 1.0.0*