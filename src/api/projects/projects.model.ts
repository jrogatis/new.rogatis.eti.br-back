import mongoose from 'mongoose';

interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc;
}

const ImagesSchema = new mongoose.Schema({
  imagePath: { type: String },
});

interface ImagesAttrs {
  imagePath: string;
}

interface ProjectAttrs {
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

interface ProjectDoc extends mongoose.Document {
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

const ProjectSchema = new mongoose.Schema(
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

ProjectSchema.statics.build = (attrs: ProjectAttrs) => {
  return new Project(attrs);
};

const Project = mongoose.model<ProjectDoc, ProjectModel>(
  'Project',
  ProjectSchema,
);

export { Project, ProjectAttrs, ProjectDoc, ProjectModel };
