import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import PostsSearchService from './service/postsearch.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTICSEARCH_NODE,
        auth: {
          username: process.env.ELASTIC_USER,
          password: process.env.ELASTIC_PASSWORD,
        },
      }),
    }),
  ],
  exports: [ElasticsearchModule, PostsSearchService],
  providers: [PostsSearchService],
})
export class SearchModule {}
