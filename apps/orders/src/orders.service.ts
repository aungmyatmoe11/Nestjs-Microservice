import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderRequest } from './dto/create-order.request';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy // ? BillingClient 1 ku
  ) { }

  async createOrder(request: CreateOrderRequest, authentication: string) {
    // return this.orderRepository.create(request);
    const session = await this.orderRepository.startTransaction(); // ? like DB::transaction in laravel

    try {
      const order = await this.orderRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication :authentication
        }),
      );
      await session.commitTransaction(); // ? DB::commit()
      return order;

    } catch (err) {
      await session.abortTransaction();
      throw err;
    }

  }

  async getOrders() {
    return this.orderRepository.find({});
  }
}
