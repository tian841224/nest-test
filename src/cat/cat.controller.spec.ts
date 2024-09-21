import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { NotFoundException } from '@nestjs/common';

describe('CatController', () => {
  let controller: CatController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        CatService,
        {
          provide: 'CatRepository', // 使用字符串作為提供者名稱
          useValue: {
            // 在這裡可以添加 mock 方法，例如：
            find: jest.fn().mockResolvedValue([]), // 模擬 find 方法
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<CatController>(CatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('建立cat', async () => {
    const cat = await controller.create({ name: 'Whiskers', age: 2, breed: 'Siamese' });
    expect(cat).toEqual({name: 'Whiskers', age: 2, breed: 'Siamese' });
  });

  it('搜尋cats', async () => {
    const cats = await controller.findAll();
    expect(cats).toEqual([]);
  });

  it('搜尋cat by id', async () => {
    await controller.create({ name: 'Amber', age: 3, breed: 'None' });
    const cat = await controller.findOne(1);
    expect(cat).toEqual({name: 'Amber', age: 3, breed: 'None' });
  });

  it('搜尋cat-資料不存在', () => {
    expect(async () => await controller.findOne(999)).toThrow(NotFoundException);
  });

  it('更新cat', async () => {
    await controller.create({ name: 'Whiskers', age: 2, breed: 'Siamese' });
    const updatedCat = await controller.update(1, { name: 'Amber', age: 3, breed: 'None' });
    expect(updatedCat).toEqual({ id: 1, name: 'Amber', age: 3, breed: 'None' });
  });
  it('刪除cat', async () => {
    const createdCat = await controller.create({ name: 'Whiskers', age: 2, breed: 'Siamese' });
    await controller.delete(createdCat.id);
        // 確保貓已被刪除
    expect(async () => await controller.findOne(createdCat.id)).toThrow(NotFoundException);
  });
});
