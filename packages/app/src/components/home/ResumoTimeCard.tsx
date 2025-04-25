import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: theme.spacing(2),
    height: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: '#fff',
  },
  itemList: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 1.6,
    paddingLeft: theme.spacing(2),
  },
}));

const ResumoTimeCard = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setItems([
        '🔁 3 Pull Requests mescladas',
        '✅ 5 tarefas concluídas',
        '📝 2 documentos atualizados',
        '🐛 1 bug crítico corrigido',
        '📦 Nova versão do LEDS HUB publicada',
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Card className={classes.card}>
      <Typography className={classes.sectionTitle}>Resumo do Time</Typography>
      <CardContent>
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          <ul className={classes.itemList}>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumoTimeCard;
