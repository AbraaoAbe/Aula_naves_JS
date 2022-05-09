function start() { // Inicio da função start()

    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class = 'anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class = 'anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class = 'anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Principais variáveis do jogo

    var jogo = {}
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var fimdejogo = false;

    var TECLA = {
        W: 87,
        UP_ARROW: 38,
        DOWN_ARROW: 40,
        S: 83,
        SPACEBAR: 32,
    }

    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function() {
        musica.currentTime = 0;
        musica.play();
    }, false);
    musica.play();

    jogo.pressionou = [];

    //Verifica se o usuário pressionou alguma tecla	

    $(document).keydown(function(e) {
        jogo.pressionou[e.which] = true;

        //FUNCAO QUE PERMITE CANCELAR A ROLAGEM DEFAULT DAS SETAS E BARRA DE ESPAÇO
        e.preventDefault();
    });


    $(document).keyup(function(e) {
        jogo.pressionou[e.which] = false;
    });

    //Game Loop

    jogo.timer = setInterval(loop, 30);

    function loop() {

        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();

    } // Fim da função loop()



    //Função que movimenta o fundo do jogo

    function movefundo() {

        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 1);

    } // fim da função movefundo()

    function movejogador() {
        //detecta as teclas W ou Up_arrow se forem pressionadas SUBTRAI 10px da posicao topo do jogador
        if (jogo.pressionou[TECLA.W] || jogo.pressionou[TECLA.UP_ARROW]) {

            var topo = parseInt($("#jogador").css("top"));

            //Limita a movimentacao na tela (nao deixa subir muito)
            if (topo <= 10) {
                //NAO FAZ NADA
            } else {
                $("#jogador").css("top", topo - 10);
            }

        }

        //detecta as teclas S ou Down_arrow se forem pressionadas SOMA 10px da posicao topo do jogador
        if (jogo.pressionou[TECLA.S] || jogo.pressionou[TECLA.DOWN_ARROW]) {



            var topo = parseInt($("#jogador").css("top"));
            //Limita a movimentacao na tela (nao deixa descer muito)
            if (topo >= 434) {
                //NAO FAZ NADA
            } else {
                $("#jogador").css("top", topo + 10);
            }
        }

        if (jogo.pressionou[TECLA.SPACEBAR]) {

            //Chama função Disparo
            console.log('tiro');
            disparo();
        }

    } // fim da função movejogador()

    function moveinimigo1() {
        //retorna a posicao no eixo X do inimigo
        posicaoX = parseInt($("#inimigo1").css("left"));
        //atualiza a posicao X gradualmente com o - velocidade
        $("#inimigo1").css("left", posicaoX - velocidade);

        //!RETIRADO POR SER INICIALMENTE REDUNDANTE
        //!atualiza a posicao Y assim que passa dentro do if
        //$("#inimigo1").css("top", posicaoY);

        if (posicaoX <= 0) {
            // altera a posicao Y do inimigo 1 
            posicaoY = parseInt(Math.random() * 334);
            // retorna o inimigo para o canto da tela inical que ele sai
            $("#inimigo1").css("left", 694);
            //atribui
            $("#inimigo1").css("top", posicaoY);

        }
    } //Fim da função moveinimigo1()

    function moveinimigo2() {
        //retorna a posicao x do inimigo 2
        posicaoX = parseInt($("#inimigo2").css("left"));
        //caminha com o inimigo para a esquerda
        $("#inimigo2").css("left", posicaoX - 3);

        //quando ele chega no final da tela ele retorna
        if (posicaoX <= 0) {

            $("#inimigo2").css("left", 775);

        }
    } // Fim da função moveinimigo2()

    function moveamigo() {
        //retorna a posicao x do amigo
        posicaoX = parseInt($("#amigo").css("left"));
        //caminha com o amigo para a direita
        $("#amigo").css("left", posicaoX + 1);

        //retorna o amigo ao canto esquerdo da tela caso ele chegue ao final
        if (posicaoX > 906) {

            $("#amigo").css("left", 0);

        }

    } // fim da função moveamigo()

    function disparo() {

        //verifica se o jogador pode atirar
        if (podeAtirar == true) {
            somDisparo.play();
            //inibe de poder atirar novamente temporariamente (pro jogo nao ficar robado)
            podeAtirar = false;

            //retorna a posicao X e Y do jogador para saber de onde vai sair o tiro
            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))

            //ajeita a posicao para o tiro sair na ponta do helicoptero 
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            //cria a div disparo
            $("#fundoGame").append("<div id='disparo'></div");
            //posiciona a o tiro na ponta do helicoptero
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            //cria uma funcao de tempo para andar com o tiro na tela
            var tempoDisparo = window.setInterval(executaDisparo, 30);

        } //Fecha podeAtirar

        function executaDisparo() {
            //pega a posicao atual do disparo e faz caminhar na tela pra direita
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            //o tiro chegou ao final da tela
            if (posicaoX > 900) {
                //para a funcao de tempo
                window.clearInterval(tempoDisparo);
                //seta null para o tempoDisparo
                tempoDisparo = null;
                //remove a div do tiro
                $("#disparo").remove();
                //permite o jogador atirar novamente
                podeAtirar = true;

            }
        } // Fecha executaDisparo()
    } // Fecha disparo()

    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));


        //! jogador com o inimigo1
        console.log(colisao1);
        //caso tenha colisao
        if (colisao1.length > 0) {

            energiaAtual--;
            //efeito de explosão no exato local do inimigo 1
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            //reposiciona o inimigo 1 a esquerda da tela novamente
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //! jogador com o inimigo2 
        if (colisao2.length > 0) {

            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();

        }

        //! Disparo com o inimigo1

        if (colisao3.length > 0) {

            velocidade = velocidade + 0.3;

            pontos = pontos + 100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            //faz a explosão e remove o disparo da tela
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);


        }

        //! Disparo com o inimigo2

        if (colisao4.length > 0) {

            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();

        }

        //! jogador com o amigo

        if (colisao5.length > 0) {
            somResgate.play();
            salvos++;
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //!Inimigo2 com o amigo

        if (colisao6.length > 0) {

            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();

            reposicionaAmigo();

        }


    } //Fim da função colisao()

    //!Explosão 1
    function explosao1(inimigo1X, inimigo1Y) {
        somExplosao.play();
        //cria a div de explosão
        $("#fundoGame").append("<div id='explosao1'></div");
        //loga o png de explosão
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        //atribui a div para uma var para facilitar
        var div = $("#explosao1");
        //indica a posicao X e Y onde a explosão ira aparecer
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        //anima a div, faz ela crescer ate 200 e a opacidade sumir, em slow
        div.animate({ width: 200, opacity: 0 }, "slow");

        //vaiavel de tempo para remover a explosão
        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            //remove a div
            div.remove();
            //apaga a variavel de tempo
            window.clearInterval(tempoExplosao);
            //seta o tempo explosao para null
            tempoExplosao = null;

        }

    } // Fim da função explosao1()

    //!Explosão2

    function explosao2(inimigo2X, inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {

            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;

        }


    } // Fim da função explosao2()

    //!Explosão3

    function explosao3(amigoX, amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;

        }

    } // Fim da fun��o explosao3


    //Reposiciona Inimigo2

    function reposicionaInimigo2() {
        //so reposiciona o inimigo 2 depois de 5 segundos
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {

                $("#fundoGame").append("<div id=inimigo2></div");

            }

        }
    }

    //Reposiciona Amigo

    function reposicionaAmigo() {

        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimdejogo == false) {

                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

            }

        }

    } // Fim da função reposicionaAmigo()

    function placar() {

        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

    } //fim da função placar()

    //Barra de energia

    function energia() {

        if (energiaAtual == 3) {

            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual == 2) {

            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual == 1) {

            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual == 0) {

            $("#energia").css("background-image", "url(imgs/energia0.png)");

            //Game Over
            gameOver();
        }

    } // Fim da função energia()

    //Função GAME OVER
    function gameOver() {
        //seta a variavel fim de jogo
        fimdejogo = true;
        //pausa as musicas
        musica.pause();
        //toca o gameover
        somGameover.play();

        //cessa o looping do jogo
        window.clearInterval(jogo.timer);
        jogo.timer = null;

        //remove todas as divs do game
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        //cria-se uma nova div do game
        $("#fundoGame").append("<div id='fim'></div>");
        //mensagem final + cria uma nova div pra reiniciar o jogo
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><button>Jogar Novamente</button></div>");
    } // Fim da função gameOver();

} // Fim da função start

//Reinicia o Jogo

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();

} //Fim da função reiniciaJogo