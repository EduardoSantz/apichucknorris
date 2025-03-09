require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');

// Configuração do Prisma
const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5500',
  methods: ['GET', 'POST', 'DELETE']
}));
app.use(express.json());

// Rotas
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { id, text, image } = req.body;
    
    const existing = await prisma.favorite.findUnique({ where: { id } });
    if (existing) return res.status(400).json({ error: 'Piada já favoritada' });

    const newFavorite = await prisma.favorite.create({
      data: { id, text, image }
    });
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Erro ao criar favorito:', error);
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    await prisma.favorite.delete({
      where: { id: req.params.id }
    });
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar favorito:', error);
    res.status(404).json({ error: 'Favorito não encontrado' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  prisma.$connect()
    .then(() => console.log('Conectado ao PostgreSQL'))
    .catch(err => console.error('Erro na conexão com o PostgreSQL:', err));
});