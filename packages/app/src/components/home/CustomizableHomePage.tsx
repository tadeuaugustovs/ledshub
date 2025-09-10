import React from 'react';
import { Grid, Card, CardHeader, CardContent, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { tools, notices, calendarEvents, homeConfig } from './home-data';

const CustomizableHomePage = () => {
  // 🔹 No futuro: pegar do catálogo ou do GitHub
  const userTeam = 'produtosInternos';
  const teamConfig = homeConfig[userTeam];

  return (
    <Grid container spacing={3}>
      {/* Boas-vindas */}
      <Grid item xs={12}>
        <Typography variant="h4">Bem-vindo ao LEDS HUB 👋</Typography>
        <Typography variant="subtitle1">Time: {userTeam}</Typography>
      </Grid>

      {/* Ferramentas globais */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Ferramentas Globais" />
          <CardContent>
            {tools.map(tool => (
              <Button
                key={tool.title}
                href={tool.link}
                target="_blank"
                startIcon={<span className="material-icons">{tool.icon}</span>}
                style={{ margin: '4px' }}
              >
                {tool.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Avisos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Avisos" />
          <CardContent>
            <List>
              {notices.map((notice, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${notice.title} (${notice.priority})`}
                    secondary={`${notice.content} - ${notice.date}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Eventos de calendário */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Próximos Eventos" />
          <CardContent>
            <List>
              {calendarEvents.map((event, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={event.title}
                    secondary={`${event.date} - ${event.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Ferramentas específicas do time */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Ferramentas do Time" />
          <CardContent>
            {teamConfig.tools.map(tool => (
              <Button
                key={tool.name}
                href={tool.url}
                target="_blank"
                style={{ margin: '4px' }}
              >
                {tool.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Issues do time */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Quadro de Issues" />
          <CardContent>
            <Button href={teamConfig.issues} target="_blank" variant="contained">
              Abrir Issues do Time
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomizableHomePage;
