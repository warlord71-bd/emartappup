# eMart BD - Mobile App

Korean & Japanese Beauty E-Commerce App for Bangladesh

## Theme: Midnight Blossom
- Dark luxury header (#1B1B2F)
- Soft pink accents (#E8739E)
- Gold ratings (#D4A248)
- Bilingual: English + বাংলা

## Quick Setup

### Option A: Replace files in your existing Expo project

1. Copy ALL files from this folder into your Expo project root (replace existing ones)
2. Run:
   ```
   npm install
   npx expo start
   ```

### Option B: Fresh start

1. Create new Expo project:
   ```
   npx create-expo-app EmartBD
   cd EmartBD
   ```
2. Delete the default files and copy ALL files from this folder
3. Install dependencies:
   ```
   npm install
   ```
4. Start:
   ```
   npx expo start
   ```

## Project Structure

```
EmartBD/
├── App.js                    # Main entry - navigation setup
├── app.json                  # Expo config
├── package.json              # Dependencies
├── assets/
│   └── logo.png              # eMart logo
└── src/
    ├── config/
    │   └── api.js            # WooCommerce API keys
    ├── theme/
    │   └── colors.js         # Midnight Blossom color palette
    ├── i18n/
    │   ├── en.js             # English translations
    │   └── bn.js             # Bangla translations
    ├── context/
    │   ├── CartContext.js     # Cart state management
    │   └── LanguageContext.js # EN/BN language toggle
    ├── services/
    │   └── woocommerce.js    # WooCommerce REST API service
    ├── components/
    │   ├── ProductCard.js     # Product grid card
    │   └── SearchBar.js       # Search input
    └── screens/
        ├── HomeScreen.js      # Home - banners, categories, deals
        ├── CategoriesScreen.js # Category grid
        ├── ProductsScreen.js   # Product list with search/sort/filter
        ├── ProductDetailScreen.js # Full product detail
        ├── CartScreen.js       # Shopping cart
        └── AccountScreen.js    # Profile & settings
```

## Features

- 6 full screens with Midnight Blossom dark luxury theme
- Live WooCommerce API integration (e-mart.com.bd)
- Bilingual support (English/Bangla toggle)
- Product search, sort, filter by category
- Shopping cart with quantity management
- Infinite scroll product loading
- Sale badges, ratings, discount percentages
- Bangladesh-specific: BDT currency, bKash/Nagad, Dhaka delivery

## WooCommerce API

API keys are in `src/config/api.js`. For production:
- Move keys to environment variables
- Consider generating new keys periodically

## Customization

- Colors: Edit `src/theme/colors.js`
- Translations: Edit files in `src/i18n/`
- API endpoint: Edit `src/config/api.js`
