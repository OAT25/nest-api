import { Injectable } from '@nestjs/common';
//import { CreatePostDto } from './dto/create-post.dto';
//import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Observable, from, of, switchMap } from 'rxjs';
import { PostInterface } from './dto/post.interfase';
import PostsSearchService from 'src/search/service/postsearch.service';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private postSearchService: PostsSearchService,
  ) {}
  create(createPostDto: PostInterface): Observable<PostInterface> {
    return from(this.postRepository.save(createPostDto)).pipe(
      switchMap((post) => {
        console.log(post);
        //this.postSearchService.indexPost(post);
        return of(post);
      }),
    );
  }

  findAll(): Observable<PostInterface[]> {
    return from(this.postRepository.find());
  }

  findOne(id: string): Observable<PostInterface> {
    return from(this.postRepository.findOne({ where: { id: id } }));
  }

  searchForPost(text: string): Observable<PostInterface[]> {
    return from(this.postSearchService.search(text)).pipe(
      switchMap((posts) => {
        if (!posts || posts.length === 0) return [];
        posts.map((post) => {
          const ids = post.id;
          console.log(ids);
          from(this.postRepository.find({ where: { id: ids } }));
        });
      }),
    );
  }

  update(id: string, updatePostDto: PostInterface): Observable<UpdateResult> {
    return from(this.postRepository.update(id, updatePostDto));
  }

  remove(id: string): Observable<DeleteResult> {
    return from(this.postRepository.delete(id));
  }
}
