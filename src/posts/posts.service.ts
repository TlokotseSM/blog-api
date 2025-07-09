import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async findAll() {
    return this.postModel.find().exec();
  }

  async create(createPostDto: any) {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }
}