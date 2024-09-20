import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { NotFoundException } from '@nestjs/common';

describe('CatController', () => {
  let controller: CatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [CatService],
    }).compile();

    controller = module.get<CatController>(CatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a cat', () => {
    const cat = controller.create({ name: 'Whiskers', age: 2, breed: 'Siamese' });
    expect(cat).toEqual({ id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' });
  });

  it('should find all cats', () => {
    const cats = controller.findAll();
    expect(cats).toEqual([]);
  });

  it('should find a cat by id', () => {
    controller.create({ name: 'Amber', age: 3, breed: 'None' });
    const cat = controller.findOne(1);
    expect(cat).toEqual({ id: 1, name: 'Amber', age: 3, breed: 'None' });
  });

  it('should handle not found cat', () => {
    expect(() => controller.findOne(999)).toThrow(NotFoundException);
  });
  it('should update a cat', () => {
    controller.create({ name: 'Whiskers', age: 2, breed: 'Siamese' });
    const updatedCat = controller.update(1, { name: 'Amber', age: 3, breed: 'None' });
    expect(updatedCat).toEqual({ id: 1, name: 'Amber', age: 3, breed: 'None' });
  });

  it('should delete a cat', () => {
    const createdCat = controller.create({ name: 'Whiskers', age: 2, breed: 'Siamese' });
    controller.delete(createdCat.id);
        // 確保貓已被刪除
    expect(() => controller.findOne(createdCat.id)).toThrow(NotFoundException);
  });
});
