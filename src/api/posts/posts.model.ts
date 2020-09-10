import mongoose from 'mongoose';

interface PostsModel extends mongoose.Model<PostsDoc> {
  build(attrs: PostsAttrs): PostsDoc;
}

interface PostsAttrs {
  title: string;
  text: string;
  postImage: string;
  snipet: string;
  slug: string;
  active: boolean;
  date: Date;
  author: string;
  coments: [
    {
      from: string;
      message: string;
      date: Date;
    },
  ];
}

interface PostsDoc extends mongoose.Document {
  title: string;
  text: string;
  postImage: string;
  snipet: string;
  slug: string;
  active: boolean;
  date: Date;
  author: string;
  coments: [
    {
      from: string;
      message: string;
      date: Date;
    },
  ];
}

const PostsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    postImage: { type: String, required: true },
    snipet: { type: String, required: true },
    slug: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
    date: { type: Date, required: true, default: Date.now },
    author: { type: String, required: true },
    coments: [
      {
        from: { type: String, required: false },
        message: { type: String, required: false },
        date: { type: Date, required: false },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

PostsSchema.statics.build = (attrs: PostsAttrs) => {
  return new Posts(attrs);
};

const Posts = mongoose.model<PostsDoc, PostsModel>('Posts', PostsSchema);

export { Posts };
