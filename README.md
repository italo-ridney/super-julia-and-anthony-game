# Super Julia & Anthony

Jogo de plataforma 2D no estilo SNES com **Julia Ferreira** e **Anthony Ferreira**, parceiros Princesa Rosalina e Mario, cinco fases e o chefão **Bowser Negro**.

## Como jogar

Na raiz do projeto:

```bash
python3 -m http.server 8080
```

Abra no navegador: [http://localhost:8080](http://localhost:8080)

Ou: `./serve.sh`

(É necessário um servidor local por causa dos módulos ES. **Não** abra `index.html` pelo Finder — a tela fica preta.)

**Não abre?** Confira que o terminal está na pasta do jogo, que aparece `Serving HTTP on ... port 8080`, e recarregue com **Ctrl+Shift+R**. Se a porta estiver ocupada: `python3 -m http.server 8888` e use `http://localhost:8888`.

## Controles

| Ação | Teclas |
|------|--------|
| Esquerda / direita | ← → ou A / D |
| Pular | Espaço, Z, W ou ↑ |
| Correr | Shift ou X |
| Especial do parceiro | C ou K |
| Confirmar | Enter |
| Pausar | Esc ou P |

## Personagens

- **Julia** + **Princesa Rosalina** — pulo mais alto; especial aura estrela.
- **Anthony** + **Mario** — corre mais rápido e quebra tijolos em forma super; especial bola de fogo.

## Fases

1. Prado Florido  
2. Caverna Sombria  
3. Céu Atlético  
4. Trilha da Montanha  
5. Castelo Negro (porta leva à arena do chefão)

## Aviso

Projeto de fã com arte e música originais. Não é afiliado à Nintendo.
