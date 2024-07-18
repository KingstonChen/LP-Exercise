import React, { forwardRef } from "react";
import { makeStyles } from "@mui/styles";
import { SnackbarContent } from "notistack";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#C94242",
    paddingLeft: "10px",
    borderRadius: "6px",
    boxShadow: 3,
    "@media (min-width:600px)": {
      minWidth: "350px"
    }
  },
  list: {
    color: "white"
  },
  listItem: {
    padding : "0px 10px"
  },
  button: {
    marginLeft: "auto",
    color: "white",
    padding: 0,
    textTransform: "none"
  },
  close: {
    color: "white",
    borderRadius: "0px"
  }
}));

const SaveErrorSnackbar = forwardRef((props, ref) => {
  const classes = useStyles();

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Failed to Like" />
        </ListItem>
        <Divider variant="full" component="li" />
        <ListItem className={classes.listItem}>
          <ListItemText primary={`${props.data.firstName} ${props.data.lastName} | ${props.data.email}`} />
        </ListItem>
      </List>
      <Button
        color="primary"
        size="small"
        className={classes.button}
        onClick={props.handleLike}
      >
        LIKE<br/>AGAIN
      </Button>
      <IconButton
        aria-label="close"
        className={classes.close}
        onClick={props.handleClose}
      >
        <CloseIcon />
      </IconButton>
    </SnackbarContent>
  );
});

export default SaveErrorSnackbar;


