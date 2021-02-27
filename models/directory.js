var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var directorySchema = new Schema(
  {
    name: {
      type: String,
    },
    size: {
      type: String,
    },
    format: {
      type: String,
    },
    ishome: {
      type: Boolean,
    },
    isFolder: {
      type: Boolean,
    },
    directory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Directory",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Directory", directorySchema);
