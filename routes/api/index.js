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
            res.json({ success: true });
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
  // 10 level population
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

// Delete a folder
router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  Directory.findByIdAndDelete(id, (err, deleted) => {
    Directory.find({ directory: { $in: [id] } }, (err, parentDir) => {
      console.log(parentDir);
      Directory.updateOne({ id: parentDir.id }, { $pull: { directory: [id] } });
      res.json({ sucess: err ? false : true });
    });
  });
});

// size a folder
router.post("/size", (req, res, next) => {
  const { id } = req.body;
  // 10 level population
  Directory.findByIdAndDelete({ id })
    .populate({
      path: "directory",
      select: "size",
      populate: {
        path: "directory",
        select: "size",
        populate: {
          path: "directory",
          select: "size",
          populate: {
            path: "directory",
            select: "size",
            populate: {
              path: "directory",
              select: "size",
              populate: {
                path: "directory",
                select: "size",
                populate: {
                  path: "directory",
                  select: "size",
                  populate: {
                    path: "directory",
                    select: "size",
                    populate: {
                      path: "directory",
                      select: "size",
                      populate: {
                        path: "directory",
                        select: "size",
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
    .exec((err, files) => {
      res.json({ success: !err ? true : false, data: err ? "" : files });
    });
});

// Search by filename
router.post("/search", (req, res, next) => {
  const { name } = req.body;
  Directory.findOne({ name, isFolder: false }, (err, deleted) => {
    res.json({ success: !err ? true : false });
  });
});

// Search for files with name “File1” and format = PNG
router.post("/find", (req, res, next) => {
  const { name, format } = req.body;
  Directory.findOne({ name, format, isFolder: false }, (err, deleted) => {
    res.json({ success: !err ? true : false });
  });
});

// Get list of all files reverse sorted by date
router.get("/sort", async (req, res, next) => {
  const files = await Directory.find({ isFolder: false }).sort({ createdAt: 1 })
    res.json({ files });
});

module.exports = router;