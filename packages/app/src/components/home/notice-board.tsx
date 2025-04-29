import React from "react"
import { makeStyles, Typography, Divider, Chip } from "@material-ui/core"
import { Warning, Info, Announcement } from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
  noticeContainer: {
    marginBottom: theme.spacing(2),
  },
  noticeTitle: {
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(0.5),
  },
  noticeContent: {
    color: "#ccc",
    fontSize: "0.85rem",
    marginBottom: theme.spacing(0.5),
  },
  noticeDate: {
    color: "#999",
    fontSize: "0.75rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    margin: `${theme.spacing(1.5)}px 0`,
  },
  priorityHigh: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    color: "#f44336",
    fontSize: "0.7rem",
    height: 20,
  },
  priorityMedium: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
    color: "#ff9800",
    fontSize: "0.7rem",
    height: 20,
  },
  priorityNormal: {
    backgroundColor: "rgba(33, 150, 243, 0.2)",
    color: "#2196F3",
    fontSize: "0.7rem",
    height: 20,
  },
  icon: {
    fontSize: 16,
    marginRight: theme.spacing(0.5),
  },
}))

type Notice = {
  title: string
  content: string
  date: string
  priority: "high" | "medium" | "normal"
}

type NoticeBoardProps = {
  notices: Notice[]
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices = [] }) => {
  const classes = useStyles()

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return classes.priorityHigh
      case "medium":
        return classes.priorityMedium
      default:
        return classes.priorityNormal
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Warning className={classes.icon} />
      case "medium":
        return <Announcement className={classes.icon} />
      default:
        return <Info className={classes.icon} />
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      default:
        return "Normal"
    }
  }

  if (!notices || notices.length === 0) {
    return (
      <Typography style={{ color: "#aaa", fontSize: "0.9rem", textAlign: "center", padding: "16px 0" }}>
        Nenhum aviso disponível no momento.
      </Typography>
    )
  }

  return (
    <>
      {notices.map((notice, index) => (
        <React.Fragment key={index}>
          <div className={classes.noticeContainer}>
            <Typography className={classes.noticeTitle}>{notice.title}</Typography>
            <Typography className={classes.noticeContent}>{notice.content}</Typography>
            <div className={classes.noticeDate}>
              <span>{notice.date}</span>
              <Chip
                size="small"
                icon={getPriorityIcon(notice.priority)}
                label={getPriorityLabel(notice.priority)}
                className={getPriorityClass(notice.priority)}
              />
            </div>
          </div>
          {index < notices.length - 1 && <Divider className={classes.divider} />}
        </React.Fragment>
      ))}
    </>
  )
}
