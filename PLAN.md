# Cheappis: Cyprus Ad Classifieds for used tech gadgets

Cheappis is a platform for buying and selling used tech gadgets in Cyprus. It provides a user-friendly interface for users to post ads for their items, browse listings, and connect with potential buyers or sellers.

## Features

- **User Registration and Authentication**: Users can create accounts, log in, and manage their profiles.
- **Listing Posting**: Users can post listings for their used tech gadgets, including descriptions, images, and pricing information.
- **Search and Filter**: Users can search for specific items and filter results based on categories, price range, and location.
- **Messaging System**: Users can communicate with each other through a built-in messaging system to negotiate deals and ask questions about listings.
- **Favorites and Watchlist**: Users can save their favorite listings and create a watchlist for items they are interested in.
- **Admin Panel**: An admin panel for managing users, listings, and site content.
- **Internationalization (i18n)**: Support for multiple languages for a wider audience reach, starting with English and Greek, but can be expanded to other languages in the future.
- **Responsive Design**: The platform will be optimized for both desktop and mobile devices, ensuring a seamless user experience across different screen sizes.
- **Notifications**: Users will receive notifications for important events, such as new messages, listing approvals, or updates on their listings.
- **Rate Limiting and Spam Prevention**: Implement rate limiting and spam prevention measures to ensure a safe and secure environment for users. (redis + middleware)
- **Automatic Background Jobs**: Implement background jobs for tasks such as auto listing expiration, renewal reminders, and email notifications to improve user experience and platform efficiency. (bullmq + redis)
- **Stripe Integration**: Integrate Stripe for payment processing, allowing users to pay for premium listings or subscription plans securely.
- **Slug Based URLs**: Use slugs for listing URLs to improve SEO and user experience, making it easier for users to share and remember listings.
- **Dynamic Sitemap Generation**: Generate dynamic sitemaps for search engines to improve indexing and visibility of the platform's content.

## Monetization

- **Premium Listings**: Users can pay to have their listings featured at the top of search results or highlighted for better visibility.
- **Advertisement**: Display ads from third-party advertisers on the platform to generate revenue.
- **Subscription Plans**: Offer subscription plans for users who want additional features, such as unlimited listing postings or access to premium content.
- These will be added in the future as the platform grows and gains traction. It will be good to have them implemented but not available in the initial release (maybe with feature flags).

### Technology Stack

- Next.js latest version with app router
- latest TailwindCSS and shadcn/ui for styling and components
- `next/image` for optimized image handling
- `tRPC` for type-safe API routes and data fetching
- `nuqs` for url search params as state to handle filters and search
- `react-hook-form` and `zod` for form handling and validation
- `bullmq` and `redis` for background job processing and caching
- `prisma` for database ORM and migrations
- `better-auth` for authentication and authorization
- `next-intl` for internationalization support


### Listings Categorization
- Include as much generic categories for tech products as possible, that each one can have subcategories. The list of categories and subcategories should be stored in the database and be easily manageable by the admin panel. Translation of categories and subcategories should be supported for internationalization. The categories and subcategories should be very large to cover all possible tech products that can be sold in Cyprus. The categories and subcategories should be displayed in a hierarchical manner in the UI, allowing users to easily navigate and find the products they are looking for.
- The admin panel should provide an intuitive interface for managing categories and subcategories, including adding, editing, and deleting entries.
- We should also have a very large list of brands for each category (and subcategory) that can be selected when posting a listing. The list of brands should also be stored in the database and be easily manageable by the admin panel.


### AI Features
- **AI-Powered Listing Suggestions**: Implement AI algorithms to suggest relevant listings to users based on their browsing history, preferences, and interactions with the platform. This will not be shipped on v1 MVP.

- **AI-Powered Listing Approval**: Implement AI algorithms to automatically approve or reject listings based on predefined criteria, such as content quality, relevance, and compliance with platform policies. This will not be shipped on v1 MVP, but we should implement and plan for this feature to be added as soon as possible after the initial release.

- **Automatic Listing Description Translations**: This feature will automatically translate listing descriptions into the platform supported languages, giving the ability to users to toggle between the original and translated description. This will be good to have in the initial release, but we can also ship it later as a v1.1 feature.


### Listings Image Handling
- **Image Upload and Optimization**: Implement an image upload system that allows users to upload image files for their listings. The system should automatically optimize images for web display, ensuring fast loading times and a better user experience. This will be shipped in the initial release.

- **Image Storage & CDN**: Store uploaded images in a cloud storage service (e.g., AWS S3, Google Cloud Storage) and serve them through a Content Delivery Network (CDN) to ensure fast and reliable access for users. This will be shipped in the initial release.

