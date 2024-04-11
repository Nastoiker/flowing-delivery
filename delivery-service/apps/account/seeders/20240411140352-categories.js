import { Category } from './category.model';

const categoriesData = [
  {
    name: 'Основные блюда',
    slug: 'main-dishes',
    products: [
      { name: 'Паста', description: 'Вкусная паста', price: 10 },
      { name: 'Пицца', description: 'Итальянская пицца', price: 12 },
    ],
    subcategories: [
      {
        name: 'Салаты',
        slug: 'salads',
        products: [
          {
            name: 'Цезарь',
            description: 'Классический салат Цезарь',
            price: 8,
          },
        ],
      },
    ],
  },
  {
    name: 'Десерты',
    slug: 'desserts',
    products: [
      { name: 'Тирамису', description: 'Итальянский десерт', price: 6 },
    ],
  },
];

async function createCategoryWithSubcategories(categoryData, parent = null) {
  const category = await Category.create({
    name: categoryData.name,
    slug: categoryData.slug,
    parentId: parent ? parent.id : null,
  });

  if (categoryData.products) {
    for (const productData of categoryData.products) {
      await category.$create('product', productData); // Создание продукта, связанного с категорией
    }
  }

  if (categoryData.subcategories) {
    for (const subcategoryData of categoryData.subcategories) {
      await createCategoryWithSubcategories(subcategoryData, category); // Рекурсивное создание подкатегорий
    }
  }

  return category;
}

export const seedCategories = async () => {
  for (const categoryData of categoriesData) {
    await createCategoryWithSubcategories(categoryData);
  }
};
