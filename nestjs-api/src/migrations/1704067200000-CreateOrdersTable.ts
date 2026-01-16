import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersTable1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order_number',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'customer',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'product',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: "'pending'",
          },
          {
            name: 'processed_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_ORDER_NUMBER',
            columnNames: ['order_number'],
          },
          {
            name: 'IDX_STATUS',
            columnNames: ['status'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
