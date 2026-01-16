import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('external/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Crea una nueva orden desde Laravel
   * POST /external/orders
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      message: 'Orden recibida y en procesamiento',
    };
  }

  /**
   * Obtiene el estado de una orden
   * GET /external/orders/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);

    return {
      id: order.id,
      order_number: order.order_number,
      customer: order.customer,
      product: order.product,
      quantity: order.quantity,
      status: order.status,
      processed_at: order.processed_at,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
