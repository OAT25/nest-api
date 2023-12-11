import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import PostsSearchService from 'src/search/service/postsearch.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), SearchModule],
  controllers: [PostController],
  providers: [PostService, PostsSearchService],
})
export class PostModule {}
