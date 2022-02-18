import React from 'react';
import { connect } from 'react-redux';

import { Box, Typography, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    width: '100%',
    position: 'relative',
  },
  username: {
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: '#9CADC8',
    letterSpacing: -0.17,
  },
  newMessageText: {
    fontWeight: 'heavy',
  },
  newMessageBadge: {
    position: 'absolute',
    right: '1.2em',
  },
}));

const ChatContent = props => {
  const classes = useStyles();

  const { conversation, user } = props;
  const { latestMessageText, otherUser, unreadMessageData } = conversation;
  const { id: authUserId } = user;

  const isNewMessage =
    unreadMessageData &&
    !!unreadMessageData.numOfUnreadMessages &&
    unreadMessageData.senderId !== authUserId;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            isNewMessage
              ? { ...classes.newMessageText, ...classes.previewText }
              : classes.previewText
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
      {isNewMessage && (
        <Badge
          className={classes.newMessageBadge}
          badgeContent={unreadMessageData.numOfUnreadMessages}
          color='primary'
        />
      )}
    </Box>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChatContent);
