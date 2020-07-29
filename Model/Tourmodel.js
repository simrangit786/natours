const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./Usermodel");
const Review = require('./../Model/reviewModel')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour must have a name"],
      unique: true,
      maxlength: [40, "A tour must have less or equal than 40 character"],
      minlength: [10, "A tour must have more or equal than 10 character"],
      // validate: [validator.isAlpha, " A tour name must contains letters "],
    },
    slug: String,
    Duration: {
      type: Number,
      //required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a groupsize"],
    },
    Difficulty: {
      type: String,
      //required: [true, "A tour must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      required: [true, "A tour must have a ratingaverage"],
      min: [1, 'rating must be above from 1.0'],
      max: [5, 'rating must be below from 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; //100<200
        },
        message:
          "Discount price should be below({VALUE}) from the regular price",
      },
    },
    description: {
      type: String,
      trim: true,
    },
    PriceDiscount: {
      type: Number,
      summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"],
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a image"],
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },


    startLocation: {
      //Geojson
      type: {
        type: String,
        default: "Point",
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }

    ],
    guides: Array
    // guides: [
    // {
    // type: mongoose.Schema.ObjectId,
    //ref: 'User'
    //}
    //]
  },



  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//tourSchema.index({ price: 1 })
tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
//Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});


//Document Middleware : runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre("save", async function (next) {
  const guidespromises = this.guides.map(async id => await User.findById(id))
  this.guides = await Promise.all(guidespromises)

  next();
})

/*tourSchema.pre("save", function (next) {
  console.log("Will save document......");
  next();
});
tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});
*/

//Query Middleware
//tourSchema.pre("find", function (next) {
tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});



tourSchema.post("find", function (docs, next) {
  console.log(`query.took ${Date.now() - this.start}millisecond`);
  console.log(docs);
});


//Aggregation middleware
//tourSchema.pre("aggregate", function (next) {
//this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//console.log(this.pipeline());
//next();

//});

//tourSchema.index({ 'address.locations': '2dsphere' })
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

