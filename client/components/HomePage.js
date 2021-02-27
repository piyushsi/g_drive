import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Axios from "axios";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  head: {
    height: "35vh",
    backgroundColor: "#3f51b5",
    textAlign: "center",
  },
  head_1: {
    color: "white",
  },
  center: { textAlign: "center" },
  head_0: {
    paddingTop: "5rem",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function HomePage(props) {
  const classes = useStyles();

  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState(false);

  const [selected, setSelected] = useState(null);
  const [type, setType] = useState("folder");
  const [name, setName] = useState(`Sub${selected}`);
  const [size, setSize] = useState(`0Kb`);
  const [format, setFormat] = useState(`noFormat`);
  const [id, setId] = useState(null);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleClickOpen = (e) => {
    setSelected(e.name);
    setId(e._id);
    setOpen(true);
  };

  const handleClose = (mes) => {
    if (mes == "post") {
      createNew();
    }
    if (mes == "delete") {
      deleteDir();
    }
    setOpen(false);
  };
  const createNew = () => {
    Axios.post("/api/v1/create", {
      name,
      format,
      size,
      id,
      type,
    }).then((res) => console.log(res));
    checkHome();
  };
  const createHome = () => {
    Axios.post("/api/v1/create", {
      name: "/",
      format: "folder",
      id: "home",
      type: "folder",
    }).then((res) => console.log(res));
    checkHome();
  };

  const checkHome = () => {
    Axios.get("/api/v1").then((res) => setData(res.data));
  };
  var uid = 0;
  const treeData = (obj, isChild) => {
    uid++;
    var value = {
      isFolder: obj.isFolder,
      _id: obj._id,
      id: "root",
      name: "/ (root)",
      children: obj.directory.map((el) => {
        return {
          id: uid,
          _id: el._id,
          name: el.isFolder ? el.name : el.name + "." + el.format.toLowerCase(),
          isFolder: el.isFolder,
          children: el.directory[0] ? treeData(el, true) : [],
        };
      }),
    };
    return isChild ? value.children : value;
  };

  const renderTree = (nodes) => {
    return (
      <TreeItem
        onLabelClick={(event) => {
          event.preventDefault();
          nodes.isFolder ? handleClickOpen(nodes) : "";
        }}
        onMouseOver={(event) =>
          event.target.innerText
            ? (event.target.style.cursor = "cell")
            : (event.target.style.cursor = "pointer")
        }
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  const deleteDir = () => {
    Axios.post("/api/v1/delete", {
      id,
    }).then((res) => console.log(res));
    checkHome();
  };

  useEffect(() => {
    checkHome();
  }, []);

  return (
    <div className={classes.root}>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.head}>
          <div className={classes.head_0}>
            <Typography
              variant="h3"
              className={classes.head_1}
              component="h2"
              gutterBottom
            >
              G Drive Basic Implementation.
            </Typography>
            <Typography
              variant="h5"
              className={classes.head_1}
              component="h2"
              gutterBottom
            >
              G_Drive design for Folder and File Structure.
            </Typography>
          </div>
        </div>
      </main>
      <main>
        {data.sucess ? (
          <div className={classes.center}>
            <button onClick={() => createHome()}>Create Root</button>
          </div>
        ) : (
          ""
        )}
        {data.data ? (
          <>
            {data.data.homeDirectory && (
              <TreeView
                className={classes.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={["root"]}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                {data.data.homeDirectory.directory
                  ? renderTree(treeData(data.data.homeDirectory))
                  : ""}
              </TreeView>
            )}
          </>
        ) : (
          ""
        )}
      </main>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {`Add SubFolder or SubFiles for ${selected}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <TextField
                id="standard-basic"
                label="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  onChange={handleChange}
                >
                  <MenuItem value={"file"}>File</MenuItem>
                  <MenuItem value={"folder"}>Folder</MenuItem>
                </Select>
              </FormControl>{" "}
              <br />
              {type == "file" ? (
                <>
                  <TextField
                    id="standard-basic"
                    label="Size"
                    onChange={(e) => setSize(e.target.value)}
                  />{" "}
                  <br />
                  <TextField
                    id="standard-basic"
                    label="Format"
                    onChange={(e) => setFormat(e.target.value)}
                  />
                </>
              ) : (
                ""
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => handleClose("delete")}
              color="secondary"
            >
              delete {selected}
            </Button>
            <Button autoFocus onClick={handleClose} color="primary">
              Cancel
            </Button>

            <Button
              onClick={() => handleClose("post")}
              color="primary"
              autoFocus
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default HomePage;
