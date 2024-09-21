import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cat  {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column()
  breed: string;

  
  constructor(id: number, name: string, age: number, breed: string) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.breed = breed;
  }
}