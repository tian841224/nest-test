import { Test, TestingModule } from '@nestjs/testing';
import { CatService } from './cat.service';
import { NotFoundException } from '@nestjs/common';

describe('CatService', () => {
  let service: CatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatService],
    }).compile();

    service = module.get<CatService>(CatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a cat', () => {
    const cat = service.create({ name: 'Whiskers', age: 2, breed: 'Siamese' });
    expect(cat).toEqual({ id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' });
  });

  it('should update a cat', () => {
    service.create({ name: 'Whiskers', age: 2, breed: 'Siamese' }); // 先創建一隻貓
    const cat = service.update(1, { name: 'Amber', age: 3, breed: 'None' });
    expect(cat).toEqual({ id: 1, name: 'Amber', age: 3, breed: 'None' });
  });

  it('should throw NotFoundException when updating a non-existing cat', () => {
    expect(() => service.update(999, { name: 'NonExistent', age: 0, breed: 'None' }))
      .toThrow(NotFoundException); // 檢查是否拋出 NotFoundException
  });

  it('should delete a cat', () => {
    service.create({ name: 'Whiskers', age: 2, breed: 'Siamese' }); // 先創建一隻貓
    service.delete(1);
    expect(service.findAll()).toEqual([]); // 確認貓已被刪除
  });

});
