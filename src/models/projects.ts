import mongoose from 'mongoose';

interface ProjectsModel extends mongoose.Model<ProjectsDoc> {
  build(attrs: ProjectsAttrs): ProjectsDoc;
}

const ImagesSchema = new mongoose.Schema({
  imagePath: { type: String },
});

interface ImagesAttrs {
  imagePath: string;
}

interface ProjectsAttrs {
  title: string;
  type: string;
  desc: string;
  imgUrl: string;
  siteUrl: string;
  displayFront: boolean;
  hasDesc: boolean;
  slug: string;
  text: string;
  doneDate: Date;
  challengeText: string;
  images: [ImagesAttrs];
}

interface ProjectsDoc extends mongoose.Document {
  title: string;
  type: string;
  desc: string;
  imgUrl: string;
  siteUrl: string;
  displayFront: boolean;
  hasDesc: boolean;
  slug: string;
  text: string;
  doneDate: Date;
  challengeText: string;
  images: [ImagesAttrs];
}

const ProjectsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    imgUrl: { type: String, required: true },
    siteUrl: { type: String, required: true },
    displayFront: { type: Boolean, required: false, default: false },
    hasDesc: { type: Boolean, required: false, default: false },
    slug: { type: String, required: false },
    text: { type: String, required: false },
    doneDate: { type: Date, required: true },
    challengeText: { type: String, required: false },
    images: [ImagesSchema],
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

ProjectsSchema.statics.build = (attrs: ProjectsAttrs) => {
  return new Projects(attrs);
};

const Projects = mongoose.model<ProjectsDoc, ProjectsModel>(
  'Projects',
  ProjectsSchema,
);

export { Projects };
