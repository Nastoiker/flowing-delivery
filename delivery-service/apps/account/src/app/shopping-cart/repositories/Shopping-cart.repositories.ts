import { IShoppingCart } from '@delivery-service/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Food } from '../../food/models/food.model';
import { User } from '../../user/models/user.model';
import { ShoppingCart } from '../model/shopping-cart.model';

@Injectable()
export class ShoppingCartRepository {
  constructor(
    @InjectModel(ShoppingCart)
    private readonly shoppingCartModel: typeof ShoppingCart,
    @InjectModel(Food)
    private readonly foodModel: typeof Food
  ) {}

  async createShoppingCart(shoppingCart: any) {
    const shoppingCartCreated = await this.shoppingCartModel.create({
      ...shoppingCart,
    });
    if (!shoppingCartCreated) {
      throw new Error('Ошибка создания корзины покупок');
    }
    return shoppingCartCreated;
  }

  async updateShoppingCart({ id, count, totalPrice, ...rest }: IShoppingCart) {
    const checkExist = await this.shoppingCartModel.findByPk(id, {
      include: [{ model: Food }],
    });
    const product = await this.foodModel.findByPk(checkExist.productId);
    if (count > product.count) {
      throw new Error('Нету такого количества продукта');
    }
    if (count === 0) {
      await checkExist.destroy();
      return;
    }

    totalPrice = count * checkExist.product.price;

    const shoppingCart = await checkExist.update({
      count,
      totalPrice,
      ...rest,
    });

    return shoppingCart;
  }

  async findShoppingCart(id: number) {
    return this.shoppingCartModel.findOne({ where: { id } });
  }
  async getShoppingCardByUserId(userId: number) {
    return this.shoppingCartModel.findAll({
      where: { userId },
      include: [{ model: User }, { model: Food }],
    });
  }
  async clearedShoppingCart(userId: number) {
    return this.shoppingCartModel.destroy({
      where: { userId },
    });
  }
  async findShoppingCartById(id: number) {
    return this.shoppingCartModel.findByPk(id);
  }
  async deleteShoppingCart(id: number) {
    const shoppingCart = await this.shoppingCartModel.findByPk(id);
    if (!shoppingCart) {
      throw new Error('Корзина не найдена');
    }
    await shoppingCart.destroy();
  }
}
