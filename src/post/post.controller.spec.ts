/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostEntity } from './entities/post.entity';
import { UserInterface } from '../user/model/user.interface';
import { PostInterface } from './dto/post.interfase';
import { DeleteResult, UpdateResult } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMock = require('node-mocks-http');
describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;
  //----arguments data-----
  const mockRequest = httpMock.createRequest();
  mockRequest.user = new UserInterface();
  mockRequest.user.name = 'john';
  const mockPost: PostInterface = {
    title: 'title',
    content: 'test1',
    createAt: new Date(),
    author: mockRequest.user,
  };
  const mockPosts: PostInterface[] = [
    mockPost,
    { ...mockPost, content: 'test2' },
    { ...mockPost, content: 'test3' },
  ];
  const mockDelete: DeleteResult = {
    raw: [],
    affected: 1,
  };
  const mockUpdate: UpdateResult = {
    ...mockDelete,
    generatedMaps: [],
  };
  const mockPostService = {
    createPost: jest.fn().mockImplementation((post: PostInterface) => {
      return {
        id: String,
        ...post,
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });
  it('should be post', () => {
    expect(postController.create(mockPost)).toEqual({
      id: expect.any(String),
      ...mockPost,
    });
  });
  // it('should update post', () => {
  //   expect(postController.update(mockPost)).toEqual({
  //     mockUpdate,
  //   });
  // });
});
