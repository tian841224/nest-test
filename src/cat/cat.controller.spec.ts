import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { NotFoundException } from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { CatUpdateDto } from './dtos/cat.update.dto';
import { CatCreateDto } from './dtos/cat.create.dto';

describe('CatController', () => {
  let controller: CatController;
  let service: CatService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        CatService,
        {
          provide: 'CatRepository', // 使用字符串作為提供者名稱
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<CatController>(CatController);
    service = moduleRef.get<CatService>(CatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('建立cat', async () => {
    let cat: CatCreateDto = { name: 'Whiskers', age: 2, breed: 'Siamese' };
    const catData = { id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' };
    
    // 模擬 create 方法
    jest.spyOn(service, 'create').mockResolvedValue(catData);
    
    // 驗證 create 方法的返回值
    expect(await controller.create(cat)).toEqual(catData);

    // 驗證 create 方法被正確調用
    expect(service.create).toHaveBeenCalledWith(cat);
  });

  it('搜尋cat by id', async () => {
    const result: Cat = { id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' };
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne(1)).toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  describe('findAll', () => {
    it('應該返回所有貓咪資料', async () => {
      const result: Cat[] = [
        { id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' },
        { id: 2, name: 'Tom', age: 3, breed: 'Persian' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  it('搜尋cat-資料不存在', async () => {
    // 修改為 async 函數
    jest.spyOn(service, 'findOne').mockResolvedValue(null); // 模擬返回 null
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    expect(service.findOne).toHaveBeenCalledWith(999);
  });

  it('更新cat', async () => {
    const updateDto: CatUpdateDto = { name: 'Amber', age: 3, breed: 'None' };
    const updatedCat: Cat = { id: 1, ...updateDto };

    // 模擬 CatService.update 方法
    jest.spyOn(service, 'update').mockResolvedValue(updatedCat);

    // 呼叫 controller.update 並賦值結果
    const result = await controller.update(1, updateDto);

    // 斷言返回值是否正確
    expect(result).toEqual(updatedCat);

    // 斷言服務方法是否被正確調用
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('刪除cat', async () => {
    const catId = 1;
      
    // 模擬刪除操作
    jest.spyOn(service, 'delete').mockResolvedValue(undefined);
    
    // 執行刪除
    await expect(controller.delete(catId)).resolves.toBeUndefined();
    
    // 驗證 delete 方法被調用
    expect(service.delete).toHaveBeenCalledWith(catId);
  });
});
