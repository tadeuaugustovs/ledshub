import type React from "react"
import { makeStyles, Card, CardContent, Typography, Link as MuiLink } from "@material-ui/core"
import {
  Description,
  Code,
  Category,
  AddCircle,
  School,
  Security,
  Chat, // Substituindo SmartToy
  BarChart, // Substituindo Analytics
  Brush, // Substituindo DesignServices
  AccountTree,
} from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
  toolCard: {
    backgroundColor: "#121212",
    borderRadius: 8,
    transition: "transform 0.2s, background-color 0.2s",
    height: "100%",
    "&:hover": {
      transform: "translateY(-4px)",
      backgroundColor: "rgba(33, 150, 243, 0.1)",
    },
  },
  toolContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(1.5),
    height: "100%",
  },
  toolIcon: {
    fontSize: 24,
    color: "#2196F3",
    marginRight: theme.spacing(1.5),
  },
  toolTitle: {
    color: "#fff",
    fontWeight: 500,
    fontSize: "0.9rem",
  },
  link: {
    textDecoration: "none",
    display: "block",
    height: "100%",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: theme.spacing(2),
    width: "100%",
  },
}))

// Helper function to get the correct icon based on the icon name
const getIcon = (iconName: string) => {
  switch (iconName) {
    case "workflow":
      return <AccountTree />
    case "smart_toy":
      return <Chat /> // Substituído SmartToy por Chat
    case "analytics":
      return <BarChart /> // Substituído Analytics por BarChart
    case "security":
      return <Security />
    case "design_services":
      return <Brush /> // Substituído DesignServices por Brush
    case "school":
      return <School />
    case "description":
      return <Description />
    case "code":
      return <Code />
    case "category":
      return <Category />
    case "add_circle":
      return <AddCircle />
    default:
      return <Description />
  }
}

type Tool = {
  title: string
  link: string
  icon: string
}

type CustomToolkitProps = {
  tools: Tool[]
}

export const CustomToolkit: React.FC<CustomToolkitProps> = ({ tools }) => {
  const classes = useStyles()

  return (
    <div className={classes.gridContainer}>
      {tools.map((tool, index) => (
        <MuiLink href={tool.link} className={classes.link} key={index}>
          <Card className={classes.toolCard} elevation={0}>
            <CardContent className={classes.toolContent}>
              <div className={classes.toolIcon}>{getIcon(tool.icon)}</div>
              <Typography variant="body2" className={classes.toolTitle}>
                {tool.title}
              </Typography>
            </CardContent>
          </Card>
        </MuiLink>
      ))}
    </div>
  )
}
