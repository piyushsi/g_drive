var express = require("express");
var router = express.Router();
var Directory = require("../../models/directory");

router.post("/create", (req, res, next) => {
  const { name, format, size, type, id } = req.body;
  if (type == "folder") {
    id == "home"
      ? Directory.create(
          { name, ishome: true, isFolder: true },
          (err, createdDirectory) => {
            if (err) return next(err);
          }
        )
      : Directory.create({ name, isFolder: true }, (err, createdDirectory) => {
          if (err) return next(err);
          Directory.findByIdAndUpdate(
            id,
            { $push: { directory: createdDirectory.id } },
            { new: true },
            (err, updated) => {
              if (err) return next(err);
              res.json({ success: true });
            }
          );
        });
  } else if (type == "file") {
    Directory.create(
      { name, format, size, isFolder: false },
      (err, createdDirectory) => {
        if (err) return next(err);
        id
          ? Directory.findByIdAndUpdate(
              id,
              { $push: { directory: createdDirectory.id } },
              (err, updated) => {
                err
                  ? res.json({ success: false, err })
                  : res.json({ success: true, updated });
              }
            )
          : "";
      }
    );
  } else {
    res.json({
      success: false,
      message: "type Error",
    });
  }
});

router.get("/", (req, res) => {
  Directory.findOne({ ishome: true })
    .populate({
      path: "directory",
      populate: {
        path: "directory",
        populate: {
          path: "directory",
          populate: {
            path: "directory",
            populate: {
              path: "directory",
              populate: {
                path: "directory",
                populate: {
                  path: "directory",
                  populate: {
                    path: "directory",
                    populate: {
                      path: "directory",
                      populate: {
                        path: "directory",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    .exec((err, homeDirectory) => {
      homeDirectory
        ? res.json({
            sucess: false,
            data: { homeDirectory },
          })
        : res.json({
            sucess: true,
          });
    });
});

module.exports = router;
