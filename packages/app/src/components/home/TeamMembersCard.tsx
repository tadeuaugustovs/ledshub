import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  makeStyles,
  Link,
  Box,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    paddingBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  memberContainer: {
    textAlign: 'center',
  },
  avatar: {
    margin: 'auto',
    width: theme.spacing(5),
    height: theme.spacing(5),
    fontSize: '0.9rem',
  },
  name: {
    fontWeight: 500,
    textDecoration: 'none',
    fontSize: '0.875rem',
    display: 'block',
  },
  email: {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
  },
  footer: {
    textAlign: 'right',
    marginTop: theme.spacing(2),
  },
}));

const members = [
  { name: 'Alfredo', email: 'alfredo@example.com', link: '/catalog/default/user/alfredo' },
  { name: 'Claudia', email: 'claudia@example.com', link: '/catalog/default/user/claudia' },
  { name: 'Higor', email: 'higor@example.com', link: '/catalog/default/user/higor' },
  { name: 'Mariana', email: 'mariana@example.com', link: '/catalog/default/user/mariana' },
  { name: 'Marceline', email: 'marceline@example.com', link: '/catalog/default/user/marceline' },
  { name: 'Teddy', email: 'teddy@example.com', link: '/catalog/default/user/teddy' },
  { name: 'Yael', email: 'yael@example.com', link: '/catalog/default/user/yael' },
];

export const TeamMembersCard = () => {
  const classes = useStyles();

  const visibleMembers = members.slice(0, 6);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="subtitle1" className={classes.title}>
          Membros do LEDS
        </Typography>
        <Grid container spacing={1}>
          {visibleMembers.map((member, index) => (
            <Grid item xs={4} sm={3} md={2} key={index} className={classes.memberContainer}>
              <Link component={RouterLink} to={member.link} underline="none">
                <Avatar className={classes.avatar}>{member.name[0]}</Avatar>
                <Typography className={classes.name}>{member.name}</Typography>
              </Link>
              <Typography className={classes.email}>{member.email}</Typography>
            </Grid>
          ))}
        </Grid>
        <Box className={classes.footer}>
          <Link component={RouterLink} to="/catalog/default/group/leds" underline="always">
            Ver mais...
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};
