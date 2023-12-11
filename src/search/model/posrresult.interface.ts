import { PostSearchInterface } from './postsearch.interface';

export class PostResultInterface {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchInterface;
    }>;
  };
}
