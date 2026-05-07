const CATEGORY_METADATA = {
  Work: {
    color: '#3B82F6',
    icon: 'briefcase',
  },
  Personal: {
    color: '#EC4899',
    icon: 'user',
  },
  Finance: {
    color: '#10B981',
    icon: 'wallet',
  },
  Health: {
    color: '#EF4444',
    icon: 'heart-pulse',
  },
  Home: {
    color: '#F59E0B',
    icon: 'house',
  },
  Coding: {
    color: '#6366F1',
    icon: 'code',
  },
  Study: {
    color: '#8B5CF6',
    icon: 'book-open',
  },
  Shopping: {
    color: '#F97316',
    icon: 'shopping-cart',
  },
  Errands: {
    color: '#14B8A6',
    icon: 'map-pinned',
  },
};

const FALLBACK_CATEGORY_NAME = 'Other';
const FALLBACK_CATEGORY_COLOR = '#9CA3AF';
const FALLBACK_CATEGORY_ICON = 'tag';

function cleanCategoryName(category) {
  if (typeof category !== 'string') return '';
  return category.trim().replace(/\s+/g, ' ');
}

function toLookupKey(category) {
  const cleanedCategory = cleanCategoryName(category);
  if (!cleanedCategory) return '';
  return cleanedCategory
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getCategoryMetadata(category) {
  const cleanedCategory = cleanCategoryName(category);
  const lookupKey = toLookupKey(cleanedCategory);
  const metadata = CATEGORY_METADATA[lookupKey];
  const resolvedName = metadata ? lookupKey : cleanedCategory || FALLBACK_CATEGORY_NAME;

  return {
    sCategory: resolvedName,
    sCategoryColor: metadata?.color || FALLBACK_CATEGORY_COLOR,
    sCategoryIcon: metadata?.icon || FALLBACK_CATEGORY_ICON,
    oCategoryMeta: {
      sName: resolvedName,
      sColor: metadata?.color || FALLBACK_CATEGORY_COLOR,
      sIcon: metadata?.icon || FALLBACK_CATEGORY_ICON,
    },
  };
}

function resolveCategoryPresentation({ category, color, icon }) {
  const categoryMetadata = getCategoryMetadata(category);

  return {
    sCategory: categoryMetadata.sCategory,
    sCategoryColor: color || categoryMetadata.sCategoryColor,
    sCategoryIcon: icon || categoryMetadata.sCategoryIcon,
    oCategoryMeta: {
      sName: categoryMetadata.sCategory,
      sColor: color || categoryMetadata.oCategoryMeta.sColor,
      sIcon: icon || categoryMetadata.oCategoryMeta.sIcon,
    },
  };
}

module.exports = {
  CATEGORY_METADATA,
  FALLBACK_CATEGORY_NAME,
  FALLBACK_CATEGORY_COLOR,
  FALLBACK_CATEGORY_ICON,
  getCategoryMetadata,
  resolveCategoryPresentation,
};
