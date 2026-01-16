import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * Crea una nueva orden y simula procesamiento pesado
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Verificar si la orden ya existe
    const existingOrder = await this.orderRepository.findOne({
      where: { order_number: createOrderDto.order_number },
    });

    if (existingOrder) {
      return existingOrder;
    }

    // Crear nueva orden
    const order = this.orderRepository.create({
      ...createOrderDto,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Simular procesamiento pesado de forma asíncrona
    this.processOrderAsync(savedOrder.id);

    return savedOrder;
  }

  /**
   * Obtiene una orden por ID
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  /**
   * Obtiene una orden por número de orden
   */
  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_number: orderNumber },
    });

    if (!order) {
      throw new NotFoundException(
        `Orden con número ${orderNumber} no encontrada`,
      );
    }

    return order;
  }

  /**
   * Simula procesamiento pesado de forma asíncrona
   */
  private async processOrderAsync(orderId: number): Promise<void> {
    // Simular delay de procesamiento (5-10 segundos)
    const processingTime = Math.floor(Math.random() * 5000) + 5000;

    setTimeout(async () => {
      try {
        const order = await this.orderRepository.findOne({
          where: { id: orderId },
        });

        if (order) {
          order.status = OrderStatus.PROCESSING;
          await this.orderRepository.save(order);

          // Simular más procesamiento
          setTimeout(async () => {
            const updatedOrder = await this.orderRepository.findOne({
              where: { id: orderId },
            });

            if (updatedOrder) {
              updatedOrder.status = OrderStatus.COMPLETED;
              updatedOrder.processed_at = new Date();
              await this.orderRepository.save(updatedOrder);
            }
          }, processingTime);
        }
      } catch (error) {
        console.error(`Error procesando orden ${orderId}:`, error);
        
        // Marcar como fallida en caso de error
        const order = await this.orderRepository.findOne({
          where: { id: orderId },
        });
        
        if (order) {
          order.status = OrderStatus.FAILED;
          await this.orderRepository.save(order);
        }
      }
    }, 1000);
  }

  /**
   * Actualiza el estado de una orden
   */
  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    
    if (status === OrderStatus.COMPLETED) {
      order.processed_at = new Date();
    }

    return await this.orderRepository.save(order);
  }
}
