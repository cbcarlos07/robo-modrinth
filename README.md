# Robô para chegar atualização do Modrinth

## Baixe o projeto com o git clone

Acesso o terminal e clone o projeto

Dê o git clone no projeto

```
git clone https://github.com/cbcarlos07/robo-modrinth
```
Após isso acesse o diretório do projeto

```
cd robo-modrinth
```

## Instale as dependências

O projeto foi desenvolvido em Node.JS na versão 12.18.1

Execute o comando 

```
npm i 
```

Crie o arquivo chamado .env

Copie as informações do arquivo .env.example

Ajuste as variáveis conforme o seu projeto

Para gerar um hash md5 para o seu e-mail acesse o siste (md5hashgenerator)[https://www.md5hashgenerator.com/]

Coloque o seu e-mail clique em gerar ou use alguma Inteligência Artificial para gerar o hash md5 de seu email

Após gerado o hash do seu e-mail, coloque-o na variável `DEFAULT_EMAIL` dentro do arquivo `.env`

## Execute o projeto

Para executar o projeto digite o comando dentro do diretório do projeto:

```
npm run dev
```

O projeto começará a verificar a cada 30 segundos no seu projeto



betinho@gmail.com
