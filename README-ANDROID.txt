DESCOMPLICA — INSTALAÇÃO PELO CHROME NO ANDROID

O que vem neste projeto
- Aplicativo PWA instalável pelo Chrome.
- Tarefas Hoje, Depois e Hábito.
- Minha organização + Meus grupos.
- Grupos e subgrupos.
- Anotações e links/vídeos dentro de cada grupo.
- Tarefas ligadas ao grupo aparecem na organização geral e dentro do grupo, sem duplicar.
- Confirmação antes de excluir.
- Salvamento local no aparelho e funcionamento offline após o primeiro acesso.

IMPORTANTE
Para o Chrome oferecer “Instalar app” e permitir o modo offline, os arquivos precisam estar publicados em um endereço HTTPS. Abrir o index.html diretamente pelo gerenciador de arquivos não ativa a instalação PWA completa.
Os dados ficam neste aparelho/neste navegador. Limpar os dados do Chrome pode apagar suas tarefas. Faça backup antes de trocar de aparelho.

PUBLICAR PELO CELULAR (GitHub Pages — opção gratuita)
1. Extraia o arquivo ZIP no celular usando o app Arquivos/Meus Arquivos.
2. No Chrome, entre em https://github.com e crie uma conta ou faça login.
3. Crie um repositório novo chamado descomplica. Pode deixar público e marcar “Add a README” desativado.
4. Dentro do repositório, use Add file > Upload files.
5. Envie o CONTEÚDO da pasta descomplica_pwa (index.html, style.css, app.js, manifest.json, service-worker.js, README-ANDROID.txt e a pasta icons). Não envie a pasta ZIP sem extrair.
   Se o seletor do Android não permitir escolher a pasta inteira, envie os arquivos principais primeiro e depois envie os dois PNGs para uma pasta chamada icons. No GitHub, crie a pasta icons ao enviar os PNGs usando o caminho icons/icon-192.png e icons/icon-512.png.
6. Confirme em Commit changes.
7. No repositório, abra Settings > Pages.
8. Em Build and deployment, escolha Deploy from a branch. Branch: main; Folder: /(root). Salve.
9. Aguarde a publicação. O endereço será parecido com:
   https://SEU-USUARIO.github.io/descomplica/
10. Abra esse endereço no Chrome do Android. Menu ⋮ > Instalar app (ou “Adicionar à tela inicial”).
11. Abra pelo ícone Descomplica na tela inicial. Na primeira abertura com internet, espere carregar; depois o app poderá abrir offline.

USO
- Digite algo em “Tirar da cabeça” e toque Adicionar.
- Na lista, toque na setinha para abrir detalhes, mudar categoria/grupo ou excluir.
- Em Meus grupos, crie um grupo. Abra-o para adicionar tarefas, anotações, subgrupos e links.
- Excluir grupo pede confirmação. As tarefas dele são mantidas e ficam “Sem grupo”.

LIMITAÇÕES DESTA PRIMEIRA VERSÃO
- O título do link/vídeo é manual. Buscar título automaticamente exige integração externa.
- Os dados são locais no navegador e não sincronizam entre aparelhos.
- Esta versão não tem conta/login nem backup em nuvem. Não limpe os dados do Chrome sem exportar/guardar informações importantes.
