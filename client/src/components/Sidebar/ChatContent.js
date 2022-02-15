import React from "react";
import { connect } from "react-redux";

import { Box, Typography, Badge } from "@material-ui/core";
import { Mail as MailIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, user } = props;
  const { latestMessageText, otherUser, unreadMessageData } = conversation;
  const { numOfUnreadMessages, senderId } = unreadMessageData;
  const { id: authUserId } = user;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {
        !!numOfUnreadMessages && senderId !== authUserId &&
        <Badge badgeContent={numOfUnreadMessages} color="primary">
          <MailIcon />
        </Badge>
      }
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(ChatContent);
