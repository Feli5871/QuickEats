/**
 * Restaurant utility functions for QuickEats
 */

type RestaurantFilter = {
  cuisines: string[];
  ratings: number[];
};

// Function to filter restaurants based on selected criteria
export function filterRestaurants(
  restaurants: any[],
  filters: RestaurantFilter,
  searchQuery: string = ''
): any[] {
  return restaurants.filter(restaurant => {
    // Filter by cuisine if any are selected
    const matchesCuisine =
      filters.cuisines.length === 0 ||
      restaurant.cuisine?.some((c: string) => filters.cuisines.includes(c));

    // Filter by minimum rating if any are selected
    const matchesRating =
      filters.ratings.length === 0 ||
      filters.ratings.some(rating => restaurant.rating >= rating);

    // Filter by search query
    const matchesSearch =
      !searchQuery ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCuisine && matchesRating && matchesSearch;
  });
}

// Helper function to get price tier level ($ to $$$$)
export function getPriceTier(priceRange: string): number {
  if (!priceRange) return 0;
  
  // Check if priceRange directly uses $ symbols
  if (priceRange.startsWith('$')) {
    return priceRange.length; // Count number of $ symbols
  }
  
  // Otherwise, parse the numeric values
  const [min, max] = priceRange.split('-').map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
  
  // Determine price tier based on average price
  const avgPrice = max ? (min + max) / 2 : min;
  
  if (avgPrice < 10) return 1; // $
  if (avgPrice < 20) return 2; // $$
  if (avgPrice < 30) return 3; // $$$
  return 4; // $$$$
}

// Function to sort restaurants
export function sortRestaurants(restaurants: any[], sortBy: string): any[] {
  const sortedRestaurants = [...restaurants];
  
  switch (sortBy) {
    case 'price-low': // $ to $$$$
      return sortedRestaurants.sort((a, b) => {
        const aTier = getPriceTier(a.priceRange);
        const bTier = getPriceTier(b.priceRange);
        return aTier - bTier;
      });
      
    case 'price-high': // $$$$ to $
      return sortedRestaurants.sort((a, b) => {
        const aTier = getPriceTier(a.priceRange);
        const bTier = getPriceTier(b.priceRange);
        return bTier - aTier;
      });
      
    case 'rating-asc':
      return sortedRestaurants.sort((a, b) => a.rating - b.rating);
      
    case 'rating-desc':
      return sortedRestaurants.sort((a, b) => b.rating - a.rating);
      
    default:
      return sortedRestaurants;
  }
}