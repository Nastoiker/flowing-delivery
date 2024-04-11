import { Category } from './model/category.model';

const categoriesData = [
  {
    name: 'Основные блюда',
    slug: 'main-dishes',
    // products: [
    //   { title: 'Паста', description: 'Вкусная паста', price: 10, in_stock: 1 },
    //   {
    //     title: 'Пицца',
    //     description: 'Итальянская пицца',
    //     price: 12,
    //     in_stock: 1,
    //   },
    // ],
    subcategories: [
      {
        name: 'Салаты',
        slug: 'salads',
        products: [
          {
            title: 'Цезарь',
            description: 'Классический салат Цезарь',
            price: 8,
            count: 0,
            in_stock: 1999,
            pictures: '',
          },
        ],
      },
    ],
  },
  {
    name: 'Десерты',
    slug: 'desserts',
    // products: [
    //   { title: 'Тирамису', description: 'Итальянский десерт', price: 6 },
    // ],
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
      await category.$create('product', productData);
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
  const checkExist = await Category.findOne({
    where: { name: 'Основные блюда' },
  });
  if (checkExist) return true;
  for (const categoryData of categoriesData) {
    await createCategoryWithSubcategories(categoryData);
  }
  return true;
};
