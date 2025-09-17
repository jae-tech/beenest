import { PartialType } from '@nestjs/swagger';
import { CreateSupplierDto } from '@/suppliers/dto/create-supplier.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}