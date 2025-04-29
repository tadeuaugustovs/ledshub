"use client"

import { Page, Content } from "@backstage/core-components"
import { SearchContextProvider } from "@backstage/plugin-search-react"
import {
  makeStyles,
  Avatar,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Grid,
} from "@material-ui/core"
import { useUserProfile } from "@backstage/plugin-user-settings"
import { tools, notices } from "./home-data"
import { useEffect, useState } from "react"
import { CustomToolkit } from "./custom-toolkit"
import { NoticeBoard } from "./notice-board"

const useStyles = makeStyles((theme) => ({
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    width: "100%",
  },
  pageTitle: {
    color: "#fff",
    fontWeight: 600,
    fontSize: "1.5rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
  },
  userName: {
    fontWeight: 600,
    color: "#fff",
    fontSize: "1rem",
  },
  avatar: {
    border: "2px solid #2196F3",
    boxShadow: "0 0 10px rgba(33, 150, 243, 0.3)",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: "100%",
  },
  block: {
    backgroundColor: "rgba(30, 30, 30, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    padding: theme.spacing(2.4),
    width: "100%",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)",
    },
  },
  compactBlock: {
    backgroundColor: "rgba(30, 30, 30, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    padding: theme.spacing(1.6),
    width: "100%",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  issueList: {
    maxHeight: 300,
    overflowY: "auto",
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    backdropFilter: "blur(5px)",
    borderRadius: 12,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(33, 150, 243, 0.5)",
      borderRadius: "10px",
    },
  },
  sectionTitle: {
    color: "#fff",
    marginBottom: 16,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    "&::before": {
      content: '""',
      display: "block",
      width: "4px",
      height: "24px",
      backgroundColor: "#2196F3",
      marginRight: theme.spacing(1.5),
      borderRadius: "4px",
    },
  },
  compactSectionTitle: {
    color: "#fff",
    marginBottom: 12,
    fontWeight: 600,
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    "&::before": {
      content: '""',
      display: "block",
      width: "3px",
      height: "18px",
      backgroundColor: "#2196F3",
      marginRight: theme.spacing(1),
      borderRadius: "4px",
    },
  },
  listItem: {
    borderRadius: 8,
    marginBottom: 6,
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "rgba(33, 150, 243, 0.1)",
    },
  },
  issueNumber: {
    backgroundColor: "rgba(33, 150, 243, 0.2)",
    color: "#2196F3",
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: "0.75rem",
    marginRight: 8,
  },
  issueTitle: {
    color: "#fff",
    fontWeight: 500,
  },
  issueAuthor: {
    color: "#aaa",
    fontSize: "0.8rem",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  errorContainer: {
    padding: theme.spacing(2),
    color: "#ff6b6b",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 8,
    marginTop: theme.spacing(2),
  },
  toolkitContainer: {
    marginTop: theme.spacing(1),
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    width: "100%",
  },
  gridContainer: {
    width: "100%",
  },
}))


const GitHubIssuesWidget = () => {
  const classes = useStyles()
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("https://api.github.com/repos/tadeuaugustovs/homepage-test/issues?state=open")
      .then(async (res) => {
        const data = await res.json()
        if (Array.isArray(data)) {
          setIssues(data)
        } else {
          setError(data?.message || "Erro desconhecido")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Erro na conexão com o GitHub")
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size={40} style={{ color: "#2196F3" }} />
      </div>
    )

  if (error) {
    return (
      <Paper elevation={0} className={classes.block}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Tarefas gerais
        </Typography>
        <div className={classes.errorContainer}>
          <Typography variant="body2">{error}</Typography>
        </div>
      </Paper>
    )
  }

  return (
    <Paper elevation={0} className={classes.block}>
      <Typography variant="h6" className={classes.sectionTitle}>
        Tarefas gerais
      </Typography>
      <div className={classes.issueList}>
        <List dense>
          {issues.map((issue) => (
            <ListItem
              key={issue.id}
              button
              component="a"
              href={issue.html_url}
              target="_blank"
              className={classes.listItem}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <span className={classes.issueNumber}>#{issue.number}</span>
                    <span className={classes.issueTitle}>{issue.title}</span>
                  </Box>
                }
                secondary={<span className={classes.issueAuthor}>por {issue.user.login}</span>}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Paper>
  )
}

const TodoListFromGitHub = () => {
  const classes = useStyles()
  const [todos, setTodos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("https://api.github.com/repos/tadeuaugustovs/homepage-test/issues?state=open&labels=todo")
      .then(async (res) => {
        const data = await res.json()
        if (Array.isArray(data)) {
          setTodos(data)
        } else {
          setError(data?.message || "Erro desconhecido")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Erro na conexão com o GitHub")
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size={40} style={{ color: "#2196F3" }} />
      </div>
    )

  if (error)
    return (
      <Paper elevation={0} className={classes.block}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Minhas tarefas
        </Typography>
        <div className={classes.errorContainer}>
          <Typography variant="body2">{error}</Typography>
        </div>
      </Paper>
    )

  return (
    <Paper elevation={0} className={classes.block}>
      <Typography variant="h6" className={classes.sectionTitle}>
        Minhas tarefas
      </Typography>
      <div className={classes.issueList}>
        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              button
              component="a"
              href={todo.html_url}
              target="_blank"
              className={classes.listItem}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <span className={classes.issueNumber}>#{todo.number}</span>
                    <span className={classes.issueTitle}>{todo.title}</span>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Paper>
  )
}

export const HomePage = () => {
  const classes = useStyles()
  const { profile } = useUserProfile()

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <div className={classes.pageHeader}>
            <Typography variant="h4" className={classes.pageTitle}>
              Home
            </Typography>
            <div className={classes.userInfo}>
              <Typography variant="body1" className={classes.userName}>
                {profile?.displayName ?? "Usuário"}
              </Typography>
              <Avatar alt={profile?.displayName ?? "Usuário"} src={profile?.picture} className={classes.avatar} />
            </div>
          </div>

          <div className={classes.mainContent}>
            <Grid container spacing={3} className={classes.gridContainer}>
              <Grid item xs={12} md={8}>
                <div className={classes.wrapper}>
                  <TodoListFromGitHub />
                </div>
                <div className={classes.wrapper}>
                  <GitHubIssuesWidget />
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={0} className={classes.compactBlock}>
                  <Typography variant="subtitle1" className={classes.compactSectionTitle}>
                    Acesso Rápido
                  </Typography>
                  <div className={classes.toolkitContainer}>
                    <CustomToolkit tools={tools} />
                  </div>
                </Paper>

                <Paper elevation={0} className={classes.compactBlock} style={{ marginTop: 24 }}>
                  <Typography variant="subtitle1" className={classes.compactSectionTitle}>
                    Quadro de Avisos
                  </Typography>
                  <div className={classes.toolkitContainer}>
                    <NoticeBoard notices={notices || []} />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Content>
      </Page>
    </SearchContextProvider>
  )
}
