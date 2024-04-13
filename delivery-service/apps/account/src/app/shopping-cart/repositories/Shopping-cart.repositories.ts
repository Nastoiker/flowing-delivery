import { IShoppingCart } from '@delivery-service/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../user/models/user.model';
import { ShoppingCart } from '../model/shopping-cart.model';

@Injectable()
export class ShoppingCartRepository {
  constructor(
    @InjectModel(ShoppingCart)
    private readonly shoppingCartModel: typeof ShoppingCart
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

  async updateShoppingCart({ id, ...rest }: IShoppingCart) {
    const shoppingCart = await this.shoppingCartModel.update(
      {
        ...rest,
      },
      {
        where: {
          id,
        },
      }
    );

    return shoppingCart;
  }

  async findShoppingCart(id: number) {
    return this.shoppingCartModel.findOne({ where: { id } });
  }
  async getShoppingCardByUserId(userId: number) {
    return this.shoppingCartModel.findOne({
      where: { userId },
      include: [{ model: User }],
    });
  }
  async findShoppingCartById(id: number) {
    return this.shoppingCartModel.findByPk(id);
  }
  async deleteShoppingCart(id: number) {
    const shoppingCart = await this.shoppingCartModel.findOne({
      where: { id },
    });
    await shoppingCart.destroy();
  }
}
