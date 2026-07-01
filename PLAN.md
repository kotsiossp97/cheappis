# Cheappis: Cyprus Ad Classifieds for used tech gadgets

Cheappis is a platform for buying and selling used tech gadgets in Cyprus. It provides a user-friendly interface for users to post ads for their items, browse listings, and connect with potential buyers or sellers.

## Features

- **User Registration and Authentication**: Users can create accounts, log in, and manage their profiles.
- **Ad Posting**: Users can post ads for their used tech gadgets, including descriptions, images, and pricing information.
- **Search and Filter**: Users can search for specific items and filter results based on categories, price range, and location.
- **Messaging System**: Users can communicate with each other through a built-in messaging system to negotiate deals and ask questions about listings.
- **Favorites and Watchlist**: Users can save their favorite listings and create a watchlist for items they are interested in.
- **Admin Panel**: An admin panel for managing users, ads, and site content.
- **Internationalization (i18n)**: Support for multiple languages for a wider audience reach, starting with English and Greek, but can be expanded to other languages in the future.
- **Responsive Design**: The platform will be optimized for both desktop and mobile devices, ensuring a seamless user experience across different screen sizes.
- **Notifications**: Users will receive notifications for important events, such as new messages, ad approvals, or updates on their listings.
- **Rate Limiting and Spam Prevention**: Implement rate limiting and spam prevention measures to ensure a safe and secure environment for users. (redis + middleware)
- **Automatic Background Jobs**: Implement background jobs for tasks such as auto ad expiration, renewal reminders, and email notifications to improve user experience and platform efficiency. (bullmq + redis)
- **Stripe Integration**: Integrate Stripe for payment processing, allowing users to pay for premium listings or subscription plans securely.
- **Slug Based URLs**: Use slugs for ad URLs to improve SEO and user experience, making it easier for users to share and remember listings.
- **Dynamic Sitemap Generation**: Generate dynamic sitemaps for search engines to improve indexing and visibility of the platform's content.

## Monetization

- **Premium Listings**: Users can pay to have their ads featured at the top of search results or highlighted for better visibility.
- **Advertisement**: Display ads from third-party advertisers on the platform to generate revenue.
- **Subscription Plans**: Offer subscription plans for users who want additional features, such as unlimited ad postings or access to premium content.
- These will be added in the future as the platform grows and gains traction. It will be good to have them implemented but not available in the initial release (maybe with feature flags).

### Technology Stack

- Next.js latest version with app router
- latest TailwindCSS and shadcn/ui for styling and components
- `next/image` for optimized image handling
- `TanStack Query` for client-side data fetching and caching
- `nuqs` for url search params as state to handle filters and search
- `react-hook-form` and `zod` for form handling and validation
- `bullmq` and `redis` for background job processing and caching
