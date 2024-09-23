import { Cat } from './entities/cat.entity';
import { Test, TestingModule } from '@nestjs/testing'; // 確保引入測試模組
import { CatService } from './cat.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CatService', () => {
  let service: CatService;
  let repository: Repository<Cat>;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: getRepositoryToken(Cat),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
    repository = module.get<Repository<Cat>>(getRepositoryToken(Cat));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('建立Cat資料', async () => {
    const catData = { id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' };
    const expectedCat = { id: 1, ...catData };

    mockRepository.create.mockReturnValue(expectedCat);
    mockRepository.save.mockResolvedValue(expectedCat);

    const result = await service.create(catData);
    expect(result).toEqual(expectedCat);
    expect(mockRepository.create).toHaveBeenCalledWith(catData);
    expect(mockRepository.save).toHaveBeenCalledWith(expectedCat);
  });

  it('更新Cat資料', async () => {
    // 模擬建立貓的行為
    const createdCat = { id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' };
    mockRepository.create.mockReturnValue(createdCat);
    mockRepository.save.mockResolvedValue(createdCat);

    // 執行建立操作
    const createdResult = await service.create({
      name: 'Whiskers',
      age: 2,
      breed: 'Siamese',
    });
    expect(createdResult).toEqual(createdCat);

    // 模擬查找貓的行為
    mockRepository.findOne.mockResolvedValue(createdCat); 

    // 模擬更新貓的行為
    const updatedCat = { id: 1, name: 'Amber', age: 3, breed: 'None' };
    mockRepository.update.mockResolvedValue(undefined); // 模擬更新操作，返回 void

    // 模擬更新後查找貓的行為
    mockRepository.findOne.mockResolvedValue(updatedCat); // 確保返回更新後的貓

    // 執行更新操作
    const updatedResult = await service.update(1, updatedCat);
    expect(updatedResult).toEqual(updatedCat); // 確認返回的結果是更新後的貓

    // 驗證方法調用
    expect(mockRepository.create).toHaveBeenCalledWith({
      name: 'Whiskers',
      age: 2,
      breed: 'Siamese',
    });
    expect(mockRepository.save).toHaveBeenCalledTimes(1); // 只應該被調用一次
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepository.update).toHaveBeenCalledWith(1, updatedCat); // 驗證 update 方法的調用
  });

  it('更新Cat-資料不存在狀況', async () => {
    expect(
      async () =>
        await service.update(999, {
          name: 'NonExistent',
          age: 0,
          breed: 'None',
        }),
    ).rejects.toThrow(NotFoundException); // 檢查是否拋出 NotFoundException
  });

  it('刪除cat', async () => {
    const catData = { id: 1, name: 'Whiskers', age: 2, breed: 'Siamese' };
    const expectedCat = { id: 1, ...catData };

    mockRepository.create.mockReturnValue(expectedCat);
    mockRepository.save.mockResolvedValue(expectedCat);

    const createdCat = await service.create(catData);
    expect(createdCat).toEqual(expectedCat);

    // 重置 mock 以清除之前的調用
    mockRepository.findOne.mockReset();

    // 模擬找到貓，然後刪除
    mockRepository.findOne.mockResolvedValueOnce(createdCat);
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await service.delete(1);

    // 驗證 findOne 和 delete 方法是否被正確調用
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepository.delete).toHaveBeenCalledWith(1);

    // 模擬刪除後找不到貓
    mockRepository.findOne.mockResolvedValueOnce(null);

    // 嘗試獲取已刪除的貓，並期望拋出 NotFoundException
    // 這裡需要確保 service.findOne 正確調用 mockRepository.findOne
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });
});
