import { Food } from './models/food.model';

async function seedFood() {
  const foods = [
    {
      categoryId: 2,
      title: 'Пицца Маргарита',
      price: 500,
      count: 10,
      in_stock: 10,
      description: 'Классическая итальянская пицца с томатами и моцареллой',
      pictures: 'margarita.jpg',
    },
    {
      categoryId: 2,
      title: 'Спагетти Карбонара',
      price: 450,
      count: 15,
      in_stock: 15,
      description: 'Итальянское блюдо с беконом, яйцом и сыром Пармезан',
      pictures: 'carbonara.jpg',
    },
    {
      categoryId: 2,
      title: 'Спагетти Карбонара',
      price: 450,
      count: 15,
      in_stock: 15,
      description: 'Итальянское блюдо с беконом, яйцом и сыром Пармезан',
      pictures: 'carbonara.jpg',
    },
    {
      categoryId: 2,
      title: 'Спагетти Карбонара',
      price: 450,
      count: 15,
      in_stock: 15,
      description: 'Итальянское блюдо с беконом, яйцом и сыром Пармезан',
      pictures: 'carbonara.jpg',
    },
  ];

  for (const food of foods) {
    await Food.create(food);
  }

  console.log('Food seed completed!');
}

export const startSeedFood = async () => {
  const checkExistFoods = await Food.findOne({
    where: { title: 'Спагетти Карбонара' },
  });
  if (checkExistFoods) {
    return;
  }
  await seedFood();
};
