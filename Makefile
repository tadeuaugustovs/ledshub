# Makefile para o Projeto Backstage
# Este arquivo automatiza os passos de instalação, build, teste e execução.

# --- Variáveis ---
# Define o nome da imagem Docker para ser facilmente alterado.
DOCKER_IMAGE_TAG := ledshub

# --- Alvos (Targets) ---

# O .PHONY declara que estes alvos não produzem arquivos com o mesmo nome.
# Isso garante que o 'make' sempre executará o comando, independentemente de
# existir um arquivo ou pasta com o nome 'install', 'build', etc.
.PHONY: all install build build-backend docker-build run test clean help

# Alvo padrão: executado quando você digita apenas 'make'
# Instala as dependências e depois constrói o projeto.
all: install build

# Alvo para instalar as dependências do projeto.
install:
	@echo "--- 📦 Instalando dependências do projeto... ---"
	yarn install
	@echo "--- ✅ Dependências instaladas com sucesso! ---"

# Alvo para compilar os artefatos do backend.
# Gera os arquivos bundle.tar.gz e skeleton.tar.gz.
build-backend:
	@echo "--- ⚙️  Compilando artefatos do backend... ---"
	yarn workspace backend build
	@echo "--- ✅ Artefatos do backend compilados! ---"

# Alvo para construir a imagem Docker.
# Depende do 'build-backend' para garantir que os artefatos existam.
docker-build: build-backend
	@echo "--- 🐳 Construindo a imagem Docker '$(DOCKER_IMAGE_TAG)'... ---"
	docker buildx build --tag $(DOCKER_IMAGE_TAG) -f packages/backend/Dockerfile .
	@echo "--- ✅ Imagem Docker construída com sucesso! ---"

# Alvo principal de build que encadeia os passos necessários.
build: docker-build
	@echo "--- ✨ Processo de build finalizado! ---"

# Alvo para executar o ambiente completo com Docker Compose.
run:
	@echo "--- 🚀 Iniciando a aplicação com Docker Compose... ---"
	docker compose up -d --build --force-recreate
	@echo "--- ✅ Aplicação iniciada! ---"
	@echo "Acesse no link: http://${APP_URL}:${APP_PORT}"

# Alvo para executar testes (atualmente um placeholder).
test:
	@echo "--- 🧪 Executando testes (placeholder)... ---"
	# Adicione aqui o seu comando de teste, por exemplo: yarn test

# Alvo para limpar os artefatos gerados pelo build.
clean:
	@echo "--- 🧹 Limpando artefatos de build... ---"
	rm -f packages/backend/bundle.tar.gz packages/backend/skeleton.tar.gz
	docker compose down
	@echo "--- ✅ Limpeza concluída. ---"

# Alvo de ajuda para listar e explicar os comandos disponíveis.
help:
	@echo "Comandos disponíveis no Makefile:"
	@echo "  make all          - Executa 'install' e 'build'."
	@echo "  make install      - Instala todas as dependências com yarn."
	@echo "  make build        - Compila o backend e constrói a imagem Docker."
	@echo "  make run          - Inicia a aplicação via Docker Compose."
	@echo "  make test         - (Placeholder) Executa a suíte de testes."
	@echo "  make clean        - Remove os artefatos gerados pelo build."
	@echo "  make help         - Mostra esta mensagem de ajuda."
