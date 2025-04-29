import React from "react"
import { makeStyles, Typography, Paper, Divider } from "@material-ui/core"
import { Event, AccessTime } from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
  calendarContainer: {
    backgroundColor: "#121212",
    borderRadius: 8,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  monthHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  monthTitle: {
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
  },
  eventItem: {
    marginBottom: theme.spacing(1.5),
  },
  eventTitle: {
    color: "#fff",
    fontWeight: 500,
    fontSize: "0.9rem",
    marginBottom: theme.spacing(0.5),
  },
  eventDate: {
    display: "flex",
    alignItems: "center",
    color: "#2196F3",
    fontSize: "0.8rem",
    marginBottom: theme.spacing(0.25),
  },
  eventTime: {
    display: "flex",
    alignItems: "center",
    color: "#aaa",
    fontSize: "0.8rem",
  },
  icon: {
    fontSize: 16,
    marginRight: theme.spacing(0.5),
  },
  divider: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    margin: `${theme.spacing(1.5)}px 0`,
  },
}))

type CalendarEvent = {
  title: string
  date: string
  time: string
}

type CalendarWidgetProps = {
  events: CalendarEvent[]
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events = [] }) => {
  const classes = useStyles()

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }

  // Se não houver eventos, exibir uma mensagem
  if (!events || events.length === 0) {
    return (
      <Paper elevation={0} className={classes.calendarContainer}>
        <div className={classes.monthHeader}>
          <Typography className={classes.monthTitle}>Maio 2023</Typography>
        </div>
        <Typography style={{ color: "#aaa", fontSize: "0.9rem", textAlign: "center", padding: "16px 0" }}>
          Nenhum evento agendado.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper elevation={0} className={classes.calendarContainer}>
      <div className={classes.monthHeader}>
        <Typography className={classes.monthTitle}>Maio 2023</Typography>
      </div>

      {events.map((event, index) => (
        <React.Fragment key={index}>
          <div className={classes.eventItem}>
            <Typography className={classes.eventTitle}>{event.title}</Typography>
            <Typography className={classes.eventDate}>
              <Event className={classes.icon} />
              {formatDate(event.date)}
            </Typography>
            <Typography className={classes.eventTime}>
              <AccessTime className={classes.icon} />
              {event.time}
            </Typography>
          </div>
          {index < events.length - 1 && <Divider className={classes.divider} />}
        </React.Fragment>
      ))}
    </Paper>
  )
}
