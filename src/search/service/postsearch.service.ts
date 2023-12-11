// import { Injectable } from '@nestjs/common';
// import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { from, switchMap } from 'rxjs';
// import { PostInterface } from '../../post/dto/post.interfase';
// import { PostResultInterface } from '../model/posrresult.interface';
// import { PostSearchInterface } from '../model/postsearch.interface';

import { Injectable } from '@nestjs/common/decorators';
//import { PostResultInterface } from '../model/posrresult.interface';
import { PostSearchInterface } from '../model/postsearch.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostInterface } from 'src/post/dto/post.interfase';
import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';

// @Injectable()
// export class PostsearchService {
//   index = 'posts';
//   constructor(private elasticsearchService: ElasticsearchService) {}

//   indexPost(post: PostInterface) {
//     return from(
//       this.elasticsearchService.index<PostResultInterface, PostSearchInterface>(
//         {
//           index: this.index,
//           body: {
//             id: post.id,
//             title: post.title,
//             content: post.content,
//           },
//         },
//       ),
//     );
//   }
//   search(text: string) {
//     from(
//       this.elasticsearchService.search<PostResultInterface>({
//         index: this.index,
//         body: {
//           query: {
//             multi_match: {
//               query: text,
//               fields: ['title', 'content'],
//             },
//           },
//         },
//       }),
//     ).pipe((body) => {
//       const hits = body.hits.hits;
//       return hits.map((item)=>item._source)
//     });
//   }
// }
@Injectable()
export default class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: PostInterface): Promise<WriteResponseBase> {
    return this.elasticsearchService.index<PostSearchInterface>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        createAt: post.createAt,
      },
    });
  }

  async search(text: string) {
    const body = await this.elasticsearchService.search<PostSearchInterface>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}
